/**
 * 404ページ コンポーネントテスト (T023)
 */

import { render, screen } from '@testing-library/react';
import NotFound from '../../../src/app/not-found';

describe('NotFoundページ', () => {
  it('404メッセージを表示する', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
  });

  it('トップページへのリンクがある', () => {
    render(<NotFound />);

    const link = screen.getByRole('link', { name: /トップページへ戻る/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('説明文を表示する', () => {
    render(<NotFound />);

    expect(
      screen.getByText(/お探しのページは存在しないか、移動された可能性があります/)
    ).toBeInTheDocument();
  });
});
