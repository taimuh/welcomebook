# 実装計画: 民泊ゲストマニュアルシステム (WelcomeBook)

**ブランチ**: `001-guest-manual` | **日付**: 2026-02-05 | **仕様書**: [spec.md](./spec.md)
**入力**: 機能仕様書 `/specs/001-guest-manual/spec.md`

## 概要

民泊オーナーがゲスト向けマニュアルを管理・公開するシステム。フロントエンドはNext.js (App Router)で構築し、バックエンドはStrapi CMSを使用。ゲストは物件固有のURLからマニュアルを閲覧・検索でき、オーナーはStrapi管理画面からコンテンツを管理する。

## 技術コンテキスト

**言語/バージョン**: TypeScript / Node.js 18+
**主要依存関係**: Next.js 14+ (App Router), Strapi 4.x, Tailwind CSS
**ストレージ**: PostgreSQL 14+（Strapi経由）
**テスト**: Jest, React Testing Library, Playwright (E2E)
**ターゲットプラットフォーム**: Webアプリケーション（モバイルファースト）
**プロジェクトタイプ**: Web（フロントエンド + バックエンド）
**パフォーマンス目標**: 初期表示3秒以内、検索結果2秒以内、100同時接続
**制約**: Vercel/Railway無料枠内、月額$0運用
**スケール/スコープ**: 小〜中規模（物件数100件、コンテンツ数1000件想定）

## 憲法チェック

*ゲート: Phase 0開始前に合格必須。Phase 1設計後に再チェック。*

| 原則 | 状態 | 根拠 |
|------|------|------|
| I. 仕様駆動開発 | ✅ 合格 | spec.mdが完成済み、USは独立テスト可能、受け入れ条件は前提/操作/結果形式 |
| II. 段階的計画 | ✅ 合格 | Phase 0→1→2の順序で進行中 |
| III. 独立テスト可能性 | ✅ 合格 | 各USは独立してMVPとして価値提供可能 |
| IV. シンプルさ | ✅ 合格 | 追加機能なし、憲法指定スタックのみ使用 |
| V. 一貫性と追跡可能性 | ✅ 合格 | タスクはUSに紐付け予定 |
| 技術スタック準拠 | ✅ 合格 | Next.js, TypeScript, Tailwind, Strapi, PostgreSQL使用 |
| コスト制約 | ✅ 合格 | Vercel/Railway無料枠内で運用 |
| 日本語ドキュメント | ✅ 合格 | 全ドキュメントは日本語 |

## プロジェクト構造

### ドキュメント（本機能）

```text
specs/001-guest-manual/
├── spec.md              # 機能仕様書（完成済み）
├── plan.md              # 本ファイル
├── research.md          # Phase 0成果物
├── data-model.md        # Phase 1成果物
├── quickstart.md        # Phase 1成果物
├── contracts/           # Phase 1成果物（API契約）
└── tasks.md             # Phase 2成果物（/speckit.tasksで生成）
```

### ソースコード（リポジトリルート）

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [slug]/             # 物件ページ（動的ルート）
│   │   │   ├── page.tsx        # 物件トップ（カテゴリ一覧）
│   │   │   ├── [categoryId]/
│   │   │   │   └── page.tsx    # カテゴリ詳細（コンテンツ一覧）
│   │   │   └── content/
│   │   │       └── [contentId]/
│   │   │           └── page.tsx # コンテンツ詳細
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── not-found.tsx       # 404ページ
│   ├── components/
│   │   ├── CategoryList.tsx    # カテゴリ一覧
│   │   ├── ContentList.tsx     # コンテンツ一覧
│   │   ├── ContentDetail.tsx   # コンテンツ詳細
│   │   ├── SearchBar.tsx       # 検索バー
│   │   ├── SearchResults.tsx   # 検索結果
│   │   └── PropertyHeader.tsx  # 物件ヘッダー
│   ├── lib/
│   │   ├── strapi.ts           # Strapi APIクライアント
│   │   └── types.ts            # 型定義
│   └── styles/
│       └── globals.css         # Tailwind + グローバルスタイル
├── public/
└── tests/
    ├── e2e/                    # Playwright E2Eテスト
    └── unit/                   # Jestユニットテスト

backend/
├── config/
│   ├── database.ts             # PostgreSQL設定
│   └── plugins.ts              # プラグイン設定
├── src/
│   ├── api/
│   │   ├── property/           # 物件API
│   │   ├── category/           # カテゴリAPI
│   │   └── content/            # コンテンツAPI
│   └── extensions/             # Strapiカスタマイズ
└── types/
    └── generated/              # 型自動生成
```

**構造決定**: Webアプリケーション構造を採用。フロントエンド（Next.js）とバックエンド（Strapi）を分離し、それぞれVercelとRailwayにデプロイ。

## テスト戦略

### テストフレームワーク構成

```text
frontend/
├── jest.config.js           # Jest設定
├── playwright.config.ts     # Playwright設定
├── tests/
│   ├── unit/                # ユニットテスト
│   │   ├── lib/            # APIクライアント、ユーティリティ
│   │   └── components/     # コンポーネントテスト
│   ├── integration/         # 統合テスト（MSW使用）
│   │   └── api/            # API統合テスト
│   └── e2e/                 # E2Eテスト
│       ├── guest/          # ゲスト向け機能テスト
│       └── owner/          # オーナー向け機能テスト
└── __mocks__/               # モックファイル
    └── strapi.ts           # Strapi APIモック

backend/
└── tests/
    ├── unit/                # コントローラー、サービステスト
    └── integration/         # APIエンドポイントテスト
```

### テスト依存パッケージ

**フロントエンド**
- jest: ^29.x
- @testing-library/react: ^14.x
- @testing-library/jest-dom: ^6.x
- msw: ^2.x（APIモック）
- @playwright/test: ^1.40.x

**バックエンド**
- jest: ^29.x（Strapi標準）

### テスト実行コマンド

```bash
# フロントエンド
npm run test              # ユニット + 統合テスト
npm run test:watch        # ウォッチモード
npm run test:coverage     # カバレッジレポート
npm run test:e2e          # E2Eテスト
npm run test:e2e:ui       # E2E UIモード

# バックエンド
npm run test              # ユニット + 統合テスト
```

### CI/CDパイプライン

```yaml
# .github/workflows/test.yml
- ユニットテスト実行
- 統合テスト実行
- E2Eテスト実行（Playwrightコンテナ）
- カバレッジレポート生成
- Lighthouse CI（パフォーマンス検証）
```

## 複雑さトラッキング

> 憲法違反の正当化が必要な場合のみ記入

該当なし - 全ての設計は憲法に準拠

