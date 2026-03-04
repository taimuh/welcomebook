/**
 * ContentDetail コンポーネント (T031)
 * コンテンツ詳細を表示（タイトル、本文、画像ギャラリー）
 */

import type { Content } from '@/lib/types';
import ImageGallery from './ImageGallery';
import { renderMarkdown } from '@/lib/renderMarkdown';

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
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content.body) }}
      />
    </article>
  );
}
