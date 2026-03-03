/**
 * 物件レイアウト — サイドバー付きシェル
 * 物件配下の全ページを WbShell でラップする
 */

import { notFound } from 'next/navigation';
import { getPropertyBySlug, getCategoriesByProperty } from '@/lib/strapi';
import WbShell from '@/components/WbShell';

interface PropertyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function PropertyLayout({
  children,
  params,
}: PropertyLayoutProps) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  const categories = await getCategoriesByProperty(property.documentId);

  return (
    <WbShell property={property} categories={categories}>
      {children}
    </WbShell>
  );
}
