/**
 * E2Eテスト用モック Strapi APIサーバー
 * CI環境でStrapiバックエンドなしにE2Eテストを実行するためのモックサーバー
 */

import { createServer } from 'node:http';

const PORT = parseInt(process.env.MOCK_PORT || '1338');

// --- モックデータ ---

const mockProperty = {
  id: 1,
  documentId: 'prop-1',
  name: 'テスト物件',
  slug: 'test-property',
  address: '東京都渋谷区1-1-1',
  description: 'テスト用の物件です',
  welcomeMessage: 'ようこそテスト物件へ！',
  emergencyContact: '090-1234-5678',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockCategories = [
  {
    id: 1,
    documentId: 'cat-1',
    name: '設備の使い方',
    description: '設備の使い方について',
    icon: '🏠',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    contents: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    documentId: 'cat-2',
    name: 'ハウスルール',
    description: 'ハウスルールについて',
    icon: '📋',
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    contents: [{ id: 3 }],
  },
  {
    id: 3,
    documentId: 'cat-3',
    name: '周辺情報',
    description: '周辺情報について',
    icon: '🗺️',
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    contents: [{ id: 4 }],
  },
  {
    id: 4,
    documentId: 'cat-4',
    name: '緊急時の対応',
    description: '緊急時の対応について',
    icon: '🆘',
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    contents: [{ id: 5 }],
  },
];

const mockContents = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: 'リモコンの電源ボタンを押してエアコンを操作します。冷房・暖房の切り替えはモード切替ボタンで行います。',
    order: 1,
    published: true,
    category: { id: 1, documentId: 'cat-1', name: '設備の使い方', order: 1 },
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: 'Wi-Fiの接続方法',
    body: 'ネットワーク名: TestProperty-WiFi パスワード: welcome123',
    order: 2,
    published: true,
    category: { id: 1, documentId: 'cat-1', name: '設備の使い方', order: 1 },
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    documentId: 'content-3',
    title: 'ゴミ出しのルール',
    body: '燃えるゴミは月・木、燃えないゴミは水曜日に出してください。',
    order: 1,
    published: true,
    category: { id: 2, documentId: 'cat-2', name: 'ハウスルール', order: 2 },
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    documentId: 'content-4',
    title: '近くのコンビニ',
    body: '徒歩5分の場所にセブンイレブンがあります。',
    order: 1,
    published: true,
    category: { id: 3, documentId: 'cat-3', name: '周辺情報', order: 3 },
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    documentId: 'content-5',
    title: '緊急連絡先',
    body: '警察: 110 消防: 119 管理者: 090-1234-5678',
    order: 1,
    published: true,
    category: { id: 4, documentId: 'cat-4', name: '緊急時の対応', order: 4 },
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// --- ヘルパー関数 ---

const meta = { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } };

function jsonResponse(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function getQueryParam(url, key) {
  const params = new URL(url, 'http://localhost').searchParams;
  return params.get(key);
}

// --- ルーティング ---

function handleListings(req, res, url) {
  if (req.method !== 'GET') {
    return jsonResponse(res, {
      error: { status: 403, name: 'ForbiddenError', message: 'Forbidden' },
    }, 403);
  }

  const slugFilter = getQueryParam(url, 'filters[slug][$eq]');
  if (slugFilter === 'test-property') {
    return jsonResponse(res, {
      data: [mockProperty],
      meta: { ...meta, pagination: { ...meta.pagination, total: 1 } },
    });
  }

  // 存在しない物件
  return jsonResponse(res, { data: [], meta });
}

function handleCategories(req, res, url) {
  if (req.method === 'DELETE') {
    return jsonResponse(res, {
      error: { status: 403, name: 'ForbiddenError', message: 'Forbidden' },
    }, 403);
  }

  return jsonResponse(res, { data: [], meta });
}

function handleContents(req, res, url) {
  const pathname = new URL(url, 'http://localhost').pathname;

  // documentId指定: filters[documentId][$eq] (getContentByIdで使用)
  const contentDocId = getQueryParam(url, 'filters[documentId][$eq]');
  if (contentDocId) {
    const content = mockContents.find((c) => c.documentId === contentDocId);
    return jsonResponse(res, {
      data: content ? [content] : [],
      meta: { ...meta, pagination: { ...meta.pagination, total: content ? 1 : 0 } },
    });
  }

  // 検索: $containsi パラメータが存在する場合
  const searchKeyword =
    getQueryParam(url, 'filters[$or][0][title][$containsi]') ||
    getQueryParam(url, 'filters[$or][1][body][$containsi]');

  if (searchKeyword) {
    const keyword = searchKeyword.toLowerCase();
    const results = mockContents.filter(
      (c) =>
        c.published &&
        (c.title.toLowerCase().includes(keyword) ||
          c.body.toLowerCase().includes(keyword))
    );
    return jsonResponse(res, {
      data: results,
      meta: { ...meta, pagination: { ...meta.pagination, total: results.length } },
    });
  }

  // カテゴリ別: filters[category][documentId][$eq]
  const categoryDocId = getQueryParam(url, 'filters[category][documentId][$eq]');
  if (categoryDocId) {
    const results = mockContents.filter(
      (c) => c.published && c.category && c.category.documentId === categoryDocId
    );
    return jsonResponse(res, {
      data: results,
      meta: { ...meta, pagination: { ...meta.pagination, total: results.length } },
    });
  }

  // 物件別: filters[venue][documentId][$eq] (getCategoriesByProperty で使用)
  const venueDocId = getQueryParam(url, 'filters[venue][documentId][$eq]');
  if (venueDocId === 'prop-1') {
    const results = mockContents.filter((c) => c.published);
    return jsonResponse(res, {
      data: results,
      meta: { ...meta, pagination: { ...meta.pagination, total: results.length } },
    });
  }

  return jsonResponse(res, { data: [], meta });
}

function handleAdmin(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>Strapi Admin (Mock)</h1></body></html>');
}

// --- サーバー ---

const server = createServer((req, res) => {
  const url = req.url || '/';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // ヘルスチェック (Playwright webServer)
  if (url === '/' || url === '') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('{"ok":true}');
  }

  // 管理画面
  if (url.startsWith('/admin')) {
    return handleAdmin(req, res);
  }

  // POST/PUT/DELETE on listings
  if (url.startsWith('/api/listings') && req.method !== 'GET') {
    return jsonResponse(res, {
      error: { status: 403, name: 'ForbiddenError', message: 'Forbidden' },
    }, 403);
  }

  // API ルーティング
  if (url.startsWith('/api/listings')) {
    return handleListings(req, res, url);
  }
  if (url.startsWith('/api/categories')) {
    return handleCategories(req, res, url);
  }
  if (url.startsWith('/api/contents')) {
    return handleContents(req, res, url);
  }

  // その他
  jsonResponse(res, {
    error: { status: 404, name: 'NotFoundError', message: 'Not found' },
  }, 404);
});

server.listen(PORT, () => {
  console.log(`Mock Strapi server running on http://localhost:${PORT}`);
});
