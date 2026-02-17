/**
 * ContentList コンポーネント (T030)
 * コンテンツ一覧を表示（タイトル、サマリー100文字）
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
      <div className="text-center py-12">
        <p className="text-gray-500">コンテンツがありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ul className="space-y-3">
        {contents.map((content) => (
          <li key={content.documentId}>
            <Link
              href={`/${propertySlug}/content/${content.documentId}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">{content.title}</h3>
              {content.summary && (
                <p className="text-sm text-gray-500 line-clamp-2">{content.summary}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
