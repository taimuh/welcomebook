/**
 * ContentDetail コンポーネント (T031)
 * コンテンツ詳細を表示（タイトル、本文、画像ギャラリー）
 */

import type { Content } from '@/lib/types';
import ImageGallery from './ImageGallery';

interface ContentDetailProps {
  content: Content;
}

export default function ContentDetail({ content }: ContentDetailProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h1>

      {content.images && content.images.length > 0 && (
        <div className="mb-6">
          <ImageGallery images={content.images} />
        </div>
      )}

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: formatRichText(content.body) }}
      />
    </article>
  );
}

/**
 * リッチテキストをHTMLに変換
 * Strapiのマークダウンを基本的なHTMLに変換
 */
function formatRichText(text: string): string {
  return text
    // 見出し
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // 太字・斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // リンク
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // リスト
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc list-inside my-2">$&</ul>')
    // 段落
    .replace(/\n\n/g, '</p><p class="my-4">')
    .replace(/\n/g, '<br />');
}
