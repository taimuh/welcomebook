/**
 * SearchBar コンポーネント (T064)
 * 検索入力フィールドと検索ボタン
 */

'use client';

import { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = keyword.trim();
      if (trimmed) {
        onSearch(trimmed);
      }
    },
    [keyword, onSearch]
  );

  const handleClear = useCallback(() => {
    setKeyword('');
    onSearch('');
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="searchbar-row">
        <div className="searchbar-input-wrap">
          <div className="wb-search">
            <div className="wb-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="キーワードで検索..."
              disabled={isLoading}
            />
            {keyword && (
              <button
                type="button"
                onClick={handleClear}
                className="wb-search-clear"
                aria-label="クリア"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="wb-btn-primary searchbar-submit"
        >
          {isLoading ? (
            <span className="wb-spinner searchbar-spinner" />
          ) : (
            '検索'
          )}
        </button>
      </div>
    </form>
  );
}
