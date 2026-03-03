/**
 * WbShell — クライアントサイドシェル
 * トップナビ + サイドバー + メインコンテンツ + モバイルタブバー
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { searchContents } from '@/lib/strapi';
import SearchResults from './SearchResults';
import type { Property, Category, Content } from '@/lib/types';

interface WbShellProps {
  property: Property;
  categories: Category[];
  children: React.ReactNode;
}

const CAT_COLOR_CLASSES = ['cat-c0', 'cat-c1', 'cat-c2', 'cat-c3', 'cat-c4'];

export default function WbShell({ property, categories, children }: WbShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Content[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // ページ遷移時に検索・サイドバーをリセット
  useEffect(() => {
    setSearchKeyword('');
    setSearchResults(null);
    setSidebarOpen(false);
  }, [pathname]);

  const handleSearchInput = useCallback(
    async (keyword: string) => {
      setSearchKeyword(keyword);
      if (!keyword.trim()) {
        setSearchResults(null);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchContents(property.documentId, keyword);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [property.slug]
  );

  const clearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchResults(null);
  }, []);

  const openSidebarAndFocusSearch = useCallback(() => {
    setSidebarOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  // 現在のアクティブカテゴリを URL から判定
  const pathParts = pathname.split('/').filter(Boolean);
  const isHome = pathParts.length === 1; // /[slug] のみ
  const isContentPage = pathParts.length === 3 && pathParts[1] === 'content';
  const currentCategoryId =
    pathParts.length === 2 && pathParts[1] !== 'content' ? pathParts[1] : null;

  // カテゴリページを訪問したら記憶し、コンテンツ詳細でもアクティブ状態を維持する
  useEffect(() => {
    if (currentCategoryId) {
      setLastCategoryId(currentCategoryId);
    }
  }, [currentCategoryId]);

  // ESCキー: サイドバーを閉じる / 検索をクリア
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (sidebarOpen) setSidebarOpen(false);
      else if (searchKeyword) clearSearch();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, searchKeyword, clearSearch]);

  const activeCategoryId = currentCategoryId ?? (isContentPage ? lastCategoryId : null);

  const visibleCategories = categories.filter(
    (cat) => cat.contentCount !== undefined && cat.contentCount > 0
  );

  return (
    <>
      {/* モバイルサイドバーオーバーレイ */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* トップナビゲーション */}
      <header className="wb-nav">
        <div className="wb-nav-left">
          <button
            className="wb-nav-btn menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-expanded={sidebarOpen}
            aria-controls="wb-sidebar"
            aria-label={sidebarOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link href={`/${property.slug}`} className="wb-nav-brand">
            <div className="wb-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="wb-nav-name">Welcome<span style={{ color: 'rgb(181, 129, 58)' }}>Book</span></span>
          </Link>
        </div>

        <div className="wb-nav-actions">
          <button
            className="wb-nav-btn"
            onClick={openSidebarAndFocusSearch}
            aria-label="検索"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </header>

      {/* レイアウト */}
      <div className="wb-layout">
        {/* サイドバー */}
        <aside id="wb-sidebar" aria-label="ナビゲーション" className={`wb-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* 物件情報 */}
          <div className="sidebar-property">
            <div className="sidebar-property-name">{property.name}</div>
            {property.address && (
              <div className="sidebar-property-badge">
                <span className="badge-dot" />
                {property.address}
              </div>
            )}
          </div>

          {/* 検索 */}
          <div className="sidebar-search">
            <div className="wb-search" role="search">
              <div className="wb-search-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchKeyword}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="検索..."
                aria-label="マニュアルを検索"
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="wb-search-clear"
                  onClick={clearSearch}
                  aria-label="検索をクリア"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="sidebar-nav">
            {/* ホームリンク */}
            <Link
              href={`/${property.slug}`}
              className={`sidebar-cat-btn sidebar-home-btn ${isHome && !searchResults ? 'active' : ''}`}
            >
              <div className="sidebar-cat-icon">🏠</div>
              <span className="sidebar-cat-name">ホーム</span>
            </Link>

            {/* カテゴリ一覧 */}
            {visibleCategories.map((category, index) => {
              const colorClass = CAT_COLOR_CLASSES[index % CAT_COLOR_CLASSES.length];
              const isActive = activeCategoryId === category.documentId;
              return (
                <div key={category.documentId} className="sidebar-cat-group">
                  <Link
                    href={`/${property.slug}/${category.documentId}`}
                    className={`sidebar-cat-btn ${colorClass} ${isActive ? 'active' : ''}`}
                  >
                    <div className="sidebar-cat-icon">
                      {category.icon || '📄'}
                    </div>
                    <span className="sidebar-cat-name">{category.name}</span>
                    {category.contentCount !== undefined && category.contentCount > 0 && (
                      <span className="sidebar-cat-count">{category.contentCount}</span>
                    )}
                    <svg
                      className="sidebar-cat-chevron"
                      width="14" height="14"
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
                </div>
              );
            })}
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="wb-main">
          {searchResults !== null || isSearching ? (
            <div className="wb-content anim-fadeup">
              <SearchResults
                results={searchResults ?? []}
                keyword={searchKeyword}
                propertySlug={property.slug}
                isLoading={isSearching}
              />
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* モバイルボトムタブバー */}
      <nav className="wb-tabbar">
        <Link
          href={`/${property.slug}`}
          className={`wb-tab ${isHome ? 'active' : ''}`}
        >
          <span className="wb-tab-icon">🏠</span>
          <span>ホーム</span>
        </Link>
        <button className="wb-tab" onClick={openSidebarAndFocusSearch}>
          <span className="wb-tab-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <span>検索</span>
        </button>
        <button
          className={`wb-tab ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'メニューを閉じる' : 'カテゴリ一覧を開く'}
        >
          <span className="wb-tab-icon">
            {sidebarOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </span>
          <span>{sidebarOpen ? '閉じる' : 'カテゴリ'}</span>
        </button>
      </nav>
    </>
  );
}
