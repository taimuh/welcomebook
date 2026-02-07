/**
 * SearchResults コンポーネントテスト (T072)
 */

import { render, screen } from '@testing-library/react';
import SearchResults from '../../../src/components/SearchResults';

const mockResults = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: 'リモコンの電源ボタンを押してください。',
    summary: 'リモコンの電源ボタンを押してください。',
    order: 1,
    published: true,
    category: {
      id: 1,
      documentId: 'cat-1',
      name: '設備の使い方',
      icon: '🏠',
      order: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: 'エアコンのリモコン',
    body: 'リモコンは壁に掛かっています。',
    summary: 'リモコンは壁に掛かっています。',
    order: 2,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('SearchResults', () => {
  it('検索結果一覧を表示する', () => {
    render(
      <SearchResults
        results={mockResults}
        keyword="エアコン"
        propertySlug="test-property"
      />
    );

    // HighlightTextでテキストが分割されるため、リンクで確認
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/test-property/content/content-1');
    expect(links[1]).toHaveAttribute('href', '/test-property/content/content-2');
  });

  it('検索結果の件数を表示する', () => {
    render(
      <SearchResults
        results={mockResults}
        keyword="エアコン"
        propertySlug="test-property"
      />
    );

    expect(screen.getByText(/2件/)).toBeInTheDocument();
  });

  it('結果がない場合は「見つかりませんでした」メッセージを表示', () => {
    render(
      <SearchResults
        results={[]}
        keyword="存在しないキーワード"
        propertySlug="test-property"
      />
    );

    expect(
      screen.getByText(/「存在しないキーワード」に一致するコンテンツが見つかりませんでした/)
    ).toBeInTheDocument();
  });

  it('キーワードが空の場合は何も表示しない', () => {
    const { container } = render(
      <SearchResults
        results={[]}
        keyword=""
        propertySlug="test-property"
      />
    );

    expect(container.innerHTML).toBe('');
  });

  it('ローディング中はスピナーを表示する', () => {
    render(
      <SearchResults
        results={[]}
        keyword="テスト"
        propertySlug="test-property"
        isLoading={true}
      />
    );

    expect(screen.getByText('検索中...')).toBeInTheDocument();
  });

  it('カテゴリ情報を表示する', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        keyword="エアコン"
        propertySlug="test-property"
      />
    );

    expect(screen.getByText(/設備の使い方/)).toBeInTheDocument();
  });

  it('コンテンツ詳細へのリンクを含む', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        keyword="エアコン"
        propertySlug="test-property"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-property/content/content-1');
  });
});
