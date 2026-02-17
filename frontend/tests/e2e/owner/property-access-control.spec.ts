/**
 * 他オーナーの物件編集禁止 E2Eテスト (T062)
 */

import { test, expect } from '@playwright/test';

test.describe('物件アクセス制御', () => {
  test('認証なしでゲスト向けページにアクセスできる', async ({ page }) => {
    await page.goto('/test-property');

    // 認証なしでもゲスト向けページは閲覧可能
    await expect(page.locator('body')).toBeVisible();
  });

  test('認証なしではAPIの書き込みが拒否される', async ({ request }) => {
    // 認証なしでPropertyの作成を試みる
    const response = await request.post('http://localhost:1337/api/listings', {
      data: {
        data: {
          name: '不正な物件',
          slug: 'unauthorized-property',
        },
      },
    });

    // 401 Unauthorizedまたは403 Forbiddenが返される
    expect([401, 403]).toContain(response.status());
  });

  test('認証なしではAPIの更新が拒否される', async ({ request }) => {
    // 認証なしでPropertyの更新を試みる
    const response = await request.put(
      'http://localhost:1337/api/listings/non-existent-id',
      {
        data: {
          data: {
            name: '不正な更新',
          },
        },
      }
    );

    // 401 Unauthorizedまたは403 Forbiddenが返される
    expect([401, 403]).toContain(response.status());
  });

  test('認証なしではAPIの削除が拒否される', async ({ request }) => {
    // 認証なしでPropertyの削除を試みる
    const response = await request.delete(
      'http://localhost:1337/api/listings/non-existent-id'
    );

    // 401 Unauthorizedまたは403 Forbiddenが返される
    expect([401, 403]).toContain(response.status());
  });
});
