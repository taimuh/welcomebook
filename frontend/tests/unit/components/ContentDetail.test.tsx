/**
 * ContentDetail コンポーネントテスト (T041)
 */

import { render, screen } from '@testing-library/react';
import ContentDetail from '../../../src/components/ContentDetail';

const mockContent = {
  id: 1,
  documentId: 'content-1',
  title: 'エアコンの使い方',
  body: '## 基本操作\n\nリモコンの電源ボタンを押してください。\n\n- 冷房: 青いボタン\n- 暖房: 赤いボタン',
  order: 1,
  published: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockContentWithImages = {
  ...mockContent,
  images: [
    {
      id: 1,
      url: '/uploads/image1.jpg',
      alternativeText: 'エアコンのリモコン',
      width: 800,
      height: 600,
    },
    {
      id: 2,
      url: '/uploads/image2.jpg',
      alternativeText: 'エアコン本体',
      width: 800,
      height: 600,
    },
  ],
};

describe('ContentDetail', () => {
  it('タイトルを表示する', () => {
    render(<ContentDetail content={mockContent} />);

    expect(screen.getByRole('heading', { name: 'エアコンの使い方' })).toBeInTheDocument();
  });

  it('本文を表示する', () => {
    render(<ContentDetail content={mockContent} />);

    expect(screen.getByText(/リモコンの電源ボタンを押してください/)).toBeInTheDocument();
  });

  it('画像がある場合はImageGalleryを表示する', () => {
    render(<ContentDetail content={mockContentWithImages} />);

    // ImageGalleryが画像をレンダリングしていることを確認
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('画像がない場合はImageGalleryを表示しない', () => {
    render(<ContentDetail content={mockContent} />);

    // 画像がないことを確認
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });
});
