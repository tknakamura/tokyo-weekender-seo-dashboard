# Tokyo Weekender Organic Growth Analysis Dashboard

Tokyo WeekenderのOrganic Growthを促進するための包括的な分析基盤とコンテンツ戦略提案ダッシュボードです。

## 機能

### 1. Tokyo Weekender 現状分析
- キーワードパフォーマンス分析
- トラフィックトレンド分析
- SERP機能の取得状況
- コンテンツ意図別分析

### 2. 競合サイト分析
- 競合とのキーワード比較
- 機会分析（競合が上位だがTokyo Weekenderが未取得のキーワード）
- 競合の強み・弱み分析

### 3. 新規コンテンツ制作提案
- 高ボリューム・低競合キーワードの発見
- コンテンツギャップ分析
- トピッククラスター提案

### 4. 既存コンテンツ改善提案
- 順位改善の可能性が高いキーワード
- コンテンツ最適化提案
- 内部リンク戦略

## データソース

- Tokyo Weekender キーワードリスト（Ahrefs）
- Google Search Console データ
- 競合サイトキーワードリスト（Ahrefs）

## 技術スタック

### バックエンド
- Python 3.11+
- FastAPI
- **NEON PostgreSQL** (Serverless PostgreSQL)
- SQLAlchemy with Alembic
- Pandas, NumPy
- scikit-learn

### フロントエンド
- React 18
- TypeScript
- Tailwind CSS
- Chart.js
- D3.js

## セットアップ

### 1. NEON データベースの設定

詳細な設定手順は [NEON_SETUP.md](docs/NEON_SETUP.md) を参照してください。

1. [NEON](https://neon.tech/) でアカウント作成
2. プロジェクト作成とデータベース接続情報の取得
3. `.env` ファイルの設定

```bash
# 環境設定ファイルのコピー
cp env.example .env
# .env ファイルを編集してNEONの接続情報を設定
```

### 2. 依存関係のインストール

```bash
# バックエンド依存関係
pip install -r requirements.txt

# フロントエンド依存関係
npm install
```

### 3. データベースの初期化

```bash
# データベースマイグレーション
alembic upgrade head

# CSVデータをNEONデータベースに移行
python analysis/scripts/migrate_to_neon.py
```

### 4. アプリケーションの起動

```bash
# バックエンド起動
cd backend && python main.py

# フロントエンド起動（別ターミナル）
npm run dev
```

## データ構造

### キーワードデータ
- Keyword: キーワード
- Volume: 月間検索ボリューム
- KD: キーワード難易度
- CPC: クリック単価
- Organic traffic: オーガニックトラフィック
- Current position: 現在の順位
- Current URL: 対象URL
- SERP features: SERP機能
- 意図分類: Navigational, Informational, Commercial, Transactional, Branded, Local

## プロジェクト構造

```
tokyo-weekender/
├── backend/           # FastAPI バックエンド
│   ├── models/       # SQLAlchemy データベースモデル
│   └── services/     # データベースサービス
├── frontend/          # React フロントエンド
├── data/             # データファイル
├── analysis/         # 分析スクリプト
├── migrations/       # Alembic マイグレーション
└── docs/            # ドキュメント
```

## NEON データベース統合の利点

### 🚀 パフォーマンス向上
- **Serverless PostgreSQL**: 自動スケーリングとコールドスタート最適化
- **高速クエリ**: インデックス最適化による高速データアクセス
- **接続プーリング**: 効率的なデータベース接続管理

### 📊 データ管理の改善
- **構造化データ**: SQLAlchemyモデルによる型安全なデータ操作
- **マイグレーション**: Alembicによるスキーマ変更管理
- **バックアップ**: 自動バックアップとポイントインタイム復旧

### 🔄 リアルタイム分析
- **即座のクエリ**: データベースからの直接分析結果取得
- **フィルタリング**: 高度な検索とフィルタリング機能
- **集計処理**: SQL による効率的なデータ集計

## 今後の拡張予定

1. **Google Search Console連携**: リアルタイムデータ取得とNEON同期
2. **競合分析の自動化**: 複数競合サイトの比較分析
3. **AI駆動コンテンツ提案**: 機械学習によるコンテンツ戦略提案
4. **レポート自動生成**: 定期的な分析レポートの自動生成
5. **リアルタイムダッシュボード**: WebSocketによるリアルタイム更新
