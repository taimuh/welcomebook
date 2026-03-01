# WelcomeBook

民泊ゲストマニュアルシステム — 物件ごとのチェックイン案内・設備説明・周辺情報をゲストに提供する Web アプリケーション。

## 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フロントエンド | Next.js (App Router) | 14+ |
| 言語 | TypeScript | 5+ |
| スタイリング | Tailwind CSS | 3.4+ |
| CMS | Strapi | 5.x |
| DB | PostgreSQL（本番） / SQLite（開発） | 14+ |
| ランタイム | Node.js | 20+ |
| テスト（ユニット） | Jest + React Testing Library | - |
| テスト（E2E） | Playwright | - |
| CI | GitHub Actions | - |
| ホスティング（FE） | Vercel | 無料枠 |
| ホスティング（BE） | Railway | 無料枠 |

## ディレクトリ構成

```text
welcomebook/
├── backend/                 # Strapi CMS
│   ├── config/              # Strapi 設定
│   ├── src/api/             # コンテンツタイプ (listing, category, content)
│   └── tests/unit/          # バックエンドユニットテスト
├── frontend/                # Next.js アプリ
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   ├── components/      # UI コンポーネント
│   │   ├── lib/             # ユーティリティ・API クライアント
│   │   └── styles/          # グローバルスタイル
│   └── tests/
│       ├── unit/            # フロントエンドユニットテスト
│       └── e2e/             # Playwright E2E テスト
├── specs/                   # 機能仕様書
│   └── 001-guest-manual/    # ゲストマニュアル機能仕様
└── .github/workflows/       # CI ワークフロー
```

## 環境構築

### 前提条件

- Node.js 20+
- PostgreSQL 14+（本番環境。開発では SQLite を使用）

### バックエンド（Strapi）

```bash
cd backend
npm ci
```

`.env` を作成（開発用）:

```env
HOST=0.0.0.0
PORT=1337

# 以下はランダムな値を設定
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=random-secret
TRANSFER_TOKEN_SALT=random-salt
JWT_SECRET=random-secret
ENCRYPTION_KEY=random-key

# 開発では SQLite を使用
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

本番環境で PostgreSQL を使用する場合は `.env` に以下を設定:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=welcomebook
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_SSL=false
```

Strapi を起動:

```bash
npm run develop
```

管理画面 http://localhost:1337/admin で初回管理者アカウントを作成し、API トークンを発行する。

### フロントエンド（Next.js）

```bash
cd frontend
npm ci
```

`.env.local` を作成:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

開発サーバーを起動:

```bash
npm run dev
```

http://localhost:3000 でアクセス。

## 開発コマンド

### バックエンド

| コマンド | 説明 |
|---------|------|
| `npm run develop` | 開発モード（ホットリロード） |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクション起動 |
| `npm run test` | ユニットテスト実行 |

### フロントエンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint 実行 |
| `npm run test` | ユニットテスト実行 |
| `npm run test:watch` | ユニットテスト（ウォッチモード） |
| `npm run test:coverage` | カバレッジ付きテスト |
| `npm run test:e2e` | Playwright E2E テスト |
| `npm run test:e2e:ui` | Playwright UI モード |

## テスト

### ユニットテスト（Jest）

```bash
# バックエンド
cd backend && npm test

# フロントエンド
cd frontend && npm test
```

- バックエンド: 6 テストスイート / 59 テスト
- フロントエンド: 13 テストスイート / 66 テスト

### E2E テスト（Playwright）

```bash
cd frontend
npx playwright install chromium    # 初回のみ
npm run test:e2e
```

- デスクトップ Chrome・モバイル Chrome (Pixel 5) の 2 プロジェクトで実行
- E2E テストは Mock Strapi サーバーを使用（実際の Strapi 起動不要）

## CI/CD

### GitHub Actions

`.github/workflows/test.yml` — `main` ブランチへの push / PR で自動実行:

- **backend-test**: バックエンドユニットテスト
- **frontend-test**: Lint → ユニットテスト（カバレッジ付き）→ E2E テスト

`.github/workflows/lighthouse.yml` — Lighthouse パフォーマンステスト

## データモデル

```text
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Listing   │       │  Category   │       │   Content   │
│  (物件)     │       │ (カテゴリ)   │       │ (コンテンツ) │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ name        │1    * │ name        │1    * │ title       │
│ slug        │───────│ description │───────│ body        │
│ address     │       │ icon        │       │ images      │
│ description │       │ order       │       │ order       │
│ welcomeMsg  │       └─────────────┘       │ published   │
│ emergency   │                             └─────────────┘
│ owner       │
└─────────────┘
  Listing 1 ──* Category 1 ──* Content
```

- **Listing（物件）**: 民泊物件。オーナーに紐づく
- **Category（カテゴリ）**: 「Wi-Fi」「ゴミ出し」など物件内のカテゴリ
- **Content（コンテンツ）**: カテゴリ内の個別マニュアル記事

## フロントエンド画面構成

| パス | 画面 |
|------|------|
| `/` | ホーム（物件一覧） |
| `/[slug]` | 物件トップ（カテゴリ一覧・検索） |
| `/[slug]/[categoryId]` | カテゴリ詳細（コンテンツ一覧） |
| `/[slug]/content/[contentId]` | コンテンツ詳細 |

## 仕様書

`specs/` ディレクトリに機能仕様書を格納:

```text
specs/001-guest-manual/
├── spec.md              # 機能仕様書（要件・画面定義・API定義）
├── tasks.md             # タスク一覧（T001〜T101）
└── checklist.md         # 実装チェックリスト
```

新機能は `specs/NNN-feature-name/` ディレクトリに仕様書を作成してから実装する（仕様駆動開発）。

## デプロイ

| サービス | 用途 | プラン |
|---------|------|--------|
| Vercel | フロントエンド（Next.js） | 無料枠 |
| Railway | バックエンド（Strapi + PostgreSQL） | 無料枠 |

月額運用コスト **$0** を維持する方針。

## ライセンス

[MIT License](./LICENSE)
