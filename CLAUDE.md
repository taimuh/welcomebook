# WelcomeBook 開発ガイドライン

自動生成: 2026-02-05

## 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フロントエンド | Next.js (App Router) | 14+ |
| 言語 | TypeScript | - |
| スタイリング | Tailwind CSS | - |
| CMS | Strapi | 5.x |
| DB | PostgreSQL | 14+ |
| ランタイム | Node.js | 18+ |
| テスト | Jest, Playwright | - |
| ホスティング（FE） | Vercel | 無料枠 |
| ホスティング（BE） | Railway | 無料枠 |

## プロジェクト構造

```text
frontend/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # UIコンポーネント
│   ├── lib/           # ユーティリティ
│   └── styles/        # スタイル
└── tests/

backend/
├── config/            # Strapi設定
├── src/
│   └── api/           # コンテンツタイプ
└── types/

specs/
└── 001-guest-manual/  # 現在の機能仕様
```

## コマンド

### バックエンド（Strapi）
```bash
cd backend
npm run develop    # 開発モード
npm run build      # ビルド
npm run start      # 本番起動
```

### フロントエンド（Next.js）
```bash
cd frontend
npm run dev        # 開発モード
npm run build      # ビルド
npm run lint       # リント
npm run test       # テスト
npm run test:e2e   # E2Eテスト
```

## コードスタイル

- TypeScript strict mode使用
- ESLint + Prettier
- Tailwind CSSでスタイリング
- Server Components優先
- 日本語コメント可

## 憲法ルール（抜粋）

- 仕様書なしに実装してはならない
- 技術スタックから逸脱してはならない
- 月額運用コスト$0を維持
- OWASP Top 10脆弱性を導入してはならない
- 全ドキュメントは日本語

## 現在のタスク

- 機能: 民泊ゲストマニュアルシステム
- ブランチ: `001-guest-manual`
- 状態: Phase 1完了、Phase 2（タスク生成）待ち

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
