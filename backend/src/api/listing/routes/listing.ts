/**
 * listing router
 * isOwnerポリシーをCRUDルートに適用
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::listing.listing', {
  config: {
    find: {},
    findOne: {},
    create: {
      policies: ['global::is-owner'],
    },
    update: {
      policies: ['global::is-owner'],
    },
    delete: {
      policies: ['global::is-owner'],
    },
  },
});
