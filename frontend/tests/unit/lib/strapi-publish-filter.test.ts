/**
 * 公開フィルタ ユニットテスト (T050)
 */

import { getContentsByCategory, searchContents } from '../../../src/lib/strapi';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('公開コンテンツフィルタ', () => {
  describe('getContentsByCategory', () => {
    it('APIリクエストにpublished=trueフィルタが含まれる', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
        }),
      });

      await getContentsByCategory('cat-1');

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('filters[published][$eq]=true');
    });

    it('公開コンテンツのみ返す', async () => {
      const publishedContent = {
        id: 1,
        documentId: 'content-1',
        title: '公開コンテンツ',
        body: '本文テスト',
        order: 1,
        published: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [publishedContent],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
        }),
      });

      const results = await getContentsByCategory('cat-1');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('公開コンテンツ');
    });
  });

  describe('searchContents', () => {
    it('APIリクエストにpublished=trueフィルタが含まれる', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
        }),
      });

      await searchContents('test-property', 'エアコン');

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('filters[published][$eq]=true');
    });
  });
});
