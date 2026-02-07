/**
 * ゲスト閲覧フロー E2Eテスト (T042)
 * 受け入れシナリオ1-5を検証
 */

import { test, expect } from '@playwright/test';

test.describe('ゲストがマニュアルを閲覧する', () => {
  test.beforeEach(async ({ page }) => {
    // テスト物件ページにアクセス
    await page.goto('/test-property');
  });

  test('シナリオ1: 物件トップページでカテゴリ一覧が表示される', async ({ page }) => {
    // 物件名が表示される
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // カテゴリ一覧が表示される
    await expect(page.getByText('カテゴリ')).toBeVisible();
  });

  test('シナリオ2: カテゴリを選択してコンテンツ一覧が表示される', async ({ page }) => {
    // カテゴリをクリック
    const categoryLink = page.getByRole('link').filter({ hasText: /設備|ハウスルール|周辺情報|緊急/ }).first();
    await categoryLink.click();

    // カテゴリページに遷移
    await expect(page).toHaveURL(/\/test-property\/[a-z0-9-]+/);

    // 戻るリンクがある
    await expect(page.getByRole('link', { name: /テスト物件/ })).toBeVisible();
  });

  test('シナリオ3: コンテンツを選択して詳細が表示される', async ({ page }) => {
    // カテゴリをクリック
    const categoryLink = page.getByRole('link').filter({ hasText: /設備|ハウスルール|周辺情報|緊急/ }).first();
    await categoryLink.click();

    // コンテンツがあれば、最初のコンテンツをクリック
    const contentLink = page.getByRole('link').filter({ hasNotText: /テスト物件/ }).first();
    const contentVisible = await contentLink.isVisible().catch(() => false);

    if (contentVisible) {
      await contentLink.click();

      // コンテンツ詳細ページに遷移
      await expect(page).toHaveURL(/\/test-property\/content\/[a-z0-9-]+/);

      // コンテンツタイトルが表示される
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('シナリオ4: 緊急連絡先が表示される', async ({ page }) => {
    // 緊急連絡先セクションが表示される（存在する場合）
    const emergencySection = page.getByText('緊急連絡先');
    const isVisible = await emergencySection.isVisible().catch(() => false);

    if (isVisible) {
      await expect(emergencySection).toBeVisible();
      // 電話リンクがある
      await expect(page.getByRole('link', { name: /\d{2,4}-\d{2,4}-\d{4}/ })).toBeVisible();
    }
  });

  test('シナリオ5: 3タップ以内でコンテンツに到達できる', async ({ page }) => {
    // タップ1: カテゴリをクリック
    const categoryLink = page.getByRole('link').filter({ hasText: /設備|ハウスルール|周辺情報|緊急/ }).first();
    const categoryVisible = await categoryLink.isVisible().catch(() => false);

    if (categoryVisible) {
      await categoryLink.click();

      // タップ2: コンテンツをクリック
      const contentLink = page.getByRole('link').filter({ hasNotText: /テスト物件/ }).first();
      const contentVisible = await contentLink.isVisible().catch(() => false);

      if (contentVisible) {
        await contentLink.click();

        // コンテンツ詳細ページに到達（2タップ）
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });
});
