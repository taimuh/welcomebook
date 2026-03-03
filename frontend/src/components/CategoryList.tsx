/**
 * CategoryList コンポーネント (T029)
 * カテゴリをカードグリッドで表示
 */

import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryListProps {
  categories: Category[];
  propertySlug: string;
}

const CAT_COLOR_CLASSES = ['cat-c0', 'cat-c1', 'cat-c2', 'cat-c3', 'cat-c4'];

export default function CategoryList({ categories, propertySlug }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="cat-empty">
        カテゴリがありません
      </div>
    );
  }

  return (
    <div>
      <p className="cats-section-title">マニュアル一覧</p>
      <div className="cats-grid">
        {categories.map((category, index) => {
          const colorClass = CAT_COLOR_CLASSES[index % CAT_COLOR_CLASSES.length];
          return (
            <Link
              key={category.documentId}
              href={`/${propertySlug}/${category.documentId}`}
              className={`cat-card ${colorClass} anim-fadeup anim-delay-${Math.min(index + 1, 5)}`}
            >
              <div className="cat-icon-wrap">
                {category.icon || '📄'}
              </div>
              <div className="cat-name">{category.name}</div>
              {category.contentCount !== undefined && category.contentCount > 0 && (
                <div className="cat-count">{category.contentCount}件</div>
              )}
              {category.description && (
                <p className="cat-desc">{category.description}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
