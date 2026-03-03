/**
 * カテゴリ表示順ソート ユニットテスト (T079)
 */

import { getCategoriesByProperty } from '../../../src/lib/strapi';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

// カテゴリ付きコンテンツのモックデータ（order がバラバラ）
const makeContent = (id: number, docId: string, category: object) => ({
  id,
  documentId: docId,
  title: `コンテンツ${id}`,
  body: '本文',
  order: id,
  published: true,
  category,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

const cat1 = { id: 1, documentId: 'cat-1', name: '設備の使い方', icon: '🏠', order: 1 };
const cat2 = { id: 2, documentId: 'cat-2', name: 'ハウスルール', icon: '📋', order: 2 };
const cat3 = { id: 3, documentId: 'cat-3', name: '周辺情報', icon: '📍', order: 3 };

describe('カテゴリ表示順ソート', () => {
  it('APIリクエストに venue の documentId フィルタが含まれる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 } },
      }),
    });

    await getCategoriesByProperty('prop-doc-id');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('filters[venue][documentId][$eq]=prop-doc-id');
    expect(calledUrl).toContain('filters[published][$eq]=true');
  });

  it('カテゴリが order 昇順で返される（コンテンツが逆順でも）', async () => {
    // コンテンツを cat3 → cat1 → cat2 の順で返す（order が逆）
    const contentsOutOfOrder = [
      makeContent(3, 'content-3', cat3),
      makeContent(1, 'content-1', cat1),
      makeContent(2, 'content-2', cat2),
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: contentsOutOfOrder,
        meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 3 } },
      }),
    });

    const categories = await getCategoriesByProperty('prop-doc-id');

    // JavaScript 側で order 順にソートされる
    expect(categories).toHaveLength(3);
    expect(categories[0].name).toBe('設備の使い方'); // order: 1
    expect(categories[1].name).toBe('ハウスルール'); // order: 2
    expect(categories[2].name).toBe('周辺情報');   // order: 3
  });

  it('同カテゴリの複数コンテンツが contentCount に集計される', async () => {
    const contents = [
      makeContent(1, 'content-1', cat1),
      makeContent(2, 'content-2', cat1),
      makeContent(3, 'content-3', cat2),
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: contents,
        meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 3 } },
      }),
    });

    const categories = await getCategoriesByProperty('prop-doc-id');

    expect(categories).toHaveLength(2);
    expect(categories[0].contentCount).toBe(2); // cat1: 2件
    expect(categories[1].contentCount).toBe(1); // cat2: 1件
  });
});
