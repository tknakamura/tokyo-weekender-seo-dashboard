#!/bin/bash

echo "Tokyo Weekender SEO Dashboard を起動しています..."

# バックエンドの依存関係をインストール
echo "バックエンドの依存関係をインストール中..."
pip install -r requirements.txt

# フロントエンドの依存関係をインストール
echo "フロントエンドの依存関係をインストール中..."
npm install

# データ分析の実行
echo "データ分析を実行中..."
python analysis/scripts/data_processor.py

echo "起動準備完了！"
echo ""
echo "以下のコマンドでアプリケーションを起動できます："
echo ""
echo "1. バックエンド起動:"
echo "   cd backend && python main.py"
echo ""
echo "2. フロントエンド起動（別ターミナルで）:"
echo "   npm run dev"
echo ""
echo "アクセスURL:"
echo "  フロントエンド: http://localhost:3000"
echo "  バックエンドAPI: http://localhost:8000"
