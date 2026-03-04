/**
 * コンテンツ詳細ページ (T034)
 * WbShell layout に内包される
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyBySlug, getContentById } from '@/lib/strapi';
import ContentDetail from '@/components/ContentDetail';

export const revalidate = 30;

interface ContentPageProps {
  params: Promise<{ slug: string; contentId: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug, contentId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  const content = await getContentById(contentId);
  if (!content || !content.published) {
    notFound();
  }

  return (
    <>
      {/* パンくずリスト */}
      <div className="wb-breadcrumb">
        <Link href={`/${slug}`} className="wb-bc-link">{property.name}</Link>
        {content.category && (
          <>
            <span className="wb-bc-sep">/</span>
            <Link href={`/${slug}/${content.category.documentId}`} className="wb-bc-link">
              {content.category.name}
            </Link>
          </>
        )}
        <span className="wb-bc-sep">/</span>
        <span>{content.title}</span>
      </div>

      <div className="wb-content anim-fadeup">
        {/* 戻るリンク（上部） */}
        {content.category && (
          <Link href={`/${slug}/${content.category.documentId}`} className="wb-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {content.category.name}の一覧
          </Link>
        )}

        <ContentDetail content={content} />

        {/* 戻るリンク（下部） */}
        {content.category && (
          <div className="wb-article-footer">
            <Link href={`/${slug}/${content.category.documentId}`} className="wb-btn-secondary">
              ← {content.category.name}の一覧に戻る
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export async function generateMetadata({ params }: ContentPageProps) {
  const { slug, contentId } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) return { title: 'ページが見つかりません - WelcomeBook' };

  const content = await getContentById(contentId);
  if (!content) return { title: 'ページが見つかりません - WelcomeBook' };

  return {
    title: `${content.title} - ${property.name} - WelcomeBook`,
    description: content.summary || content.title,
  };
}
