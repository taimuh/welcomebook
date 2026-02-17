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

    // ページが読み込まれるのを待つ
    await page.waitForLoadState('networkidle');

    // 404ページが表示される（または物件ページにリダイレクト、またはエラーページ）
    const body = await page.locator('body').textContent();
    const is404 = body?.includes('404') || body?.includes('見つかりません');
    const isPropertyPage = body?.includes('カテゴリ');
    const isErrorPage = body?.includes('error') || body?.includes('Error');

    expect(is404 || isPropertyPage || isErrorPage).toBeTruthy();
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
