/**
 * Listing lifecycle hooks
 * - beforeCreate/beforeUpdate: スラッグ形式のバリデーション
 * - afterCreate: デフォルトカテゴリを4つ自動作成
 */

import { errors } from '@strapi/utils';

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

const DEFAULT_CATEGORIES = [
  { name: '設備の使い方', icon: '🏠', description: '家電や設備の操作方法', order: 1 },
  { name: 'ハウスルール', icon: '📋', description: '滞在中のルールやマナー', order: 2 },
  { name: '周辺情報', icon: '📍', description: '近隣のお店や施設', order: 3 },
  { name: '緊急時の対応', icon: '🆘', description: 'トラブル時の連絡先と対処法', order: 4 },
];

function validateSlug(data: { slug?: string }) {
  if (data.slug && !SLUG_REGEX.test(data.slug)) {
    throw new errors.ApplicationError(
      'スラッグは小文字英数字とハイフンのみ使用可能です（3〜50文字、先頭と末尾は英数字）。'
    );
  }
}

export default {
  beforeCreate(event: { params: { data: { slug?: string } } }) {
    validateSlug(event.params.data);
  },

  beforeUpdate(event: { params: { data: { slug?: string } } }) {
    if (event.params.data.slug) {
      validateSlug(event.params.data);
    }
  },

  async afterCreate(event: { result: { id: number; documentId: string } }) {
    const { result } = event;

    // デフォルトカテゴリを作成
    for (const category of DEFAULT_CATEGORIES) {
      await strapi.documents('api::category.category').create({
        data: {
          ...category,
          venue: { connect: [result.documentId] },
        } as any,
      });
    }
  },
};
