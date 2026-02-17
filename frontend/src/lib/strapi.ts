/**
 * Strapi APIクライアント
 */

import type {
  Property,
  Category,
  Content,
  StrapiResponse,
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
 */
export async function getCategoriesByProperty(
  propertySlug: string
): Promise<Category[]> {
  const response = await fetchApi<StrapiListResponse<Category>>(
    `/categories?filters[property][slug][$eq]=${encodeURIComponent(
      propertySlug
    )}&sort=order:asc&populate[contents][filters][published][$eq]=true&populate[contents][fields][0]=id`
  );

  // 公開コンテンツ数を計算
  return response.data.map((category) => ({
    ...category,
    contentCount: (category as Category & { contents?: { id: number }[] }).contents?.length || 0,
  }));
}

/**
 * カテゴリのコンテンツ一覧を取得（公開のみ）
 */
export async function getContentsByCategory(
  categoryDocumentId: string
): Promise<Content[]> {
  const response = await fetchApi<StrapiListResponse<Content>>(
    `/contents?filters[category][documentId][$eq]=${encodeURIComponent(
      categoryDocumentId
    )}&filters[published][$eq]=true&sort=order:asc`
  );

  // サマリーを計算
  return response.data.map((content) => ({
    ...content,
    summary: extractSummary(content.body, 100),
  }));
}

/**
 * コンテンツ詳細を取得
 */
export async function getContentById(
  documentId: string
): Promise<Content | null> {
  try {
    const response = await fetchApi<StrapiResponse<Content>>(
      `/contents/${encodeURIComponent(documentId)}?populate=images,category`
    );
    return response.data;
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
  propertySlug: string,
  keyword: string
): Promise<Content[]> {
  const encodedKeyword = encodeURIComponent(keyword);
  const response = await fetchApi<StrapiListResponse<Content>>(
    `/contents?filters[property][slug][$eq]=${encodeURIComponent(
      propertySlug
    )}&filters[published][$eq]=true&filters[$or][0][title][$containsi]=${encodedKeyword}&filters[$or][1][body][$containsi]=${encodedKeyword}&sort=order:asc`
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
