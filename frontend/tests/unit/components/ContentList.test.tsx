/**
 * ContentList コンポーネントテスト (T040)
 */

import { render, screen } from '@testing-library/react';
import ContentList from '../../../src/components/ContentList';

const mockContents = [
  {
    id: 1,
    documentId: 'content-1',
    title: 'エアコンの使い方',
    body: 'リモコンの電源ボタンを押してください。',
    summary: 'リモコンの電源ボタンを押して...',
    order: 1,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'content-2',
    title: '洗濯機の使い方',
    body: '洗剤を入れて、電源を入れます。',
    summary: '洗剤を入れて、電源を入れます...',
    order: 2,
    published: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('ContentList', () => {
  it('コンテンツ一覧を表示する', () => {
    render(<ContentList contents={mockContents} propertySlug="test-property" />);

    expect(screen.getByText('エアコンの使い方')).toBeInTheDocument();
    expect(screen.getByText('洗濯機の使い方')).toBeInTheDocument();
  });

  it('サマリーを表示する', () => {
    render(<ContentList contents={mockContents} propertySlug="test-property" />);

    expect(screen.getByText('リモコンの電源ボタンを押して...')).toBeInTheDocument();
  });

  it('コンテンツへのリンクが正しい', () => {
    render(<ContentList contents={mockContents} propertySlug="test-property" />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/test-property/content/content-1');
    expect(links[1]).toHaveAttribute('href', '/test-property/content/content-2');
  });

  it('空の場合はメッセージを表示する', () => {
    render(<ContentList contents={[]} propertySlug="test-property" />);

    expect(screen.getByText('コンテンツがありません')).toBeInTheDocument();
  });
});
