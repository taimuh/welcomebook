/**
 * MSW Handlers - Strapi APIモック定義
 */

import { http, HttpResponse } from 'msw';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// モックデータ
export const mockProperty = {
  id: 1,
  documentId: 'prop-1',
  name: 'テスト物件',
  slug: 'test-property',
  address: '東京都渋谷区1-2-3',
  description: 'テスト用の物件です',
  welcomeMessage: 'ようこそ！快適な滞在をお楽しみください。',
  emergencyContact: '090-1234-5678',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockCategories = [
  {
    id: 1,
    documentId: 'cat-1',
    name: '設備の使い方',
    description: '家電や設備の操作方法',
    icon: '🏠',
    order: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contents: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    documentId: 'cat-2',
    name: 'ハウスルール',
    description: '滞在中のルールやマナー',
    icon: '📋',
    order: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contents: [{ id: 3 }],
  },
];

export const mockContents = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: 'リモコンの電源ボタンを押して...',
    order: 1,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: '洗濯機の使い方',
    body: '洗剤を入れて、電源を入れます...',
    order: 2,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const handlers = [
  // 物件取得
  http.get(`${STRAPI_URL}/api/listings`, ({ request }) => {
    const url = new URL(request.url);
    const slugFilter = url.searchParams.get('filters[slug][$eq]');

    if (slugFilter === 'test-property') {
      return HttpResponse.json({
        data: [mockProperty],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
      });
    }

    if (slugFilter === 'non-existent') {
      return HttpResponse.json({
        data: [],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
      });
    }

    return HttpResponse.json({
      data: [mockProperty],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
    });
  }),

  // カテゴリ一覧取得
  http.get(`${STRAPI_URL}/api/categories`, ({ request }) => {
    const url = new URL(request.url);
    const propertySlug = url.searchParams.get('filters[property][slug][$eq]');

    if (propertySlug === 'test-property') {
      return HttpResponse.json({
        data: mockCategories,
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 2 } },
      });
    }

    return HttpResponse.json({
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    });
  }),

  // コンテンツ一覧取得
  http.get(`${STRAPI_URL}/api/contents`, ({ request }) => {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('filters[category][documentId][$eq]');

    if (categoryId === 'cat-1') {
      return HttpResponse.json({
        data: mockContents,
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 2 } },
      });
    }

    return HttpResponse.json({
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    });
  }),

  // コンテンツ詳細取得
  http.get(`${STRAPI_URL}/api/contents/:documentId`, ({ params }) => {
    const { documentId } = params;
    const content = mockContents.find((c) => c.documentId === documentId);

    if (content) {
      return HttpResponse.json({
        data: content,
        meta: {},
      });
    }

    return HttpResponse.json(
      {
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Content not found',
        },
      },
      { status: 404 }
    );
  }),
];
