"""
Simple Tokyo Weekender SEO Analysis Dashboard - FastAPI Backend
This version works without database dependencies for immediate deployment
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import pandas as pd
from typing import Dict, List, Optional
import uvicorn

app = FastAPI(
    title="Tokyo Weekender SEO Dashboard API",
    description="Tokyo WeekenderのOrganic Growth分析API",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://tokyo-weekender-seo-dashboard.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データファイルのパス
DATA_PATH = Path("data/processed")
RAW_DATA_PATH = Path("data/raw")

@app.on_event("startup")
async def startup_event():
    """アプリケーション起動時の処理"""
    print("🚀 Tokyo Weekender Backend starting up...")
    # データディレクトリの作成
    DATA_PATH.mkdir(parents=True, exist_ok=True)
    RAW_DATA_PATH.mkdir(parents=True, exist_ok=True)
    print("✅ Data directories created")

@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "Tokyo Weekender SEO Analysis Dashboard API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    """ヘルスチェック"""
    return {"status": "healthy", "message": "Tokyo Weekender Backend is running"}

@app.get("/api/test")
async def test_endpoint():
    """テストエンドポイント"""
    return {
        "message": "Backend is working!",
        "timestamp": "2025-09-27T01:49:00Z",
        "version": "1.0.0"
    }

def find_csv_file():
    """CSVファイルを検索"""
    csv_files = [
        RAW_DATA_PATH / "www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-49-18.csv",
        Path("csv/www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-49-18.csv"),
        Path("data/raw/www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-49-18.csv"),
        Path("www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-49-18.csv")
    ]
    
    for file_path in csv_files:
        if file_path.exists():
            print(f"✅ Found CSV file: {file_path}")
            return file_path
    
    print("❌ No CSV file found")
    return None

@app.get("/api/keywords/search")
async def search_keywords(
    min_volume: int = 100,
    max_position: int = 50,
    intent: str = "",
    location: str = "",
    limit: int = 100
):
    """キーワード検索（フィルター条件付き）"""
    try:
        csv_file = find_csv_file()
        if not csv_file:
            raise HTTPException(status_code=404, detail="キーワードデータが見つかりません")
        
        df = pd.read_csv(csv_file)
        print(f"📊 Loaded {len(df)} keywords from CSV")
        
        # Apply filters
        if min_volume > 0:
            df = df[df['Volume'] >= min_volume]
        
        if max_position > 0:
            df = df[df['Current position'] <= max_position]
        
        if intent:
            if intent in df.columns:
                df = df[df[intent] == True]
        
        if location:
            df = df[df['Location'] == location]
        
        # Sort and limit
        df = df.sort_values(['Organic traffic', 'Current position'], ascending=[False, True])
        df = df.head(limit)
        
        result = df.to_dict('records')
        print(f"📈 Returning {len(result)} filtered keywords")
        return result
        
    except Exception as e:
        print(f"❌ Search error: {e}")
        raise HTTPException(status_code=500, detail=f"キーワード検索に失敗: {str(e)}")

@app.get("/api/keywords/locations")
async def get_available_locations():
    """利用可能な国・地域リストの取得"""
    try:
        csv_file = find_csv_file()
        if not csv_file:
            raise HTTPException(status_code=404, detail="キーワードデータが見つかりません")
        
        df = pd.read_csv(csv_file)
        print(f"📊 Loaded {len(df)} keywords for location analysis")
        
        # Get unique locations with counts
        location_counts = df['Location'].value_counts().head(10)
        locations = []
        
        for location, count in location_counts.items():
            if pd.notna(location) and location != '':
                total_traffic = df[df['Location'] == location]['Organic traffic'].sum()
                locations.append({
                    'location': location,
                    'keyword_count': int(count),
                    'total_traffic': int(total_traffic) if pd.notna(total_traffic) else 0
                })
        
        print(f"🌍 Returning {len(locations)} locations")
        return locations
        
    except Exception as e:
        print(f"❌ Locations error: {e}")
        raise HTTPException(status_code=500, detail=f"国・地域リストの取得に失敗: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
