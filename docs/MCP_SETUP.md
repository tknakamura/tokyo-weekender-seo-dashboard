# MCP Server Setup Guide

このドキュメントでは、Tokyo WeekenderプロジェクトでRender MCPサーバーを設定する方法を説明します。

## 概要

MCP (Model Context Protocol) サーバーを使用することで、以下の機能が利用できるようになります：

- アプリケーションの自動デプロイ
- 環境変数の管理
- ログの監視
- パフォーマンスの追跡
- データベースの管理

## 設定手順

### 1. 環境変数の設定

`.env` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Render MCP Configuration
RENDER_API_TOKEN=your-render-api-token-here
```

### 2. MCP設定ファイル

プロジェクトルートに `.mcp-config.json` ファイルが作成されています：

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer ${RENDER_API_TOKEN}"
      }
    }
  }
}
```

### 3. セットアップスクリプトの実行

以下のコマンドでMCP設定をテストできます：

```bash
npm run mcp:setup
```

## 使用方法

### 開発環境での使用

1. 環境変数を設定
2. MCPクライアントをインストール
3. 設定をテスト

### 本番環境での使用

Renderダッシュボードで以下の環境変数を設定してください：

- `RENDER_API_TOKEN`: あなたのRender APIトークン

## セキュリティ

- APIトークンは絶対に公開しないでください
- `.env` ファイルは `.gitignore` に含まれています
- 本番環境では強力なAPIトークンを使用してください

## トラブルシューティング

### よくある問題

1. **APIトークンが無効**
   - Renderダッシュボードで新しいトークンを生成してください

2. **接続エラー**
   - ネットワーク接続を確認してください
   - ファイアウォール設定を確認してください

3. **権限エラー**
   - APIトークンに適切な権限があることを確認してください

### ログの確認

```bash
npm run mcp:test
```

## 参考資料

- [Render MCP Documentation](https://render.com/docs/mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Tokyo Weekender Project](https://github.com/your-username/tokyo-weekender)
