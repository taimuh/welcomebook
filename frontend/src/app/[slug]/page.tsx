/**
 * 物件ホームページ (T032)
 * WbShell layout に内包される — ナビ・サイドバーは layout.tsx が担う
 */

import { notFound } from 'next/navigation';
import { getPropertyBySlug, getCategoriesByProperty } from '@/lib/strapi';
import PropertyHeader from '@/components/PropertyHeader';
import CategoryList from '@/components/CategoryList';

export const revalidate = 30;

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  const categories = await getCategoriesByProperty(property.documentId);
  const visibleCategories = categories.filter(
    (cat) => cat.contentCount !== undefined && cat.contentCount > 0
  );

  return (
    <div className="wb-content anim-fadeup">
      <PropertyHeader property={property} />
      <CategoryList categories={visibleCategories} propertySlug={slug} />
    </div>
  );
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: 'ページが見つかりません - WelcomeBook' };
  }

  return {
    title: `${property.name} - WelcomeBook`,
    description: property.description || `${property.name}のゲストマニュアル`,
  };
}
