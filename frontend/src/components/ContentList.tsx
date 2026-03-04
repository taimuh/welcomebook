/**
 * ContentList コンポーネント (T030)
 * コンテンツ一覧を表示（タイトル、サマリー）
 */

import Link from 'next/link';
import type { Content } from '@/lib/types';

interface ContentListProps {
  contents: Content[];
  propertySlug: string;
}

export default function ContentList({ contents, propertySlug }: ContentListProps) {
  if (contents.length === 0) {
    return (
      <div className="content-list-empty">
        コンテンツがありません
      </div>
    );
  }

  return (
    <ul className="content-list">
      {contents.map((content) => (
        <li key={content.documentId}>
          <Link
            href={`/${propertySlug}/content/${content.documentId}`}
            className="content-list-item"
          >
            <div className="content-list-body">
              <div className="content-list-title">{content.title}</div>
              {content.summary && (
                <p className="content-list-summary">{content.summary}</p>
              )}
            </div>
            <svg
              className="content-list-arrow"
              width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
