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
    <article>
      {/* マニュアルヘッダー */}
      <div className="manual-header">
        {content.category && (
          <div className="manual-cat-tag">
            {content.category.icon && <span>{content.category.icon}</span>}
            {content.category.name}
          </div>
        )}
        <h1 className="manual-title">{content.title}</h1>
      </div>

      {/* 画像ギャラリー */}
      {content.images && content.images.length > 0 && (
        <div className="manual-gallery">
          <ImageGallery images={content.images} />
        </div>
      )}

      {/* 本文 */}
      <div
        className="manual-body"
        dangerouslySetInnerHTML={{ __html: formatRichText(content.body) }}
      />
    </article>
  );
}

/**
 * Strapi のマークダウンを HTML に変換
 */
function formatRichText(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^(.+)$/, '<p>$1</p>');
}
