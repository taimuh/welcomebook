/**
 * カテゴリページ (T033)
 * ContentList
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyBySlug, getContentsByCategory, getCategoriesByProperty } from '@/lib/strapi';
import ContentList from '@/components/ContentList';

export const revalidate = 30; // ISR: 30秒 (T036)

interface CategoryPageProps {
  params: Promise<{ slug: string; categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, categoryId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound(); // T035: エラーハンドリング
  }

  // カテゴリ情報を取得
  const categories = await getCategoriesByProperty(slug);
  const category = categories.find((c) => c.documentId === categoryId);

  if (!category) {
    notFound(); // T035: エラーハンドリング
  }

  const contents = await getContentsByCategory(categoryId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 戻るリンク */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {property.name}
          </Link>
        </div>
      </div>

      {/* カテゴリヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            {category.icon && <span className="text-3xl mr-3">{category.icon}</span>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              {category.description && (
                <p className="text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContentList contents={contents} propertySlug={slug} />
    </main>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug, categoryId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: 'ページが見つかりません - WelcomeBook' };
  }

  const categories = await getCategoriesByProperty(slug);
  const category = categories.find((c) => c.documentId === categoryId);

  if (!category) {
    return { title: 'ページが見つかりません - WelcomeBook' };
  }

  return {
    title: `${category.name} - ${property.name} - WelcomeBook`,
    description: category.description || `${property.name}の${category.name}`,
  };
}
