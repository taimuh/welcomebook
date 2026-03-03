/**
 * Strapi APIクライアント
 */

import type {
  Property,
  Category,
  Content,
  StrapiListResponse,
  StrapiError,
} from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export class StrapiApiError extends Error {
  status: number;
  name: string;

  constructor(error: StrapiError) {
    super(error.message);
    this.status = error.status;
    this.name = error.name;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new StrapiApiError(data.error || {
      status: response.status,
      name: 'FetchError',
      message: 'Failed to fetch data',
    });
  }

  return data;
}

/**
 * 物件をスラッグで取得
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const response = await fetchApi<StrapiListResponse<Property>>(
      `/listings?filters[slug][$eq]=${encodeURIComponent(slug)}`
    );
    return response.data[0] || null;
  } catch (error) {
    if (error instanceof StrapiApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * 物件のカテゴリ一覧を取得
 * カテゴリの venue フィールドが未設定の場合でも動作するよう、
 * venue が設定されているコンテンツ側からカテゴリを導出する
 */
export async function getCategoriesByProperty(
  propertyDocumentId: string
): Promise<Category[]> {
  const response = await fetchApi<StrapiListResponse<Content>>(
    `/contents?filters[venue][documentId][$eq]=${encodeURIComponent(propertyDocumentId)}&filters[published][$eq]=true&populate[0]=category&pagination[pageSize]=100`
  );

  // カテゴリごとのコンテンツ数を集計し、ユニークなカテゴリを導出
  const categoryMap = new Map<string, { category: Category; count: number }>();
  for (const content of response.data) {
    const cat = content.category;
    if (!cat) continue;
    const entry = categoryMap.get(cat.documentId);
    if (entry) {
      entry.count++;
    } else {
      categoryMap.set(cat.documentId, { category: cat, count: 1 });
    }
  }

  // order 順にソートして返す
  return Array.from(categoryMap.values())
    .sort((a, b) => (a.category.order ?? 0) - (b.category.order ?? 0))
    .map(({ category, count }) => ({ ...category, contentCount: count }));
}

/**
 * カテゴリのコンテンツ一覧を取得（公開のみ）
 */
export async function getContentsByCategory(
  categoryDocumentId: string
): Promise<Content[]> {
  const response = await fetchApi<StrapiListResponse<Content>>(
    `/contents?filters[category][documentId][$eq]=${encodeURIComponent(categoryDocumentId)}&filters[published][$eq]=true&sort=order:asc`
  );

  // サマリーを計算
  return response.data.map((content) => ({
    ...content,
    summary: extractSummary(content.body, 100),
  }));
}

/**
 * コンテンツ詳細を取得（物件スラッグで絞り込み）
 */
export async function getContentById(
  documentId: string
): Promise<Content | null> {
  try {
    const response = await fetchApi<StrapiListResponse<Content>>(
      `/contents?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[0]=images&populate[1]=category`
    );
    return response.data[0] || null;
  } catch (error) {
    if (error instanceof StrapiApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * コンテンツを検索（タイトルまたは本文）
 */
export async function searchContents(
  propertyDocumentId: string,
  keyword: string
): Promise<Content[]> {
  const encodedKeyword = encodeURIComponent(keyword);
  const encodedDocumentId = encodeURIComponent(propertyDocumentId);
  const response = await fetchApi<StrapiListResponse<Content>>(
    `/contents?filters[venue][documentId][$eq]=${encodedDocumentId}&filters[published][$eq]=true&filters[$or][0][title][$containsi]=${encodedKeyword}&filters[$or][1][body][$containsi]=${encodedKeyword}&sort=order:asc&populate[0]=category`
  );

  return response.data.map((content) => ({
    ...content,
    summary: extractSummary(content.body, 100),
  }));
}

/**
 * 本文からサマリーを抽出
 */
function extractSummary(body: string, maxLength: number): string {
  // HTMLタグとMarkdownを除去してプレーンテキストに
  const plainText = body
    .replace(/<[^>]*>/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength) + '...';
}
