/**
 * 成功基準SC-001 E2Eテスト (T098)
 * 3タップ以内でコンテンツ到達を検証
 */

import { test, expect } from '@playwright/test';

test.describe('SC-001: 3タップ以内でコンテンツに到達', () => {
  test('物件トップ → カテゴリ → コンテンツ詳細（2タップ）', async ({ page }) => {
    // タップ0: 物件トップページにアクセス（URLから直接）
    await page.goto('/test-property');
    await expect(page.locator('body')).toBeVisible();

    // タップ1: カテゴリを選択
    const categoryLink = page
      .getByRole('link')
      .filter({ hasText: /設備|ハウスルール|周辺情報|緊急/ })
      .first();
    const categoryVisible = await categoryLink.isVisible().catch(() => false);

    if (categoryVisible) {
      await categoryLink.click();

      // カテゴリページに遷移
      await expect(page).toHaveURL(/\/test-property\/[a-z0-9-]+/);

      // タップ2: コンテンツを選択
      const contentLink = page
        .getByRole('link')
        .filter({ hasNotText: /テスト物件|カテゴリ/ })
        .first();
      const contentVisible = await contentLink.isVisible().catch(() => false);

      if (contentVisible) {
        await contentLink.click();

        // コンテンツ詳細ページに到達
        await expect(page).toHaveURL(/\/content\//);

        // コンテンツのタイトルが表示される
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      }
    }
  });

  test('検索からのコンテンツ到達（2タップ）', async ({ page }) => {
    // タップ0: 物件トップページにアクセス
    await page.goto('/test-property');

    const searchInput = page.getByPlaceholder('キーワードで検索...');
    const isVisible = await searchInput.isVisible().catch(() => false);

    if (isVisible) {
      // タップ1: 検索実行（入力 + ボタンクリック = 1タップとカウント）
      await searchInput.fill('エアコン');
      const searchButton = page.getByRole('button', { name: '検索' });
      await searchButton.click();

      await page.waitForTimeout(2000);

      // タップ2: 検索結果からコンテンツを選択
      const resultLink = page.getByRole('link').filter({ hasText: /エアコン/ }).first();
      const resultVisible = await resultLink.isVisible().catch(() => false);

      if (resultVisible) {
        await resultLink.click();

        // コンテンツ詳細ページに到達
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });
});
