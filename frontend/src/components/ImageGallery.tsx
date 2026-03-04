/**
 * ImageGallery コンポーネント (T083)
 * レスポンシブ画像ギャラリー
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Image as ImageType } from '@/lib/types';

interface ImageGalleryProps {
  images: ImageType[];
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  const selectedImage = images[selectedIndex];
  const imageUrl = selectedImage.url.startsWith('http')
    ? selectedImage.url
    : `${STRAPI_URL}${selectedImage.url}`;

  return (
    <div className="gallery-root">
      {/* メイン画像 */}
      <div className="gallery-main">
        <Image
          src={imageUrl}
          alt={selectedImage.alternativeText || ''}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
      </div>

      {/* サムネイル（複数枚の場合） */}
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((image, index) => {
            const thumbUrl = image.formats?.thumbnail?.url
              ? image.formats.thumbnail.url.startsWith('http')
                ? image.formats.thumbnail.url
                : `${STRAPI_URL}${image.formats.thumbnail.url}`
              : image.url.startsWith('http')
              ? image.url
              : `${STRAPI_URL}${image.url}`;

            const isSelected = index === selectedIndex;
            return (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`gallery-thumb-btn${isSelected ? ' selected' : ''}`}
              >
                <Image
                  src={thumbUrl}
                  alt={image.alternativeText || `画像 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
