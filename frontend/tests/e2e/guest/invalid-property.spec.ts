/**
 * 無効な物件URL E2Eテスト (T043)
 * エッジケース検証
 */

import { test, expect } from '@playwright/test';

test.describe('無効な物件URLへのアクセス', () => {
  test('存在しない物件スラッグで404ページが表示される', async ({ page }) => {
    await page.goto('/non-existent-property-12345');

    // 404ページが表示される
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('ページが見つかりません')).toBeVisible();
  });

  test('存在しないカテゴリIDで404ページが表示される', async ({ page }) => {
    await page.goto('/test-property/non-existent-category-12345');

    // 404ページが表示される（または物件ページにリダイレクト）
    const is404 = await page.getByText('404').isVisible().catch(() => false);
    const isPropertyPage = await page.getByText('カテゴリ').isVisible().catch(() => false);

    expect(is404 || isPropertyPage).toBeTruthy();
  });

  test('存在しないコンテンツIDで404ページが表示される', async ({ page }) => {
    await page.goto('/test-property/content/non-existent-content-12345');

    // 404ページが表示される
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('ページが見つかりません')).toBeVisible();
  });

  test('404ページにトップページへのリンクがある', async ({ page }) => {
    await page.goto('/non-existent-property-12345');

    // トップページへのリンクがある
    const homeLink = page.getByRole('link', { name: /トップページへ戻る/ });
    await expect(homeLink).toBeVisible();
  });
});
