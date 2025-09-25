# NEON データベース設定ガイド

Tokyo Weekender SEO Dashboard を NEON PostgreSQL データベースと連携させるための設定ガイドです。

## 1. NEON アカウントの作成

1. [NEON](https://neon.tech/) にアクセス
2. GitHub アカウントでサインアップ
3. 新しいプロジェクトを作成

## 2. データベース接続情報の取得

NEON ダッシュボードから以下の情報を取得してください：

- **Connection String**: `postgresql://username:password@hostname/database`
- **Host**: エンドポイントホスト名
- **Database**: データベース名
- **Username**: ユーザー名
- **Password**: パスワード
- **Port**: 通常は 5432

## 3. 環境変数の設定

### 方法1: .env ファイルを作成

```bash
# プロジェクトルートに .env ファイルを作成
cp env.example .env
```

`.env` ファイルを編集して、NEON の接続情報を設定：

```env
# NEON Database Configuration
DATABASE_URL=postgresql://username:password@your-neon-endpoint.neon.tech/database_name

# Alternative: Use individual components
DB_HOST=your-neon-endpoint.neon.tech
DB_PORT=5432
DB_NAME=database_name
DB_USER=username
DB_PASSWORD=password

# Application Settings
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
DEBUG=true
```

### 方法2: システム環境変数

```bash
export DATABASE_URL="postgresql://username:password@your-neon-endpoint.neon.tech/database_name"
```

## 4. 依存関係のインストール

```bash
pip install -r requirements.txt
```

## 5. データベースマイグレーション

### 初回セットアップ

```bash
# Alembic の初期化
alembic init migrations

# マイグレーションファイルの生成
alembic revision --autogenerate -m "Initial migration"

# マイグレーションの実行
alembic upgrade head
```

### データの移行

```bash
# CSV データを NEON データベースに移行
python analysis/scripts/migrate_to_neon.py
```

## 6. アプリケーションの起動

```bash
# バックエンド起動
cd backend && python main.py

# フロントエンド起動（別ターミナル）
npm run dev
```

## 7. 接続確認

ブラウザで以下のエンドポイントにアクセスして接続を確認：

- **API ヘルスチェック**: http://localhost:8000/api/health
- **データベース状態**: http://localhost:8000/api/database/status
- **ダッシュボード**: http://localhost:3000

## 8. トラブルシューティング

### 接続エラーの場合

1. **SSL エラー**: NEON は SSL 接続が必須です
   ```python
   connect_args={"sslmode": "require"}
   ```

2. **認証エラー**: ユーザー名とパスワードを確認

3. **ホストエラー**: エンドポイント URL を確認

### よくある問題

- **Connection String の形式**: `postgresql://` で始まる必要があります
- **ポート番号**: 通常は 5432 を使用
- **データベース名**: プロジェクト作成時に指定した名前を使用

## 9. 本番環境での設定

本番環境では以下の設定を推奨：

```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-very-secure-secret-key
```

## 10. バックアップとメンテナンス

NEON では自動バックアップが提供されていますが、重要なデータは定期的にエクスポートすることを推奨します。

```bash
# データベースのダンプ
pg_dump $DATABASE_URL > backup.sql

# データベースの復元
psql $DATABASE_URL < backup.sql
```

## サポート

問題が発生した場合は：

1. NEON ドキュメント: https://neon.tech/docs
2. PostgreSQL ドキュメント: https://www.postgresql.org/docs/
3. プロジェクトの Issues ページで質問
