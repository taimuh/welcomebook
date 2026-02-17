/**
 * category controller (T075)
 * カテゴリ削除時のコンテンツ紐付きチェック
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  async delete(ctx) {
    const { id } = ctx.params;

    // カテゴリに紐付くコンテンツを確認
    const contents = await strapi.documents('api::content.content').findMany({
      filters: { category: { documentId: id } } as any,
    });

    if (contents && contents.length > 0) {
      return ctx.badRequest(
        `このカテゴリには${contents.length}件のコンテンツが紐付いています。先にコンテンツを移動または削除してください。`
      );
    }

    return await super.delete(ctx);
  },
}));
