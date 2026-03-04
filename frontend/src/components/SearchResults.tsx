/**
 * SearchResults コンポーネント (T065)
 * 検索結果リスト・ハイライト表示・「見つかりません」メッセージ
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
      <div className="search-loading">
        <div className="wb-spinner" />
        <p className="search-loading-text">検索中...</p>
      </div>
    );
  }

  if (!keyword) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="search-empty">
        <div className="search-empty-icon">🔍</div>
        <p className="search-empty-text">
          「{keyword}」に一致するコンテンツが見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="search-header">
        <h2 className="search-title">検索結果</h2>
        <p className="search-count">「{keyword}」の検索結果: {results.length}件</p>
      </div>

      {results.map((content) => (
        <Link
          key={content.documentId}
          href={`/${propertySlug}/content/${content.documentId}`}
          className="search-result-item"
        >
          <div className="search-result-title">
            <HighlightText text={content.title} keyword={keyword} />
          </div>
          {content.summary && (
            <p className="search-result-summary">
              <HighlightText text={content.summary} keyword={keyword} />
            </p>
          )}
          {content.category && (
            <div className="search-result-cat">
              {content.category.icon && <span>{content.category.icon}</span>}
              <span>{content.category.name}</span>
            </div>
          )}
        </Link>
      ))}
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
  if (!keyword) return <>{text}</>;

  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index}>{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
