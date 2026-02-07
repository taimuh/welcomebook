/**
 * PropertyPageClient コンポーネント (T066, T067)
 * 検索バーと検索結果表示のクライアントコンポーネント
 */

'use client';

import { useState, useCallback } from 'react';
import PropertyHeader from './PropertyHeader';
import CategoryList from './CategoryList';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchContents } from '@/lib/strapi';
import type { Property, Category, Content } from '@/lib/types';

interface PropertyPageClientProps {
  property: Property;
  categories: Category[];
}

export default function PropertyPageClient({
  property,
  categories,
}: PropertyPageClientProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    async (keyword: string) => {
      setSearchKeyword(keyword);

      if (!keyword) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchContents(property.slug, keyword);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [property.slug]
  );

  // 公開コンテンツがあるカテゴリのみ表示 (T048)
  const visibleCategories = categories.filter(
    (cat) => cat.contentCount !== undefined && cat.contentCount > 0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <PropertyHeader property={property} />

      {/* 検索バー */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />
      </div>

      {/* 検索結果または通常表示 */}
      {searchKeyword ? (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <SearchResults
            results={searchResults}
            keyword={searchKeyword}
            propertySlug={property.slug}
            isLoading={isSearching}
          />
        </div>
      ) : (
        <CategoryList categories={visibleCategories} propertySlug={property.slug} />
      )}
    </main>
  );
}
