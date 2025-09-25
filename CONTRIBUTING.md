# Contributing to Tokyo Weekender SEO Dashboard

Tokyo Weekender SEO Dashboard への貢献をありがとうございます！このプロジェクトは Tokyo Weekender の Organic Growth を促進するための分析基盤です。

## 🚀 開発環境のセットアップ

### 前提条件

- Python 3.11+
- Node.js 18+
- PostgreSQL (NEON 推奨)
- Git

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/tokyo-weekender-seo-dashboard.git
cd tokyo-weekender-seo-dashboard
```

### 2. 環境設定

```bash
# 環境設定ファイルのコピー
cp env.example .env

# .env ファイルを編集してNEONの接続情報を設定
# DATABASE_URL=postgresql://username:password@your-neon-endpoint.neon.tech/database_name
```

### 3. 依存関係のインストール

```bash
# バックエンド依存関係
pip install -r requirements.txt

# フロントエンド依存関係
npm install
```

### 4. データベースの初期化

```bash
# データベースマイグレーション
alembic upgrade head

# サンプルデータの移行（オプション）
python analysis/scripts/migrate_to_neon.py
```

### 5. アプリケーションの起動

```bash
# バックエンド起動
cd backend && python main.py

# フロントエンド起動（別ターミナル）
npm run dev
```

## 📝 コントリビューションの流れ

### 1. イシューの作成

新しい機能やバグ修正の前に、まず Issue を作成してください。

### 2. ブランチの作成

```bash
git checkout -b feature/your-feature-name
# または
git checkout -b fix/your-bug-fix
```

### 3. 変更の実装

- コードを書く
- テストを書く
- ドキュメントを更新する

### 4. コミット

```bash
git add .
git commit -m "feat: add new feature description"
```

コミットメッセージの形式：
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル修正
- `refactor:` リファクタリング
- `test:` テスト追加・修正

### 5. プッシュとプルリクエスト

```bash
git push origin feature/your-feature-name
```

GitHub でプルリクエストを作成してください。

## 🧪 テスト

### バックエンドテスト

```bash
# テストの実行
pytest

# カバレッジ付きテスト
pytest --cov=backend
```

### フロントエンドテスト

```bash
# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage
```

## 📋 コーディング規約

### Python

- [PEP 8](https://www.python.org/dev/peps/pep-0008/) に従う
- [Black](https://black.readthedocs.io/) でコードフォーマット
- [flake8](https://flake8.pycqa.org/) でリンター

```bash
# フォーマット
black backend/

# リンター
flake8 backend/
```

### TypeScript/React

- [ESLint](https://eslint.org/) でリンター
- [Prettier](https://prettier.io/) でコードフォーマット

```bash
# フォーマット
npm run format

# リンター
npm run lint
```

## 🗂️ プロジェクト構造

```
tokyo-weekender-seo-dashboard/
├── backend/                 # FastAPI バックエンド
│   ├── api/                # API エンドポイント
│   ├── models/             # SQLAlchemy データベースモデル
│   ├── services/           # ビジネスロジック
│   └── utils/              # ユーティリティ関数
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/     # React コンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── utils/          # ユーティリティ関数
│   │   └── types/          # TypeScript 型定義
│   └── public/             # 静的ファイル
├── analysis/               # データ分析スクリプト
├── migrations/             # Alembic マイグレーション
├── data/                   # データファイル
│   ├── raw/               # 生データ
│   └── processed/         # 処理済みデータ
└── docs/                  # ドキュメント
```

## 🐛 バグレポート

バグを発見した場合は、以下の情報を含めて Issue を作成してください：

- バグの説明
- 再現手順
- 期待される動作
- 実際の動作
- 環境情報（OS、Python バージョン、Node.js バージョンなど）
- エラーメッセージやスクリーンショット

## 💡 機能リクエスト

新しい機能を提案する場合は、以下の情報を含めて Issue を作成してください：

- 機能の説明
- なぜその機能が必要か
- 期待される動作
- 代替案の検討

## 📚 ドキュメント

- [README.md](README.md) - プロジェクト概要とセットアップ
- [NEON_SETUP.md](docs/NEON_SETUP.md) - NEON データベース設定
- [API ドキュメント](http://localhost:8000/docs) - FastAPI 自動生成ドキュメント

## 🤝 コミュニティ

- [Issues](https://github.com/your-username/tokyo-weekender-seo-dashboard/issues) - バグレポートや機能リクエスト
- [Discussions](https://github.com/your-username/tokyo-weekender-seo-dashboard/discussions) - 質問や議論

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

ご質問やご不明な点がございましたら、お気軽に Issue を作成してください！
