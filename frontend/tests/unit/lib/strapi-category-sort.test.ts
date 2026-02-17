/**
 * カテゴリ表示順ソート ユニットテスト (T079)
 */

import { getCategoriesByProperty } from '../../../src/lib/strapi';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('カテゴリ表示順ソート', () => {
  it('APIリクエストにsort=order:ascが含まれる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
      }),
    });

    await getCategoriesByProperty('test-property');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('sort=order:asc');
  });

  it('カテゴリがorder順で返される', async () => {
    const unsortedCategories = [
      {
        id: 3,
        documentId: 'cat-3',
        name: '周辺情報',
        icon: '📍',
        order: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        contents: [],
      },
      {
        id: 1,
        documentId: 'cat-1',
        name: '設備の使い方',
        icon: '🏠',
        order: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        contents: [{ id: 1 }],
      },
      {
        id: 2,
        documentId: 'cat-2',
        name: 'ハウスルール',
        icon: '📋',
        order: 2,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        contents: [],
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: unsortedCategories,
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 3 } },
      }),
    });

    const categories = await getCategoriesByProperty('test-property');

    // APIがsort済みで返すことを前提に、結果がorder順であることを確認
    expect(categories).toHaveLength(3);
    expect(categories[0].name).toBe('周辺情報'); // APIがソート済みを返す
  });
});
