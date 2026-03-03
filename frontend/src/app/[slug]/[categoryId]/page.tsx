/**
 * カテゴリページ (T033)
 * WbShell layout に内包される
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyBySlug, getContentsByCategory, getCategoriesByProperty } from '@/lib/strapi';
import ContentList from '@/components/ContentList';

export const revalidate = 30;

interface CategoryPageProps {
  params: Promise<{ slug: string; categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, categoryId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  const categories = await getCategoriesByProperty(property.documentId);
  const category = categories.find((c) => c.documentId === categoryId);
  if (!category) {
    notFound();
  }

  const contents = await getContentsByCategory(categoryId);

  return (
    <>
      {/* パンくずリスト */}
      <div className="wb-breadcrumb">
        <Link href={`/${slug}`} className="wb-bc-link">{property.name}</Link>
        <span className="wb-bc-sep">/</span>
        <span>{category.name}</span>
      </div>

      <div className="wb-content anim-fadeup">
        {/* カテゴリヘッダー */}
        <div className="cat-page-header">
          {category.icon && (
            <div className="cat-page-icon">{category.icon}</div>
          )}
          <div>
            <h1 className="cat-page-title">{category.name}</h1>
            {category.description && (
              <p className="cat-page-desc">{category.description}</p>
            )}
          </div>
        </div>

        {/* コンテンツ一覧 */}
        <ContentList contents={contents} propertySlug={slug} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug, categoryId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) return { title: 'ページが見つかりません - WelcomeBook' };

  const categories = await getCategoriesByProperty(property.documentId);
  const category = categories.find((c) => c.documentId === categoryId);
  if (!category) return { title: 'ページが見つかりません - WelcomeBook' };

  return {
    title: `${category.name} - ${property.name} - WelcomeBook`,
    description: category.description || `${property.name}の${category.name}`,
  };
}
