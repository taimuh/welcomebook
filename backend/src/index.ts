import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * パーミッション自動設定 (T014, T015)
   * - Public: Property, Category, Content の find/findOne を公開
   * - Authenticated: CRUD パーミッション設定
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Public ロールのパーミッション設定
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const publicActions = [
        'api::listing.listing.find',
        'api::listing.listing.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
        'api::content.content.find',
        'api::content.content.findOne',
      ];

      for (const action of publicActions) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: publicRole.id } });
        }
      }
    }

    // Authenticated ロールのパーミッション設定
    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (authenticatedRole) {
      const authenticatedActions = [
        // Property CRUD
        'api::listing.listing.find',
        'api::listing.listing.findOne',
        'api::listing.listing.create',
        'api::listing.listing.update',
        'api::listing.listing.delete',
        // Category CRUD
        'api::category.category.find',
        'api::category.category.findOne',
        'api::category.category.create',
        'api::category.category.update',
        'api::category.category.delete',
        // Content CRUD
        'api::content.content.find',
        'api::content.content.findOne',
        'api::content.content.create',
        'api::content.content.update',
        'api::content.content.delete',
      ];

      for (const action of authenticatedActions) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: authenticatedRole.id } });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: authenticatedRole.id } });
        }
      }
    }
  },
};
