"""
Tokyo Weekender SEO Analysis Dashboard - FastAPI Backend with NEON Database
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import pandas as pd
from typing import Dict, List, Optional
import uvicorn
from sqlalchemy.orm import Session

# Import database components
from backend.models.database import get_db, engine, Base
from backend.services.database_service import DatabaseService

app = FastAPI(
    title="Tokyo Weekender SEO Dashboard API",
    description="Tokyo WeekenderのOrganic Growth分析API with NEON Database",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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
    # データディレクトリの作成
    DATA_PATH.mkdir(parents=True, exist_ok=True)
    RAW_DATA_PATH.mkdir(parents=True, exist_ok=True)
    
    # データベーステーブルの作成（開発環境用）
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ データベーステーブルが準備されました")
    except Exception as e:
        print(f"⚠️ データベース接続エラー: {e}")
        print("NEONデータベースの設定を確認してください")

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
    return {"status": "healthy"}

@app.get("/api/analysis/summary")
async def get_analysis_summary(db: Session = Depends(get_db)):
    """分析サマリーの取得（NEONデータベースから）"""
    try:
        service = DatabaseService(db)
        summary = service.get_keywords_summary()
        return summary
    
    except Exception as e:
        # Fallback to JSON file if database fails
        try:
            analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
            if analysis_file.exists():
                with open(analysis_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                return data.get('summary_stats', {})
        except:
            pass
        
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/analysis/performance")
async def get_performance_analysis():
    """パフォーマンス分析の取得"""
    try:
        analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
        
        if not analysis_file.exists():
            raise HTTPException(status_code=404, detail="分析データが見つかりません")
        
        with open(analysis_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('performance_analysis', {})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/analysis/content-gaps")
async def get_content_gaps():
    """コンテンツギャップ分析の取得"""
    try:
        analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
        
        if not analysis_file.exists():
            raise HTTPException(status_code=404, detail="分析データが見つかりません")
        
        with open(analysis_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('content_gaps', {})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/analysis/serp-features")
async def get_serp_analysis():
    """SERP機能分析の取得"""
    try:
        analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
        
        if not analysis_file.exists():
            raise HTTPException(status_code=404, detail="分析データが見つかりません")
        
        with open(analysis_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('serp_analysis', {})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/keywords")
async def get_keywords(
    limit: int = 100,
    offset: int = 0,
    min_volume: Optional[int] = None,
    max_position: Optional[int] = None,
    intent: Optional[str] = None
):
    """キーワードデータの取得（フィルタリング対応）"""
    try:
        csv_file = RAW_DATA_PATH / "www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-05-37.csv"
        
        if not csv_file.exists():
            raise HTTPException(status_code=404, detail="キーワードデータが見つかりません")
        
        df = pd.read_csv(csv_file)
        
        # フィルタリング
        if min_volume is not None:
            df = df[df['Volume'] >= min_volume]
        
        if max_position is not None:
            df = df[df['Current position'] <= max_position]
        
        if intent is not None:
            if intent in df.columns:
                df = df[df[intent] == True]
        
        # ページネーション
        total = len(df)
        df = df.iloc[offset:offset + limit]
        
        return {
            "keywords": df.to_dict('records'),
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/keywords/top-performing")
async def get_top_performing_keywords(limit: int = 20, db: Session = Depends(get_db)):
    """高パフォーマンスキーワードの取得（NEONデータベースから）"""
    try:
        service = DatabaseService(db)
        keywords = service.get_high_performance_keywords(limit)
        return keywords
    
    except Exception as e:
        # Fallback to JSON file if database fails
        try:
            analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
            if analysis_file.exists():
                with open(analysis_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                high_performance = data.get('performance_analysis', {}).get('high_performance_keywords', [])
                return high_performance[:limit]
        except:
            pass
        
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.get("/api/keywords/improvement-opportunities")
async def get_improvement_opportunities(limit: int = 20, db: Session = Depends(get_db)):
    """改善機会キーワードの取得（NEONデータベースから）"""
    try:
        service = DatabaseService(db)
        keywords = service.get_improvement_opportunities(limit)
        return keywords
    
    except Exception as e:
        # Fallback to JSON file if database fails
        try:
            analysis_file = DATA_PATH / "tokyo_weekender_analysis.json"
            if analysis_file.exists():
                with open(analysis_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                opportunities = data.get('performance_analysis', {}).get('improvement_opportunities', [])
                return opportunities[:limit]
        except:
            pass
        
        raise HTTPException(status_code=500, detail=f"データ取得エラー: {str(e)}")

@app.post("/api/analysis/refresh")
async def refresh_analysis():
    """分析データの再計算"""
    try:
        # データ処理スクリプトの実行
        import subprocess
        import sys
        
        script_path = Path("analysis/scripts/data_processor.py")
        result = subprocess.run([sys.executable, str(script_path)], 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"分析実行エラー: {result.stderr}")
        
        return {"message": "分析データが更新されました", "output": result.stdout}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分析更新エラー: {str(e)}")

@app.post("/api/database/migrate")
async def migrate_csv_to_database(db: Session = Depends(get_db)):
    """CSVデータをNEONデータベースに移行"""
    try:
        import subprocess
        import sys
        
        script_path = Path("analysis/scripts/migrate_to_neon.py")
        result = subprocess.run([sys.executable, str(script_path)], 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"移行エラー: {result.stderr}")
        
        return {"message": "データベースへの移行が完了しました", "output": result.stdout}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"移行エラー: {str(e)}")

@app.get("/api/database/status")
async def database_status(db: Session = Depends(get_db)):
    """データベース接続状態の確認"""
    try:
        service = DatabaseService(db)
        summary = service.get_keywords_summary()
        return {
            "status": "connected",
            "message": "NEONデータベースに正常に接続されています",
            "data_summary": summary
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"データベース接続エラー: {str(e)}",
            "data_summary": None
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
