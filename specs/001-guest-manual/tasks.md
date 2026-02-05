# タスク一覧: 民泊ゲストマニュアルシステム (WelcomeBook)

**入力**: `/specs/001-guest-manual/` の設計ドキュメント
**前提**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md

**テスト**: 各機能の実装完了時に対応するテストを作成・実行する。ユニットテスト、統合テスト、E2Eテストを段階的に追加。

**構成**: タスクはユーザーストーリーごとにグループ化し、独立した実装・テストを可能にする。

## フォーマット: `[ID] [P?] [Story?] 説明`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: 所属するユーザーストーリー（例: US1, US2）
- 説明には正確なファイルパスを含める

## パス規約

本プロジェクトはWebアプリ構成:
- バックエンド: `backend/`（Strapi）
- フロントエンド: `frontend/`（Next.js）

---

## Phase 1: セットアップ（共有インフラ）

**目的**: プロジェクト初期化と基本構造の作成

- [ ] T001 Strapiプロジェクトを `backend/` に作成（TypeScript、PostgreSQL設定）
- [ ] T002 Next.jsプロジェクトを `frontend/` に作成（App Router、TypeScript、Tailwind CSS）
- [ ] T003 [P] バックエンド用 `.env.example` を `backend/.env.example` に作成
- [ ] T004 [P] フロントエンド用 `.env.example` を `frontend/.env.example` に作成
- [ ] T005 [P] ESLint/Prettier設定を `frontend/.eslintrc.json` と `frontend/.prettierrc` に作成
- [ ] T006 [P] Gitignore設定を `.gitignore` に追加（node_modules、.env、.next、build）
- [ ] T007 [P] Jestテスト環境を `frontend/` にセットアップ（jest.config.js、@testing-library/react、@testing-library/jest-dom）
- [ ] T008 [P] MSWをテストモック用に `frontend/` にセットアップ（msw、handlers定義）
- [ ] T009 [P] Playwrightを `frontend/` にセットアップ（playwright.config.ts、E2Eディレクトリ構造）

---

## Phase 2: 基盤（ブロッキング前提条件）

**目的**: 全ユーザーストーリーの実装前に完了必須のコアインフラ

**⚠️ 重要**: このフェーズ完了まで、ユーザーストーリーの作業は開始不可

### Strapiコンテンツタイプ定義

- [ ] T010 Propertyコンテンツタイプを `backend/src/api/property/` に作成（name, slug, address, description, welcomeMessage, emergencyContact）
- [ ] T011 Categoryコンテンツタイプを `backend/src/api/category/` に作成（name, description, icon, order, property関連）
- [ ] T012 Contentコンテンツタイプを `backend/src/api/content/` に作成（title, body, images, order, published, property関連, category関連）
- [ ] T013 Propertyライフサイクルフックを `backend/src/api/property/content-types/property/lifecycles.ts` に実装（デフォルトカテゴリ自動作成）

### Strapiパーミッション設定

- [ ] T014 Public APIパーミッションを設定（Property, Category, Content の find/findOne を公開）
- [ ] T015 認証済みユーザーのCRUDパーミッションを設定

### フロントエンド基盤

- [ ] T016 型定義を `frontend/src/lib/types.ts` に作成（Property, Category, Content, Image）
- [ ] T017 Strapi APIクライアントを `frontend/src/lib/strapi.ts` に実装（fetch wrapper、エラーハンドリング）
- [ ] T018 グローバルスタイルを `frontend/src/styles/globals.css` に設定（Tailwind base、日本語フォント）
- [ ] T019 ルートレイアウトを `frontend/src/app/layout.tsx` に作成（メタデータ、フォント設定）
- [ ] T020 404ページを `frontend/src/app/not-found.tsx` に作成

### 基盤テスト

- [ ] T021 [TEST] APIクライアントのユニットテストを `frontend/tests/unit/lib/strapi.test.ts` に作成（fetch wrapper、エラーハンドリング）
- [ ] T022 [TEST] MSWハンドラーを `frontend/__mocks__/handlers.ts` に作成（Strapi APIモック定義）
- [ ] T023 [TEST] 404ページのコンポーネントテストを `frontend/tests/unit/components/not-found.test.tsx` に作成

**チェックポイント**: 基盤完了 - ユーザーストーリー実装を並列開始可能

---

## Phase 3: ユーザーストーリー 1 - ゲストがマニュアルを閲覧する (優先度: P1) 🎯 MVP

**目標**: ゲストが物件URLにアクセスし、カテゴリ→コンテンツ→詳細の流れでマニュアルを閲覧できる

**独立テスト**: `/[slug]` にアクセスしてカテゴリ一覧が表示され、コンテンツ詳細まで遷移できれば成功

### APIクライアント拡張

- [ ] T024 [US1] 物件取得関数 `getPropertyBySlug` を `frontend/src/lib/strapi.ts` に追加
- [ ] T025 [US1] カテゴリ一覧取得関数 `getCategoriesByProperty` を `frontend/src/lib/strapi.ts` に追加
- [ ] T026 [US1] コンテンツ一覧取得関数 `getContentsByCategory` を `frontend/src/lib/strapi.ts` に追加
- [ ] T027 [US1] コンテンツ詳細取得関数 `getContentById` を `frontend/src/lib/strapi.ts` に追加

### UIコンポーネント

- [ ] T028 [P] [US1] PropertyHeaderコンポーネントを `frontend/src/components/PropertyHeader.tsx` に作成（物件名、ウェルカムメッセージ、緊急連絡先）
- [ ] T029 [P] [US1] CategoryListコンポーネントを `frontend/src/components/CategoryList.tsx` に作成（アイコン、名前、コンテンツ数）
- [ ] T030 [P] [US1] ContentListコンポーネントを `frontend/src/components/ContentList.tsx` に作成（タイトル、サマリー100文字）
- [ ] T031 [P] [US1] ContentDetailコンポーネントを `frontend/src/components/ContentDetail.tsx` に作成（タイトル、本文、画像ギャラリー）

### ページ実装

- [ ] T032 [US1] 物件トップページを `frontend/src/app/[slug]/page.tsx` に作成（PropertyHeader + CategoryList）
- [ ] T033 [US1] カテゴリページを `frontend/src/app/[slug]/[categoryId]/page.tsx` に作成（ContentList）
- [ ] T034 [US1] コンテンツ詳細ページを `frontend/src/app/[slug]/content/[contentId]/page.tsx` に作成（ContentDetail）
- [ ] T035 [US1] 物件が見つからない場合のエラーハンドリングを各ページに追加（notFound() 呼び出し）
- [ ] T036 [US1] ISR設定を各ページに追加（revalidate: 30）

### US1テスト

- [ ] T037 [TEST] [US1] API関数のユニットテストを `frontend/tests/unit/lib/strapi-us1.test.ts` に作成（getPropertyBySlug、getCategoriesByProperty、getContentsByCategory、getContentById）
- [ ] T038 [TEST] [P] [US1] PropertyHeaderのコンポーネントテストを `frontend/tests/unit/components/PropertyHeader.test.tsx` に作成
- [ ] T039 [TEST] [P] [US1] CategoryListのコンポーネントテストを `frontend/tests/unit/components/CategoryList.test.tsx` に作成
- [ ] T040 [TEST] [P] [US1] ContentListのコンポーネントテストを `frontend/tests/unit/components/ContentList.test.tsx` に作成
- [ ] T041 [TEST] [P] [US1] ContentDetailのコンポーネントテストを `frontend/tests/unit/components/ContentDetail.test.tsx` に作成
- [ ] T042 [TEST] [US1] ゲスト閲覧フローのE2Eテストを `frontend/tests/e2e/guest/browse-manual.spec.ts` に作成（受け入れシナリオ1-5を検証）
- [ ] T043 [TEST] [US1] 無効な物件URLのE2Eテストを `frontend/tests/e2e/guest/invalid-property.spec.ts` に作成（エッジケース検証）

**チェックポイント**: US1完了 - ゲストがマニュアルを閲覧できる状態（MVP達成）、全テストがパス

---

## Phase 4: ユーザーストーリー 3 - オーナーがコンテンツを管理する (優先度: P1)

**目標**: オーナーがStrapi管理画面からコンテンツを作成・編集・削除・公開できる

**独立テスト**: Strapi管理画面でコンテンツを作成し、公開状態にするとフロントエンドに表示される

**注記**: Strapiの標準機能で大部分が実現されるため、カスタマイズのみ実装

### Strapiカスタマイズ

- [ ] T044 [US3] Contentモデルにpublishedフィールドのデフォルト値（false）を設定 `backend/src/api/content/content-types/content/schema.json`
- [ ] T045 [US3] リッチテキストエディタ設定を `backend/config/plugins.ts` で調整（見出し、太字、斜体、リスト、リンク有効化）
- [ ] T046 [US3] サマリー計算フィールドを `backend/src/api/content/controllers/content.ts` に実装（本文先頭100文字）

### フロントエンド対応

- [ ] T047 [US3] 公開コンテンツのみ表示するフィルタを `frontend/src/lib/strapi.ts` の各取得関数に追加（published: true）
- [ ] T048 [US3] 公開コンテンツがないカテゴリを非表示にするロジックを `frontend/src/components/CategoryList.tsx` に追加

### US3テスト

- [ ] T049 [TEST] [US3] サマリー計算ロジックのユニットテストを `backend/tests/unit/content-summary.test.ts` に作成
- [ ] T050 [TEST] [US3] 公開フィルタのユニットテストを `frontend/tests/unit/lib/strapi-publish-filter.test.ts` に作成
- [ ] T051 [TEST] [US3] コンテンツCRUD操作のE2Eテストを `frontend/tests/e2e/owner/content-crud.spec.ts` に作成（受け入れシナリオ1-6を検証）
- [ ] T052 [TEST] [US3] 下書きコンテンツ非表示のE2Eテストを `frontend/tests/e2e/guest/draft-content.spec.ts` に作成

**チェックポイント**: US3完了 - オーナーがコンテンツをCRUD操作可能、全テストがパス

---

## Phase 5: ユーザーストーリー 4 - オーナーが物件を管理する (優先度: P1)

**目標**: オーナーが複数の物件を登録し、それぞれ独立したマニュアルを管理できる

**独立テスト**: 新規物件を登録すると、デフォルトカテゴリが自動作成され、固有URLでアクセス可能

### Strapiカスタマイズ

- [ ] T053 [US4] URLスラッグのバリデーションを `backend/src/api/property/content-types/property/schema.json` に追加（regex: ^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$、unique: true）
- [ ] T054 [US4] デフォルトカテゴリ自動作成ロジックをライフサイクルフック `backend/src/api/property/content-types/property/lifecycles.ts` に実装（設備の使い方🏠、ハウスルール📋、周辺情報📍、緊急時の対応🆘）
- [ ] T055 [US4] オーナーと物件のリレーション設定を `backend/src/api/property/content-types/property/schema.json` に追加

### アクセス制御

- [ ] T056 [US4] isOwnerポリシーを `backend/src/policies/is-owner.ts` に作成（オーナーは自分の物件のみ編集可能）
- [ ] T057 [US4] Property/Category/ContentのCRUDルートにisOwnerポリシーを適用

### US4テスト

- [ ] T058 [TEST] [US4] URLスラッグバリデーションのユニットテストを `backend/tests/unit/property-slug.test.ts` に作成
- [ ] T059 [TEST] [US4] デフォルトカテゴリ自動作成のユニットテストを `backend/tests/unit/property-lifecycle.test.ts` に作成
- [ ] T060 [TEST] [US4] isOwnerポリシーのユニットテストを `backend/tests/unit/policies/is-owner.test.ts` に作成
- [ ] T061 [TEST] [US4] 物件管理のE2Eテストを `frontend/tests/e2e/owner/property-crud.spec.ts` に作成（受け入れシナリオ1-4を検証）
- [ ] T062 [TEST] [US4] 他オーナーの物件編集禁止のE2Eテストを `frontend/tests/e2e/owner/property-access-control.spec.ts` に作成

**チェックポイント**: US4完了 - オーナーが複数物件を独立管理可能、全テストがパス

---

## Phase 6: ユーザーストーリー 2 - ゲストがマニュアルを検索する (優先度: P2)

**目標**: ゲストがキーワードでコンテンツを検索し、素早く目的の情報を見つけられる

**独立テスト**: 検索バーに「エアコン」と入力すると、タイトルまたは本文に「エアコン」を含むコンテンツが表示される

### APIクライアント拡張

- [ ] T063 [US2] 検索関数 `searchContents` を `frontend/src/lib/strapi.ts` に追加（$or + $containsi フィルタ）

### UIコンポーネント

- [ ] T064 [P] [US2] SearchBarコンポーネントを `frontend/src/components/SearchBar.tsx` に作成（入力フィールド、検索ボタン）
- [ ] T065 [P] [US2] SearchResultsコンポーネントを `frontend/src/components/SearchResults.tsx` に作成（結果リスト、ハイライト表示、「見つかりません」メッセージ）

### ページ統合

- [ ] T066 [US2] SearchBarを `frontend/src/app/[slug]/page.tsx` に追加
- [ ] T067 [US2] 検索結果表示ロジックを物件トップページに実装（クライアントコンポーネント化）
- [ ] T068 [US2] キーワードハイライト機能を `frontend/src/components/SearchResults.tsx` に実装

### US2テスト

- [ ] T069 [TEST] [US2] 検索関数のユニットテストを `frontend/tests/unit/lib/strapi-search.test.ts` に作成
- [ ] T070 [TEST] [US2] ハイライト機能のユニットテストを `frontend/tests/unit/components/SearchResults-highlight.test.tsx` に作成
- [ ] T071 [TEST] [P] [US2] SearchBarのコンポーネントテストを `frontend/tests/unit/components/SearchBar.test.tsx` に作成
- [ ] T072 [TEST] [P] [US2] SearchResultsのコンポーネントテストを `frontend/tests/unit/components/SearchResults.test.tsx` に作成
- [ ] T073 [TEST] [US2] 検索フローのE2Eテストを `frontend/tests/e2e/guest/search.spec.ts` に作成（受け入れシナリオ1-4を検証）
- [ ] T074 [TEST] [US2] 検索レスポンス時間のパフォーマンステストを `frontend/tests/e2e/performance/search-response.spec.ts` に作成（SC-002: 2秒以内を検証）

**チェックポイント**: US2完了 - ゲストがキーワード検索可能、全テストがパス

---

## Phase 7: ユーザーストーリー 5 - オーナーがカテゴリを管理する (優先度: P2)

**目標**: オーナーがカテゴリを作成・編集・削除・並び替えできる

**独立テスト**: カテゴリの表示順を変更すると、フロントエンドの表示順序が更新される

### Strapiカスタマイズ

- [ ] T075 [US5] カテゴリ削除時の警告ロジックを `backend/src/api/category/controllers/category.ts` に実装（コンテンツ紐付きチェック）
- [ ] T076 [US5] カテゴリ名の物件内一意制約を `backend/src/api/category/content-types/category/schema.json` に追加

### フロントエンド対応

- [ ] T077 [US5] カテゴリ表示順（order: asc）ソートを `frontend/src/lib/strapi.ts` の `getCategoriesByProperty` に追加

### US5テスト

- [ ] T078 [TEST] [US5] カテゴリ削除警告ロジックのユニットテストを `backend/tests/unit/category-delete.test.ts` に作成
- [ ] T079 [TEST] [US5] カテゴリ表示順ソートのユニットテストを `frontend/tests/unit/lib/strapi-category-sort.test.ts` に作成
- [ ] T080 [TEST] [US5] カテゴリ管理のE2Eテストを `frontend/tests/e2e/owner/category-crud.spec.ts` に作成（受け入れシナリオ1-4を検証）

**チェックポイント**: US5完了 - オーナーがカテゴリを柔軟に管理可能、全テストがパス

---

## Phase 8: ユーザーストーリー 6 - オーナーが画像を管理する (優先度: P2)

**目標**: オーナーがコンテンツに画像を追加し、ゲストに視覚的な説明を提供できる

**独立テスト**: コンテンツに画像をアップロードすると、フロントエンドで画像が表示される

### Strapiメディア設定

- [ ] T081 [US6] 画像アップロード制限を `backend/config/plugins.ts` に設定（5MB、JPEG/PNG/GIF/WebP）
- [ ] T082 [US6] コンテンツあたりの画像数制限（10枚）を `backend/src/api/content/content-types/content/schema.json` に追加

### フロントエンド対応

- [ ] T083 [P] [US6] ImageGalleryコンポーネントを `frontend/src/components/ImageGallery.tsx` に作成（レスポンシブ画像表示）
- [ ] T084 [US6] ImageGalleryを `frontend/src/components/ContentDetail.tsx` に統合

### US6テスト

- [ ] T085 [TEST] [US6] 画像バリデーション（サイズ、形式）のユニットテストを `backend/tests/unit/image-validation.test.ts` に作成
- [ ] T086 [TEST] [US6] ImageGalleryのコンポーネントテストを `frontend/tests/unit/components/ImageGallery.test.tsx` に作成
- [ ] T087 [TEST] [US6] 画像アップロードのE2Eテストを `frontend/tests/e2e/owner/image-upload.spec.ts` に作成（受け入れシナリオ1-4を検証）
- [ ] T088 [TEST] [US6] 画像制限エラーのE2Eテストを `frontend/tests/e2e/owner/image-limits.spec.ts` に作成（5MB超過、10枚超過、非対応形式）

**チェックポイント**: US6完了 - 画像付きコンテンツが表示可能、全テストがパス

---

## Phase 9: 仕上げ・横断的関心事

**目的**: 複数ユーザーストーリーに影響する改善

### UI/UX改善

- [ ] T089 [P] レスポンシブデザイン調整を全コンポーネントに適用（モバイルファースト）
- [ ] T090 [P] ローディング状態の表示を各ページに追加（loading.tsx）
- [ ] T091 [P] エラーバウンダリを `frontend/src/app/[slug]/error.tsx` に追加
- [ ] T092 空状態の表示を各リストコンポーネントに追加（「コンテンツがありません」など）
- [ ] T093 SEOメタデータを各ページに追加（title、description、OGP）
- [ ] T094 パフォーマンス最適化（画像のnext/image使用、フォント最適化）

### テスト・CI/CD

- [ ] T095 [TEST] GitHub Actions CIワークフローを `.github/workflows/test.yml` に作成（ユニット、統合、E2Eテスト実行）
- [ ] T096 [TEST] Lighthouse CIを `.github/workflows/lighthouse.yml` に設定（SC-006: 初期表示3秒以内を検証）
- [ ] T097 [TEST] エッジケーステストを `frontend/tests/e2e/edge-cases/` に追加（ネットワークエラー、空コンテンツ、同時編集）
- [ ] T098 [TEST] 成功基準SC-001のE2Eテストを作成（3タップ以内でコンテンツ到達を検証）
- [ ] T099 [TEST] 全テストの実行と結果確認（カバレッジレポート生成）

### 最終確認

- [ ] T100 quickstart.mdの手順で動作確認を実施
- [ ] T101 全E2Eテストのパスを確認しリリース準備完了

---

## 依存関係と実行順序

### フェーズ依存関係

```
Phase 1: セットアップ（テスト環境含む）
    ↓
Phase 2: 基盤 + 基盤テスト（全USをブロック）
    ↓
┌───────────────────────────────────────────┐
│ Phase 3: US1（実装 + テスト）🎯 MVP       │
│ Phase 4: US3（実装 + テスト）             │ ← 並列可能
│ Phase 5: US4（実装 + テスト）             │
└───────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────┐
│ Phase 6: US2（実装 + テスト）← US1に依存 │
│ Phase 7: US5（実装 + テスト）             │ ← 並列可能
│ Phase 8: US6（実装 + テスト）             │
└───────────────────────────────────────────┘
    ↓
Phase 9: 仕上げ + CI/CD + 最終テスト
```

### ユーザーストーリー依存関係

| ストーリー | 依存先 | 独立テスト可能 |
|-----------|--------|---------------|
| US1（マニュアル閲覧） | 基盤のみ | ✅ |
| US2（検索） | US1 | ✅（US1完了後） |
| US3（コンテンツ管理） | 基盤のみ | ✅ |
| US4（物件管理） | 基盤のみ | ✅ |
| US5（カテゴリ管理） | US4 | ✅（US4完了後） |
| US6（画像管理） | US3 | ✅（US3完了後） |

### 並列実行機会

**Phase 1内:**
```
並列: T003, T004, T005, T006（環境設定）
並列: T007, T008, T009（テスト環境セットアップ）
```

**Phase 2内:**
```
並列: T010, T011, T012（コンテンツタイプ）
```

**Phase 3内:**
```
並列: T028, T029, T030, T031（UIコンポーネント）
並列: T038, T039, T040, T041（コンポーネントテスト）
```

**Phase 6内:**
```
並列: T064, T065（検索UIコンポーネント）
並列: T071, T072（検索コンポーネントテスト）
```

**Phase 9内:**
```
並列: T089, T090, T091（UI改善）
```

---

## 実装戦略

### MVP優先（US1のみ）

1. Phase 1: セットアップ完了
2. Phase 2: 基盤完了（**重要**: 全USをブロック）
3. Phase 3: US1完了
4. **停止・検証**: ゲストがマニュアルを閲覧できることを確認
5. デプロイ/デモ可能

### 段階的デリバリー

1. セットアップ + 基盤 → 基盤完了
2. US1追加 → 独立テスト → デプロイ（**MVP!**）
3. US3 + US4追加 → オーナー管理機能追加 → デプロイ
4. US2追加 → 検索機能追加 → デプロイ
5. US5 + US6追加 → 管理機能強化 → デプロイ
6. 仕上げ → 本番リリース

---

## サマリー

| 項目 | 値 |
|------|-----|
| 総タスク数 | 101 |
| 実装タスク | 59タスク |
| テストタスク | 42タスク |
| Phase 1（セットアップ） | 9タスク（実装6 + テスト環境3） |
| Phase 2（基盤） | 14タスク（実装11 + テスト3） |
| Phase 3（US1） | 20タスク（実装13 + テスト7） |
| Phase 4（US3） | 9タスク（実装5 + テスト4） |
| Phase 5（US4） | 10タスク（実装5 + テスト5） |
| Phase 6（US2） | 12タスク（実装6 + テスト6） |
| Phase 7（US5） | 6タスク（実装3 + テスト3） |
| Phase 8（US6） | 8タスク（実装4 + テスト4） |
| Phase 9（仕上げ） | 13タスク（実装6 + テスト7） |
| 並列実行可能タスク | 22タスク |
| MVPスコープ | Phase 1-3（US1まで、43タスク） |

---

## 備考

- [P] タスク = 異なるファイル、依存関係なし
- [USn] ラベル = 特定のユーザーストーリーへの紐付け
- [TEST] ラベル = テスト関連タスク
- 各ユーザーストーリーは独立して完了・テスト可能
- チェックポイントで独立検証を実施（全テストがパスすること）
- タスク完了ごとにコミット推奨
- 実装タスクとテストタスクは可能な限り並行して進める
- テストがパスしない場合はチェックポイントを通過不可
