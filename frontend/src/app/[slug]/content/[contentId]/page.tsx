/**
 * コンテンツ詳細ページ (T034)
 * ContentDetail
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyBySlug, getContentById } from '@/lib/strapi';
import ContentDetail from '@/components/ContentDetail';

export const revalidate = 30; // ISR: 30秒 (T036)

interface ContentPageProps {
  params: Promise<{ slug: string; contentId: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug, contentId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound(); // T035: エラーハンドリング
  }

  const content = await getContentById(contentId);
  if (!content || !content.published) {
    notFound(); // T035: エラーハンドリング
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 戻るリンク */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={content.category ? `/${slug}/${content.category.documentId}` : `/${slug}`}
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
            {content.category?.name || property.name}
          </Link>
        </div>
      </div>

      <ContentDetail content={content} />
    </main>
  );
}

export async function generateMetadata({ params }: ContentPageProps) {
  const { slug, contentId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: 'ページが見つかりません - WelcomeBook' };
  }

  const content = await getContentById(contentId);
  if (!content) {
    return { title: 'ページが見つかりません - WelcomeBook' };
  }

  return {
    title: `${content.title} - ${property.name} - WelcomeBook`,
    description: content.summary || content.title,
  };
}
