/**
 * ImageGallery コンポーネントテスト (T086)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ImageGallery from '../../../src/components/ImageGallery';

const mockImages = [
  {
    id: 1,
    url: '/uploads/image1.jpg',
    alternativeText: 'エアコンのリモコン',
    width: 800,
    height: 600,
    formats: {
      thumbnail: { url: '/uploads/thumbnail_image1.jpg', width: 156, height: 117 },
    },
  },
  {
    id: 2,
    url: '/uploads/image2.jpg',
    alternativeText: 'エアコン本体',
    width: 800,
    height: 600,
    formats: {
      thumbnail: { url: '/uploads/thumbnail_image2.jpg', width: 156, height: 117 },
    },
  },
  {
    id: 3,
    url: 'https://external.example.com/image3.jpg',
    alternativeText: '外部画像',
    width: 800,
    height: 600,
  },
];

describe('ImageGallery', () => {
  it('画像がない場合は何も表示しない', () => {
    const { container } = render(<ImageGallery images={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('画像を表示する', () => {
    render(<ImageGallery images={[mockImages[0]]} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('複数画像の場合サムネイル一覧を表示する', () => {
    render(<ImageGallery images={mockImages} />);

    // サムネイルボタンが表示される
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('単一画像の場合サムネイル一覧を表示しない', () => {
    render(<ImageGallery images={[mockImages[0]]} />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('サムネイルクリックでメイン画像が切り替わる', () => {
    render(<ImageGallery images={mockImages} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // 2枚目のサムネイルをクリック

    // 2枚目の画像のaltテキストがメイン画像に表示される
    const images = screen.getAllByRole('img');
    const mainImage = images[0];
    expect(mainImage).toHaveAttribute('alt', 'エアコン本体');
  });

  it('alt属性が設定される', () => {
    render(<ImageGallery images={[mockImages[0]]} />);

    const image = screen.getByAltText('エアコンのリモコン');
    expect(image).toBeInTheDocument();
  });

  it('外部URLの画像を処理できる', () => {
    render(<ImageGallery images={[mockImages[2]]} />);

    const image = screen.getByAltText('外部画像');
    expect(image).toBeInTheDocument();
  });
});
