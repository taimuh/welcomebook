/**
 * listing controller
 * - create時にowner（認証ユーザー）を自動設定
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::listing.listing', ({ strapi }) => ({
  async create(ctx) {
    // 認証ユーザーがいればownerとして自動設定
    if (ctx.state?.user?.documentId) {
      ctx.request.body = ctx.request.body || {};
      const body = ctx.request.body as { data?: Record<string, unknown> };
      body.data = body.data || {};
      body.data.owner = ctx.state.user.documentId;
    }

    return await super.create(ctx);
  },
}));
