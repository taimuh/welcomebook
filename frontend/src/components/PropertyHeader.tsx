/**
 * PropertyHeader コンポーネント (T028)
 * 物件名、ウェルカムメッセージ、緊急連絡先を表示
 */

import type { Property } from '@/lib/types';

interface PropertyHeaderProps {
  property: Property;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>

        {property.welcomeMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r">
            <p className="text-blue-800 whitespace-pre-wrap">{property.welcomeMessage}</p>
          </div>
        )}

        {property.emergencyContact && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🆘</span>
              <div>
                <p className="text-sm font-medium text-red-800">緊急連絡先</p>
                <a
                  href={`tel:${property.emergencyContact.replace(/[-\s]/g, '')}`}
                  className="text-lg font-bold text-red-700 hover:underline"
                >
                  {property.emergencyContact}
                </a>
              </div>
            </div>
          </div>
        )}

        {property.address && (
          <p className="text-gray-500 text-sm mt-4">
            <span className="mr-1">📍</span>
            {property.address}
          </p>
        )}
      </div>
    </header>
  );
}
