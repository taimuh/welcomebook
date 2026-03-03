/**
 * Strapi APIクライアント ユニットテスト (T021)
 */

import {
  getPropertyBySlug,
  getCategoriesByProperty,
  StrapiApiError,
} from '../../../src/lib/strapi';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockProperty = {
  id: 1,
  documentId: 'prop-1',
  name: 'テスト物件',
  slug: 'test-property',
  address: '東京都渋谷区1-2-3',
  description: 'テスト用の物件です',
  welcomeMessage: 'ようこそ！',
  emergencyContact: '090-1234-5678',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockCategory = {
  id: 1,
  documentId: 'cat-1',
  name: '設備の使い方',
  description: '家電や設備の操作方法',
  icon: '🏠',
  order: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// getCategoriesByProperty はコンテンツ経由でカテゴリを導出するため、
// モックはカテゴリ付きコンテンツのリストを返す
const mockContentsWithCategory = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: '本文1',
    order: 1,
    published: true,
    category: mockCategory,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: 'Wi-Fiの接続',
    body: '本文2',
    order: 2,
    published: true,
    category: mockCategory,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

beforeEach(() => {
  mockFetch.mockClear();
});

describe('Strapi APIクライアント', () => {
  describe('getPropertyBySlug', () => {
    it('存在する物件を取得できる', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [mockProperty],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
        }),
      });

      const property = await getPropertyBySlug('test-property');

      expect(property).not.toBeNull();
      expect(property?.name).toBe(mockProperty.name);
      expect(property?.slug).toBe(mockProperty.slug);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('存在しない物件はnullを返す', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
        }),
      });

      const property = await getPropertyBySlug('non-existent');

      expect(property).toBeNull();
    });
  });

  describe('getCategoriesByProperty', () => {
    it('物件のカテゴリ一覧を取得できる', async () => {
      // コンテンツ経由でカテゴリを導出するため、コンテンツのモックを返す
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: mockContentsWithCategory,
          meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 2 } },
        }),
      });

      const categories = await getCategoriesByProperty('prop-1');

      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe(mockCategory.name);
      expect(categories[0].contentCount).toBe(2);
    });

    it('存在しない物件の場合は空配列を返す', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 } },
        }),
      });

      const categories = await getCategoriesByProperty('non-existent-doc-id');

      expect(categories).toHaveLength(0);
    });
  });
});

describe('StrapiApiError', () => {
  it('エラー情報を保持する', () => {
    const error = new StrapiApiError({
      status: 404,
      name: 'NotFoundError',
      message: 'Not found',
    });

    expect(error.status).toBe(404);
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('Not found');
  });
});
