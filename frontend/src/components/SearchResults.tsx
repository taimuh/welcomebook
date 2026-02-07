/**
 * SearchResults コンポーネント (T065)
 * 結果リスト、ハイライト表示、「見つかりません」メッセージ
 */

import Link from 'next/link';
import type { Content } from '@/lib/types';

interface SearchResultsProps {
  results: Content[];
  keyword: string;
  propertySlug: string;
  isLoading?: boolean;
}

export default function SearchResults({
  results,
  keyword,
  propertySlug,
  isLoading = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-gray-500">検索中...</p>
      </div>
    );
  }

  if (!keyword) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto w-12 h-12 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500">
          「{keyword}」に一致するコンテンツが見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        「{keyword}」の検索結果: {results.length}件
      </p>
      <ul className="space-y-3">
        {results.map((content) => (
          <li key={content.documentId}>
            <Link
              href={`/${propertySlug}/content/${content.documentId}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">
                <HighlightText text={content.title} keyword={keyword} />
              </h3>
              {content.summary && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  <HighlightText text={content.summary} keyword={keyword} />
                </p>
              )}
              {content.category && (
                <span className="inline-block mt-2 text-xs text-gray-400">
                  {content.category.icon} {content.category.name}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * キーワードハイライトコンポーネント (T068)
 */
interface HighlightTextProps {
  text: string;
  keyword: string;
}

export function HighlightText({ text, keyword }: HighlightTextProps) {
  if (!keyword) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
