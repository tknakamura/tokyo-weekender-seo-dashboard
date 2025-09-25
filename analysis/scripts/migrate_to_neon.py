"""
CSVデータをNEONデータベースに移行するスクリプト
"""
import pandas as pd
import json
from pathlib import Path
from typing import Dict, List
import sys
import os

# Add backend to path
sys.path.append(str(Path(__file__).parent.parent.parent / "backend"))

from backend.models.database import SessionLocal, engine
from backend.models.keyword import Keyword, Base
from backend.services.database_service import DatabaseService

def create_tables():
    """Create all tables in the database"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ データベーステーブルが作成されました")
    except Exception as e:
        print(f"❌ テーブル作成エラー: {e}")
        raise

def load_csv_data(csv_path: str) -> List[Dict]:
    """Load CSV data and convert to list of dictionaries"""
    try:
        df = pd.read_csv(csv_path)
        print(f"📊 CSVデータを読み込みました: {len(df)} 行")
        
        # Convert to list of dictionaries
        data = df.to_dict('records')
        return data
    except Exception as e:
        print(f"❌ CSV読み込みエラー: {e}")
        raise

def migrate_data(csv_path: str):
    """Migrate CSV data to NEON database"""
    try:
        # Create tables
        create_tables()
        
        # Load CSV data
        keywords_data = load_csv_data(csv_path)
        
        # Insert data using database service
        db = SessionLocal()
        try:
            service = DatabaseService(db)
            inserted_count = service.bulk_insert_keywords(keywords_data)
            print(f"✅ {inserted_count} 件のキーワードデータを挿入しました")
            
            # Get and display summary
            summary = service.get_keywords_summary()
            print("\n📈 移行後のサマリー:")
            print(f"  総キーワード数: {summary['total_keywords']:,}")
            print(f"  総検索ボリューム: {summary['total_volume']:,}")
            print(f"  総トラフィック: {summary['total_traffic']:,}")
            print(f"  平均順位: {summary['avg_position']:.1f}")
            print(f"  トップ3キーワード数: {summary['top_performing_keywords']:,}")
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ データ移行エラー: {e}")
        raise

def main():
    """メイン処理"""
    csv_file = "data/raw/www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-05-37.csv"
    
    if not Path(csv_file).exists():
        print(f"❌ CSVファイルが見つかりません: {csv_file}")
        return
    
    print("🚀 Tokyo Weekender データをNEONデータベースに移行開始...")
    migrate_data(csv_file)
    print("✅ 移行完了!")

if __name__ == "__main__":
    main()
