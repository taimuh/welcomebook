/**
 * isOwner ポリシー (T056)
 * オーナーは自分の物件のみ編集可能
 */

export default async (policyContext: {
  state: { user?: { id: number } };
  params: { id?: string };
  request: {
    url: any; body?: { data?: { venue?: any } }
};
}, config: unknown, { strapi }: { strapi: typeof global.strapi }) => {
  const { user } = policyContext.state;

  if (!user) {
    return false;
  }

  const { id } = policyContext.params;
  const { body } = policyContext.request;

  // 新規作成時: bodyのvenueを確認
  const venueRaw = body?.data?.venue;
  const venueId = typeof venueRaw === 'string'
    ? venueRaw
    : venueRaw?.connect?.[0]?.documentId ?? venueRaw?.connect?.[0] ?? null;

  if (!id && venueId) {
    const listing = await strapi.documents('api::listing.listing').findOne({
      documentId: venueId,
      populate: ['owner'],
    });

    if (!listing) {
      return false;
    }

    return (listing.owner as { id: number })?.id === user.id;
  }

  // 更新・削除時: 既存リソースの所有者を確認
  if (id) {
    // コンテキストから現在のエンティティタイプを判定
    const contentType = policyContext.request.url?.includes('/listings')
      ? 'api::listing.listing'
      : policyContext.request.url?.includes('/categories')
      ? 'api::category.category'
      : 'api::content.content';

    const entity = await strapi.documents(contentType).findOne({
      documentId: id,
      populate: contentType === 'api::listing.listing' ? ['owner'] : ['venue', 'venue.owner'] as any,
    });

    if (!entity) {
      return false;
    }

    // Listingの場合は直接ownerを確認
    if (contentType === 'api::listing.listing') {
      return (entity as any)?.id === user.id;
    }

    // Category/Contentの場合はpropertyのownerを確認
    return (entity as any)?.owner?.id === user.id;
  }

  return false;
};
