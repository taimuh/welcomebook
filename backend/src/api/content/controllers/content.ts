/**
 * content controller (T046)
 * サマリー計算フィールドの追加
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::content.content', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    // サマリーを計算して追加
    const dataWithSummary = (data as any[]).map((item: any) => ({
      ...item,
      summary: extractSummary(item.body || '', 100),
    }));

    return { data: dataWithSummary, meta };
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);

    if (response?.data) {
      (response.data as any).summary = extractSummary(
        (response.data as any).body || '',
        100
      );
    }

    return response;
  },
}));

/**
 * 本文からサマリーを抽出（先頭100文字）
 */
function extractSummary(body: string, maxLength: number): string {
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
