/**
 * CategoryList コンポーネントテスト (T039)
 */

import { render, screen } from '@testing-library/react';
import CategoryList from '../../../src/components/CategoryList';

const mockCategories = [
  {
    id: 1,
    documentId: 'cat-1',
    name: '設備の使い方',
    description: '家電や設備の操作方法',
    icon: '🏠',
    order: 1,
    contentCount: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'cat-2',
    name: 'ハウスルール',
    description: '滞在中のルールやマナー',
    icon: '📋',
    order: 2,
    contentCount: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('CategoryList', () => {
  it('カテゴリ一覧を表示する', () => {
    render(<CategoryList categories={mockCategories} propertySlug="test-property" />);

    expect(screen.getByText('設備の使い方')).toBeInTheDocument();
    expect(screen.getByText('ハウスルール')).toBeInTheDocument();
  });

  it('カテゴリのアイコンを表示する', () => {
    render(<CategoryList categories={mockCategories} propertySlug="test-property" />);

    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('📋')).toBeInTheDocument();
  });

  it('コンテンツ数を表示する', () => {
    render(<CategoryList categories={mockCategories} propertySlug="test-property" />);

    expect(screen.getByText('3件')).toBeInTheDocument();
    expect(screen.getByText('2件')).toBeInTheDocument();
  });

  it('カテゴリへのリンクが正しい', () => {
    render(<CategoryList categories={mockCategories} propertySlug="test-property" />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/test-property/cat-1');
    expect(links[1]).toHaveAttribute('href', '/test-property/cat-2');
  });

  it('空の場合はメッセージを表示する', () => {
    render(<CategoryList categories={[]} propertySlug="test-property" />);

    expect(screen.getByText('カテゴリがありません')).toBeInTheDocument();
  });

  it('説明文を表示する', () => {
    render(<CategoryList categories={mockCategories} propertySlug="test-property" />);

    expect(screen.getByText('家電や設備の操作方法')).toBeInTheDocument();
    expect(screen.getByText('滞在中のルールやマナー')).toBeInTheDocument();
  });
});
