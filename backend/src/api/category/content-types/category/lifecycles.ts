/**
 * Category lifecycle hooks (T076)
 * カテゴリ名の物件内一意制約
 */

import { errors } from '@strapi/utils';

export default {
  async beforeCreate(event: { params: { data: { name?: string; property?: string } } }) {
    await validateUniqueName(event.params.data);
  },

  async beforeUpdate(event: {
    params: {
      where: { documentId: string };
      data: { name?: string; property?: string };
    };
  }) {
    if (event.params.data.name) {
      await validateUniqueName(event.params.data, event.params.where.documentId);
    }
  },
};

async function validateUniqueName(
  data: { name?: string; property?: string },
  excludeDocumentId?: string
) {
  if (!data.name || !data.property) return;

  const existing = await strapi.documents('api::category.category').findMany({
    filters: {
      name: data.name,
      property: { documentId: data.property },
    } as any,
  });

  const duplicates = excludeDocumentId
    ? existing.filter((c: any) => c.documentId !== excludeDocumentId)
    : existing;

  if (duplicates.length > 0) {
    throw new errors.ApplicationError(
      `カテゴリ名「${data.name}」はこの物件内で既に使用されています。`
    );
  }
}
