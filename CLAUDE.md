# WelcomeBook 開発ガイドライン

更新: 2026-03-05

## 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フロントエンド | Next.js (App Router) | 14+ |
| 言語 | TypeScript | 5+ |
| スタイリング | カスタム CSS（Tailwind CSS 経由） | 3.4+ |
| CMS | Strapi | 5.x |
| DB | PostgreSQL（本番） / SQLite（開発） | 14+ |
| ランタイム | Node.js | 20+ |
| テスト（ユニット） | Jest + React Testing Library | - |
| テスト（E2E） | Playwright | - |
| CI | GitHub Actions | - |
| ホスティング（FE） | Vercel | - |
| ホスティング（BE） | Railway | - |

## プロジェクト構造

```text
welcomebook/
├── assets/            # 画像・静的リソース
├── backend/
│   ├── config/        # Strapi設定
│   ├── src/api/       # コンテンツタイプ (listing, category, content)
│   └── tests/unit/    # バックエンドユニットテスト
├── frontend/
│   ├── src/
│   │   ├── app/       # Next.js App Router
│   │   ├── components/ # UIコンポーネント
│   │   └── lib/       # ユーティリティ・APIクライアント
│   └── tests/
│       ├── unit/      # フロントエンドユニットテスト
│       └── e2e/       # Playwright E2Eテスト
├── specs/             # 機能仕様書（仕様駆動開発）
└── .github/workflows/ # CIワークフロー
```

## コマンド

### バックエンド（Strapi）
```bash
cd backend
npm run develop    # 開発モード
npm run build      # ビルド
npm run start      # 本番起動
npm run test       # ユニットテスト
```

### フロントエンド（Next.js）
```bash
cd frontend
npm run dev        # 開発モード
npm run build      # ビルド
npm run lint       # リント
npm run test       # ユニットテスト
npm run test:e2e   # E2Eテスト
```

## コードスタイル

- TypeScript strict mode使用
- ESLint + Prettier
- カスタム CSS クラス + CSS 変数でスタイリング（Tailwind はベースリセットのみ）
- Server Components優先
- 日本語コメント可

## 憲法ルール（抜粋）

- 仕様書なしに実装してはならない
- 技術スタックから逸脱してはならない
- 月額運用コスト$0を維持
- OWASP Top 10脆弱性を導入してはならない
- 全ドキュメントは日本語

## 現在の状態

- 機能: 民泊ゲストマニュアルシステム（001-guest-manual）実装完了
- バックエンド: 6テストスイート / 59テスト
- フロントエンド: 13テストスイート / 66テスト
- 新機能は `specs/NNN-feature-name/` に仕様書を作成してから実装すること

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
