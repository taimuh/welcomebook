/**
 * PropertyHeader コンポーネント (T028)
 * 物件名・ウェルカムメッセージ・緊急連絡先・住所を表示
 */

import type { Property } from '@/lib/types';
import { renderMarkdown } from '@/lib/renderMarkdown';

interface PropertyHeaderProps {
  property: Property;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="home-header">
      <div className="home-eyebrow">ようこそ！</div>
      <div className="home-title-wrap">
        <h1 className="home-title">{property.name}</h1>
        <div className="gold-line" />
      </div>

      {property.welcomeMessage && (
        <div
          className="home-subtitle"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(property.welcomeMessage) }}
        />
      )}

      {property.address && (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wb-address"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {property.address}
        </a>
      )}

      {property.emergencyContact && (
        <div className="emergency-card">
          <div className="emergency-icon-wrap">🚨</div>
          <div>
            <div className="emergency-label">緊急連絡先</div>
            <a
              href={`tel:${property.emergencyContact.replace(/[-\s]/g, '')}`}
              className="emergency-phone"
            >
              {property.emergencyContact}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
