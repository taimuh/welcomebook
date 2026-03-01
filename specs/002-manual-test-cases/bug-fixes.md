# 故障一覧

作成日: 2026-03-01
ブランチ: `002-manual-test-cases`

---

## BUG-001: 物件登録時に「Invalid key set at property」エラー

- **現象**: Strapi 管理画面から物件（Listing）を新規作成すると、HTTP 400 `"Invalid key set at property"` が返り登録できない。
- **原因**: Listing の `afterCreate` ライフサイクルフックでデフォルトカテゴリを作成する際、リレーションフィールドを `property: result.documentId`（文字列直代入）で設定していた。Strapi 5 の document service は文字列代入を内部で `{ set: [...] }` に変換するが、`set` 操作がバリデーションで拒否される。
- **処置**:
  - `venue: { connect: [result.documentId] }` の `connect` 構文に変更。
  - Strapi の型定義に `connect` が含まれないため `as any` で型アサーション追加。
- **対象ファイル**: `backend/src/api/listing/content-types/listing/lifecycles.ts`

---

## BUG-002: 双方向リレーション宣言による管理画面エラー

- **現象**: BUG-001 と同じエラー。ライフサイクルを修正しても管理画面からの物件登録で `"Invalid key set at venue"` が発生する。
- **原因**: Listing スキーマに `oneToMany` + `mappedBy`（双方向リレーション）を宣言していたため、Strapi 管理画面が Listing 保存時に逆方向リレーション（Category/Content 側の `venue` フィールド）に対して `set` 操作を自動送信し、バリデーションエラーとなっていた。
- **処置**:
  - Listing スキーマから `categories` と `contents` の `oneToMany` 宣言を削除。
  - Category・Content スキーマの `venue` フィールドから `inversedBy` を削除し、単方向 `manyToOne` リレーションに変更。
  - フロントエンドは `filters[venue][slug]` でクエリしているため機能影響なし。
- **対象ファイル**:
  - `backend/src/api/listing/content-types/listing/schema.json`
  - `backend/src/api/category/content-types/category/schema.json`
  - `backend/src/api/content/content-types/content/schema.json`

---

## BUG-003: デフォルトカテゴリ作成時に「Undefined attribute level operator id」エラー

- **現象**: 物件登録後、`afterCreate` ライフサイクルがデフォルトカテゴリを作成する際に `"Undefined attribute level operator id"` エラーが発生する。
- **原因**: Category の `beforeCreate` ライフサイクル内の一意制約バリデーションで、`venue: { documentId: venueId }` というフィルター構文を使用していたが、単方向リレーションでは Strapi 5 のクエリビルダーがこの形式を解決できない。
- **処置**:
  - フィルターを `venue: venueId`（documentId 直接指定）に簡略化。
  - `venue` の値が文字列または `{ connect: [...] }` のどちらで渡されても対応できるようパース処理を追加。
- **対象ファイル**: `backend/src/api/category/content-types/category/lifecycles.ts`

---

## BUG-004: Strapi 起動時の TypeScript コンパイルエラー

- **現象**: BUG-001 の修正で `connect` 構文を導入した後、`npm run develop` で Strapi が起動しない。`TS2353: Object literal may only specify known properties, and 'connect' does not exist in type 'LongHandEntity | LongHandDocument'` エラー。
- **原因**: Strapi 5 の自動生成型定義にリレーションの `connect` 構文が含まれていない。
- **処置**: `data` オブジェクトに `as any` 型アサーションを追加してコンパイルエラーを回避。
- **対象ファイル**: `backend/src/api/listing/content-types/listing/lifecycles.ts`

---

## BUG-005: コンテンツ詳細画面で「エラーが発生しました」表示

- **現象**: フロントエンドでコンテンツ詳細ページ (`/{slug}/content/{contentId}`) にアクセスすると「エラーが発生しました」ページが表示される。
- **原因**: `getContentById` 関数が `populate=images,category`（カンマ区切り）で Strapi API を呼び出していたが、Strapi 5 REST API はカンマ区切りの `populate` を受け付けず HTTP 400 `"Invalid key images,category"` を返していた。
- **処置**: `populate[0]=images&populate[1]=category`（配列形式）に変更。
- **対象ファイル**: `frontend/src/lib/strapi.ts`

---

## 関連する変更（故障修正に伴う波及修正）

### リレーションフィールド名リネーム: `property` → `venue`

- **理由**: `property` は Strapi の予約語であり、`listing` は content type の `singularName` と衝突するため、`venue` を採用。
- **対象ファイル（10ファイル）**:
  - `backend/src/api/category/content-types/category/schema.json`
  - `backend/src/api/content/content-types/content/schema.json`
  - `backend/src/api/listing/content-types/listing/schema.json`
  - `backend/src/api/category/content-types/category/lifecycles.ts`
  - `backend/src/api/listing/content-types/listing/lifecycles.ts`
  - `backend/src/policies/is-owner.ts`
  - `frontend/src/lib/strapi.ts`
  - `backend/tests/unit/policies/is-owner.test.ts`
  - `frontend/tests/unit/lib/strapi-search.test.ts`
  - `frontend/tests/e2e/mock-strapi-server.mjs`

### is-owner ポリシーの `connect` 形式対応

- **理由**: REST API 経由のリクエストボディで `venue` が文字列または `{ connect: [...] }` のどちらで渡されても正しく documentId を抽出できるようにする。
- **対象ファイル**: `backend/src/policies/is-owner.ts`
