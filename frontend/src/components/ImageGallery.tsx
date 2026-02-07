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

  if (images.length === 0) {
    return null;
  }

  const selectedImage = images[selectedIndex];
  const imageUrl = selectedImage.url.startsWith('http')
    ? selectedImage.url
    : `${STRAPI_URL}${selectedImage.url}`;

  return (
    <div className="space-y-4">
      {/* メイン画像 */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={selectedImage.alternativeText || ''}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      {/* サムネイル一覧（複数画像がある場合） */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbUrl = image.formats?.thumbnail?.url
              ? image.formats.thumbnail.url.startsWith('http')
                ? image.formats.thumbnail.url
                : `${STRAPI_URL}${image.formats.thumbnail.url}`
              : image.url.startsWith('http')
              ? image.url
              : `${STRAPI_URL}${image.url}`;

            return (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                  index === selectedIndex
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={image.alternativeText || `画像 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
