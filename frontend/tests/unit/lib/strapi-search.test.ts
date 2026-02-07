/**
 * 検索関数 ユニットテスト (T069)
 */

import { searchContents } from '../../../src/lib/strapi';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

const mockSearchResults = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: 'リモコンの電源ボタンを押してエアコンを操作します。',
    order: 1,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: 'エアコンのリモコン',
    body: 'リモコンは壁に掛かっています。',
    order: 2,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('searchContents', () => {
  it('キーワードでコンテンツを検索できる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockSearchResults,
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 2 } },
      }),
    });

    const results = await searchContents('test-property', 'エアコン');

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('エアコンの使い方');
    expect(results[1].title).toBe('エアコンのリモコン');
  });

  it('$or + $containsiフィルタを使用してAPIを呼び出す', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
      }),
    });

    await searchContents('test-property', 'エアコン');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('filters[$or][0][title][$containsi]');
    expect(calledUrl).toContain('filters[$or][1][body][$containsi]');
    expect(calledUrl).toContain('filters[property][slug][$eq]=test-property');
    expect(calledUrl).toContain('filters[published][$eq]=true');
  });

  it('検索結果にサマリーが含まれる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [mockSearchResults[0]],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
      }),
    });

    const results = await searchContents('test-property', 'エアコン');

    expect(results[0].summary).toBeDefined();
    expect(results[0].summary).toBe('リモコンの電源ボタンを押してエアコンを操作します。');
  });

  it('結果なしの場合は空配列を返す', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
      }),
    });

    const results = await searchContents('test-property', '存在しないキーワード');

    expect(results).toHaveLength(0);
  });

  it('物件スラッグでフィルタされる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
      }),
    });

    await searchContents('my-property', 'test');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('filters[property][slug][$eq]=my-property');
  });
});
