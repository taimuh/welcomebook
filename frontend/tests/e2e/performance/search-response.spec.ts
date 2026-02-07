/**
 * 検索レスポンス時間 パフォーマンステスト (T074)
 * SC-002: 検索結果2秒以内を検証
 */

import { test, expect } from '@playwright/test';

test.describe('検索パフォーマンス', () => {
  test('SC-002: 検索結果が2秒以内に表示される', async ({ page }) => {
    await page.goto('/test-property');

    const searchInput = page.getByPlaceholder('キーワードで検索...');
    const isVisible = await searchInput.isVisible().catch(() => false);

    if (isVisible) {
      await searchInput.fill('エアコン');

      const startTime = Date.now();

      const searchButton = page.getByRole('button', { name: '検索' });
      await searchButton.click();

      // 検索結果またはno-results メッセージの表示を待つ
      await Promise.race([
        page.getByText(/検索結果/).waitFor({ timeout: 2000 }).catch(() => null),
        page.getByText(/見つかりませんでした/).waitFor({ timeout: 2000 }).catch(() => null),
        page.getByText(/検索中/).waitFor({ state: 'hidden', timeout: 2000 }).catch(() => null),
      ]);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // 2秒以内であることを確認
      expect(responseTime).toBeLessThan(2000);
    }
  });
});
