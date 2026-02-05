# クイックスタート: 民泊ゲストマニュアルシステム

**日付**: 2026-02-05
**ブランチ**: `001-guest-manual`

## 前提条件

- Node.js 18+
- npm または yarn
- PostgreSQL 14+（ローカルまたはクラウド）
- Git

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/welcomebook.git
cd welcomebook
git checkout 001-guest-manual
```

### 2. バックエンド（Strapi）のセットアップ

```bash
cd backend

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .envを編集してデータベース接続情報を設定

# データベースマイグレーション & 起動
npm run develop
```

**環境変数（.env）**:
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=welcomebook
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
DATABASE_SSL=false
```

Strapi管理画面: http://localhost:1337/admin

### 3. フロントエンド（Next.js）のセットアップ

```bash
cd frontend

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localを編集

# 開発サーバー起動
npm run dev
```

**環境変数（.env.local）**:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
```

フロントエンド: http://localhost:3000

### 4. 初期データ作成

1. Strapi管理画面（http://localhost:1337/admin）にアクセス
2. 管理者アカウントを作成
3. Content-Type Builderでスキーマを確認
4. テスト物件を作成:
   - Property: `name: "テスト物件"`, `slug: "test-property"`
5. デフォルトカテゴリが自動作成されることを確認
6. テストコンテンツを作成して公開

### 5. 動作確認

```bash
# ゲスト向けページ
open http://localhost:3000/test-property

# API直接アクセス
curl http://localhost:1337/api/properties/test-property
curl http://localhost:1337/api/categories?filters[property][slug][$eq]=test-property
curl http://localhost:1337/api/contents?filters[property][slug][$eq]=test-property&filters[published][$eq]=true
```

## プロジェクト構造

```
welcomebook/
├── frontend/           # Next.js アプリケーション
│   ├── src/
│   │   ├── app/        # App Router ページ
│   │   ├── components/ # UIコンポーネント
│   │   └── lib/        # ユーティリティ
│   └── tests/
├── backend/            # Strapi CMS
│   ├── config/         # 設定ファイル
│   ├── src/
│   │   └── api/        # コンテンツタイプ定義
│   └── types/
└── specs/              # 仕様・計画ドキュメント
    └── 001-guest-manual/
```

## 開発コマンド

### バックエンド

```bash
cd backend
npm run develop    # 開発モード（ホットリロード）
npm run build      # プロダクションビルド
npm run start      # プロダクション起動
```

### フロントエンド

```bash
cd frontend
npm run dev        # 開発モード
npm run build      # プロダクションビルド
npm run start      # プロダクション起動
npm run lint       # ESLint実行
npm run test       # テスト実行
npm run test:e2e   # E2Eテスト実行
```

## デプロイ

### バックエンド → Railway

1. Railwayプロジェクト作成
2. PostgreSQLアドオン追加
3. 環境変数設定
4. GitHubリポジトリ連携（backend/ディレクトリ）

### フロントエンド → Vercel

1. Vercelプロジェクト作成
2. GitHubリポジトリ連携（frontend/ディレクトリ）
3. 環境変数設定（STRAPI_URL, API_TOKEN）
4. ビルドコマンド: `npm run build`
5. 出力ディレクトリ: `.next`

## トラブルシューティング

### よくある問題

**Q: Strapiが起動しない**
- PostgreSQLが起動しているか確認
- .envのデータベース接続情報を確認
- `npm run build` 後に `npm run develop` を再実行

**Q: フロントエンドでAPIエラー**
- NEXT_PUBLIC_STRAPI_URLが正しいか確認
- Strapi側のCORS設定を確認
- APIトークンのパーミッションを確認

**Q: 画像がアップロードできない**
- ファイルサイズが5MB以下か確認
- 対応形式（JPEG/PNG/GIF/WebP）か確認
- Strapiのメディアライブラリ設定を確認

## 次のステップ

1. `/speckit.tasks` でタスク一覧を生成
2. Phase 3: 実装開始
