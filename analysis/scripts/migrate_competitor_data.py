import pandas as pd
import json
from pathlib import Path
from typing import Dict, List
import sys
import os

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from backend.models.database import SessionLocal, engine
from backend.models.keyword import Keyword

# Competitor site mappings
COMPETITOR_SITES = {
    "tokyocheapo.com": "Tokyo Cheapo",
    "www.japan.travel": "Japan Travel",
    "www.timeout.jp": "Timeout Tokyo",
    "www.gotokyo.org": "Go Tokyo"
}

def safe_get(data, key, default=None):
    """Safely get value from data, handling NaN values"""
    value = data.get(key, default)
    if pd.isna(value) if hasattr(pd, 'isna') else (value is None or str(value).lower() == 'nan'):
        return default
    return value

def extract_site_name_from_filename(filename: str) -> str:
    """Extract site name from CSV filename"""
    if "tokyocheapo.com" in filename:
        return "tokyocheapo.com"
    elif "japan.travel" in filename:
        return "www.japan.travel"
    elif "timeout.jp" in filename:
        return "www.timeout.jp"
    elif "gotokyo.org" in filename:
        return "www.gotokyo.org"
    else:
        return "unknown"

def migrate_competitor_data(csv_file: str):
    """Migrate competitor data from CSV to database"""
    print(f"🔄 Processing {csv_file}...")
    
    try:
        # Read CSV file
        df = pd.read_csv(csv_file)
        print(f"   📊 Loaded {len(df)} records")
        
        # Extract site name from filename
        site_name = extract_site_name_from_filename(csv_file)
        display_name = COMPETITOR_SITES.get(site_name, site_name)
        
        print(f"   🏢 Site: {site_name} ({display_name})")
        
        # Create database session
        db = SessionLocal()
        
        try:
            # Clear existing data for this competitor
            db.query(Keyword).filter(Keyword.competitor_site == site_name).delete()
            
            # Prepare data for bulk insert
            keywords = []
            total_traffic = 0
            total_volume = 0
            position_sum = 0
            position_count = 0
            
            for _, row in df.iterrows():
                # Handle NaN values and convert to appropriate types
                keyword = Keyword(
                    competitor_site=site_name,
                    keyword=str(safe_get(row, 'Keyword', '')),
                    country_code=str(safe_get(row, 'Country code', '')),
                    location=str(safe_get(row, 'Location', '')),
                    entities=str(safe_get(row, 'Entities', '')),
                    serp_features=str(safe_get(row, 'SERP features', '')),
                    volume=int(float(safe_get(row, 'Volume', 0) or 0)),
                    keyword_difficulty=float(safe_get(row, 'KD', 0) or 0),
                    cpc=float(safe_get(row, 'CPC', 0) or 0),
                    organic_traffic=int(float(safe_get(row, 'Organic traffic', 0) or 0)),
                    paid_traffic=int(float(safe_get(row, 'Paid traffic', 0) or 0)),
                    current_position=int(float(safe_get(row, 'Current position', 999) or 999)) if safe_get(row, 'Current position') else 999,
                    current_url=str(safe_get(row, 'Current URL', '')),
                    current_url_inside=bool(safe_get(row, 'Current URL inside', False)),
                    navigational=bool(safe_get(row, 'Navigational', False)),
                    informational=bool(safe_get(row, 'Informational', False)),
                    commercial=bool(safe_get(row, 'Commercial', False)),
                    transactional=bool(safe_get(row, 'Transactional', False)),
                    branded=bool(safe_get(row, 'Branded', False)),
                    local=bool(safe_get(row, 'Local', False))
                )
                keywords.append(keyword)
                
                # Calculate site statistics
                total_traffic += keyword.organic_traffic
                total_volume += keyword.volume
                if keyword.current_position < 999:
                    position_sum += keyword.current_position
                    position_count += 1
            
            # Bulk insert
            db.add_all(keywords)
            
            # Note: Competitor site statistics will be calculated dynamically
            
            db.commit()
            
            print(f"   ✅ Successfully migrated {len(keywords)} keywords")
            print(f"   📈 Total traffic: {total_traffic:,}")
            print(f"   📊 Total volume: {total_volume:,}")
            print(f"   📍 Average position: {position_sum / position_count if position_count > 0 else 0:.1f}")
            
        except Exception as e:
            db.rollback()
            print(f"   ❌ Database error: {e}")
            raise
        finally:
            db.close()
            
    except Exception as e:
        print(f"   ❌ Migration error: {e}")
        raise

def main():
    """Main processing function"""
    csv_files = [
        "csv/tokyocheapo.com-organic-keywords-subdomains_2025-09-26_06-53-48.csv",
        "csv/www.japan.travel-en-organic-keywords-path-a_2025-09-26_06-54-29.csv",
        "csv/www.timeout.jp-tokyo-organic-keywords-path_2025-09-26_06-48-49.csv",
        "csv/www.gotokyo.org-jp-index.html-organic-keywor_2025-09-26_06-47-14.csv"
    ]
    
    print("🚀 Starting competitor data migration...")
    
    print("✅ Database tables ready")
    
    for csv_file in csv_files:
        if Path(csv_file).exists():
            migrate_competitor_data(csv_file)
        else:
            print(f"❌ File not found: {csv_file}")
    
    print("🎉 Competitor data migration completed!")

if __name__ == "__main__":
    main()
