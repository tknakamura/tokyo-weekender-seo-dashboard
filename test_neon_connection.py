#!/usr/bin/env python3
"""
NEON データベース接続テストスクリプト
"""
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).parent / "backend"))

from backend.models.database import engine, Base
from backend.services.database_service import DatabaseService
from backend.models.database import SessionLocal

def test_neon_connection():
    """NEONデータベース接続をテスト"""
    print("🔍 NEON データベース接続テスト開始...")
    
    try:
        # 接続テスト
        with engine.connect() as connection:
            from sqlalchemy import text
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ PostgreSQL接続成功!")
            print(f"   バージョン: {version}")
        
        # テーブル作成テスト
        print("\n📋 データベーステーブルを作成中...")
        Base.metadata.create_all(bind=engine)
        print("✅ テーブル作成完了!")
        
        # サービス接続テスト
        print("\n🔧 データベースサービスをテスト中...")
        db = SessionLocal()
        try:
            service = DatabaseService(db)
            summary = service.get_keywords_summary()
            print(f"✅ データベースサービス接続成功!")
            print(f"   キーワード数: {summary.get('total_keywords', 0)}")
        finally:
            db.close()
        
        print("\n🎉 NEON データベース接続テスト完了!")
        print("   すべてのテストが成功しました。")
        
    except Exception as e:
        print(f"\n❌ 接続エラー: {e}")
        print("\n🔧 トラブルシューティング:")
        print("   1. .env ファイルにDATABASE_URLが正しく設定されているか確認")
        print("   2. NEONプロジェクトが作成されているか確認")
        print("   3. 接続文字列の形式: postgresql://username:password@hostname/database")
        return False
    
    return True

if __name__ == "__main__":
    success = test_neon_connection()
    sys.exit(0 if success else 1)
