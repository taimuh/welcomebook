/**
 * 物件トップページ (T032, T066, T067)
 * PropertyHeader + CategoryList + 検索機能
 */

import { notFound } from 'next/navigation';
import { getPropertyBySlug, getCategoriesByProperty } from '@/lib/strapi';
import PropertyPageClient from '@/components/PropertyPageClient';

export const revalidate = 30; // ISR: 30秒 (T036)

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound(); // T035: エラーハンドリング
  }

  const categories = await getCategoriesByProperty(slug);

  return <PropertyPageClient property={property} categories={categories} />;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'ページが見つかりません - WelcomeBook',
    };
  }

  return {
    title: `${property.name} - WelcomeBook`,
    description: property.description || `${property.name}のゲストマニュアル`,
  };
}
