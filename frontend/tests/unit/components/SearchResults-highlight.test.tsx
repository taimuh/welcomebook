/**
 * ハイライト機能 ユニットテスト (T070)
 */

import { render, screen } from '@testing-library/react';
import { HighlightText } from '../../../src/components/SearchResults';

describe('HighlightText', () => {
  it('キーワードをハイライト表示する', () => {
    render(<HighlightText text="エアコンの使い方" keyword="エアコン" />);

    const highlight = screen.getByText('エアコン');
    expect(highlight.tagName).toBe('MARK');
    expect(highlight).toHaveClass('bg-yellow-200');
  });

  it('キーワードが含まれない場合はハイライトなし', () => {
    render(<HighlightText text="洗濯機の使い方" keyword="エアコン" />);

    expect(screen.getByText('洗濯機の使い方')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).toBeNull();
  });

  it('大文字小文字を区別しない', () => {
    render(<HighlightText text="WiFiの接続方法" keyword="wifi" />);

    const highlight = screen.getByText('WiFi');
    expect(highlight.tagName).toBe('MARK');
  });

  it('複数の一致箇所をすべてハイライトする', () => {
    render(
      <HighlightText text="エアコンの使い方とエアコンのリモコン" keyword="エアコン" />
    );

    const highlights = screen.getAllByText('エアコン');
    expect(highlights).toHaveLength(2);
    highlights.forEach((el) => {
      expect(el.tagName).toBe('MARK');
    });
  });

  it('キーワードが空の場合はテキストをそのまま表示', () => {
    render(<HighlightText text="テスト文" keyword="" />);

    expect(screen.getByText('テスト文')).toBeInTheDocument();
  });

  it('正規表現の特殊文字を安全に処理する', () => {
    render(<HighlightText text="料金は$100です" keyword="$100" />);

    const highlight = screen.getByText('$100');
    expect(highlight.tagName).toBe('MARK');
  });
});
