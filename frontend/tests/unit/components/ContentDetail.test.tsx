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

  it('テーブルを表示する', () => {
    const tableContent = {
      ...mockContent,
      body: '| 項目 | 内容 |\n|------|------|\n| 電話 | 090-xxxx |',
    };
    render(<ContentDetail content={tableContent} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('電話')).toBeInTheDocument();
  });

  it('ヘッダなし表を表示する', () => {
    const tableContent = {
      ...mockContent,
      body: '|------|------|\n| 電話 | 090-xxxx |',
    };
    render(<ContentDetail content={tableContent} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('電話')).toBeInTheDocument();
  });

  it('ハイライト記法を表示する', () => {
    const hlContent = { ...mockContent, body: '==重要なテキスト==' };
    const { container } = render(<ContentDetail content={hlContent} />);
    expect(container.querySelector('mark')).toBeInTheDocument();
    expect(screen.getByText('重要なテキスト')).toBeInTheDocument();
  });

  it('文字色記法を表示する', () => {
    const colorContent = { ...mockContent, body: '{red:警告テキスト}' };
    const { container } = render(<ContentDetail content={colorContent} />);
    expect(container.querySelector('.text-red')).toBeInTheDocument();
    expect(screen.getByText('警告テキスト')).toBeInTheDocument();
  });

  it('画像にwidth/heightを指定できる', () => {
    const imgContent = { ...mockContent, body: '![説明](https://example.com/img.jpg "600x400")' };
    const { container } = render(<ContentDetail content={imgContent} />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('width')).toBe('600');
    expect(img.getAttribute('height')).toBe('400');
  });

  it('画像にwidthのみ指定できる', () => {
    const imgContent = { ...mockContent, body: '![説明](https://example.com/img.jpg "600x")' };
    const { container } = render(<ContentDetail content={imgContent} />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('width')).toBe('600');
    expect(img.getAttribute('height')).toBeNull();
  });

  it('画像にheightのみ指定できる', () => {
    const imgContent = { ...mockContent, body: '![説明](https://example.com/img.jpg "x300")' };
    const { container } = render(<ContentDetail content={imgContent} />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('width')).toBeNull();
    expect(img.getAttribute('height')).toBe('300');
  });

  it('サイズ指定なしの画像はwidth/heightなし', () => {
    const imgContent = { ...mockContent, body: '![説明](https://example.com/img.jpg)' };
    const { container } = render(<ContentDetail content={imgContent} />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('width')).toBeNull();
    expect(img.getAttribute('height')).toBeNull();
  });

  it(':::image-row ブロックが img-row div に変換される', () => {
    const body = '::: image-row\n![A](https://example.com/a.jpg)\n![B](https://example.com/b.jpg)\n:::';
    const { container } = render(<ContentDetail content={{ ...mockContent, body }} />);
    const row = container.querySelector('.img-row');
    expect(row).toBeInTheDocument();
    const imgs = row!.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0].getAttribute('src')).toBe('https://example.com/a.jpg');
    expect(imgs[1].getAttribute('src')).toBe('https://example.com/b.jpg');
  });

  it(':::image-row ブロック内でサイズ指定が機能する', () => {
    const body = '::: image-row\n![A](https://example.com/a.jpg "300x200")\n![B](https://example.com/b.jpg "300x")\n:::';
    const { container } = render(<ContentDetail content={{ ...mockContent, body }} />);
    const imgs = container.querySelectorAll('.img-row img');
    expect(imgs[0].getAttribute('width')).toBe('300');
    expect(imgs[0].getAttribute('height')).toBe('200');
    expect(imgs[1].getAttribute('width')).toBe('300');
    expect(imgs[1].getAttribute('height')).toBeNull();
  });

  it(':::image-row ブロック外の画像は影響を受けない', () => {
    const body = '通常の画像:\n\n![通常](https://example.com/normal.jpg)\n\n::: image-row\n![A](https://example.com/a.jpg)\n:::';
    const { container } = render(<ContentDetail content={{ ...mockContent, body }} />);
    expect(container.querySelector('.img-row')).toBeInTheDocument();
    const allImgs = container.querySelectorAll('img');
    expect(allImgs).toHaveLength(2);
  });
});
