/**
 * CategoryList コンポーネント (T029)
 * カテゴリ一覧を表示（アイコン、名前、コンテンツ数）
 */

import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryListProps {
  categories: Category[];
  propertySlug: string;
}

export default function CategoryList({ categories, propertySlug }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">カテゴリがありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ</h2>
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category.documentId}>
            <Link
              href={`/${propertySlug}/${category.documentId}`}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center">
                {category.icon && (
                  <span className="text-2xl mr-3">{category.icon}</span>
                )}
                <div>
                  <span className="font-medium text-gray-900">{category.name}</span>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {category.contentCount !== undefined && category.contentCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                    {category.contentCount}件
                  </span>
                )}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
