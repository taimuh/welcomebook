/**
 * PropertyHeader コンポーネントテスト (T038)
 */

import { render, screen } from '@testing-library/react';
import PropertyHeader from '../../../src/components/PropertyHeader';

const mockProperty = {
  id: 1,
  documentId: 'prop-1',
  name: 'テスト物件',
  slug: 'test-property',
  address: '東京都渋谷区1-2-3',
  description: 'テスト用の物件です',
  welcomeMessage: 'ようこそ！快適な滞在をお楽しみください。',
  emergencyContact: '090-1234-5678',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('PropertyHeader', () => {
  it('物件名を表示する', () => {
    render(<PropertyHeader property={mockProperty} />);

    expect(screen.getByRole('heading', { name: 'テスト物件' })).toBeInTheDocument();
  });

  it('ウェルカムメッセージを表示する', () => {
    render(<PropertyHeader property={mockProperty} />);

    expect(
      screen.getByText('ようこそ！快適な滞在をお楽しみください。')
    ).toBeInTheDocument();
  });

  it('緊急連絡先を表示する', () => {
    render(<PropertyHeader property={mockProperty} />);

    expect(screen.getByText('緊急連絡先')).toBeInTheDocument();
    expect(screen.getByText('090-1234-5678')).toBeInTheDocument();
  });

  it('緊急連絡先に電話リンクがある', () => {
    render(<PropertyHeader property={mockProperty} />);

    const phoneLink = screen.getByRole('link', { name: '090-1234-5678' });
    expect(phoneLink).toHaveAttribute('href', 'tel:09012345678');
  });

  it('住所を表示する', () => {
    render(<PropertyHeader property={mockProperty} />);

    expect(screen.getByText('東京都渋谷区1-2-3')).toBeInTheDocument();
  });

  it('オプションフィールドがない場合は表示しない', () => {
    const minimalProperty = {
      id: 1,
      documentId: 'prop-1',
      name: 'シンプル物件',
      slug: 'simple-property',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    render(<PropertyHeader property={minimalProperty} />);

    expect(screen.getByText('シンプル物件')).toBeInTheDocument();
    expect(screen.queryByText('緊急連絡先')).not.toBeInTheDocument();
  });
});
