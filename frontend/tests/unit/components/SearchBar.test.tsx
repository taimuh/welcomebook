/**
 * SearchBar コンポーネントテスト (T071)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('検索入力フィールドを表示する', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('キーワードで検索...')).toBeInTheDocument();
  });

  it('検索ボタンを表示する', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('キーワード入力後に検索を実行する', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('キーワードで検索...');
    fireEvent.change(input, { target: { value: 'エアコン' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith('エアコン');
  });

  it('空のキーワードでは検索を実行しない', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('キーワードで検索...');
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('空白のみのキーワードでは検索を実行しない', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('キーワードで検索...');
    fireEvent.change(input, { target: { value: '   ' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('クリアボタンでキーワードをクリアし空文字で検索を呼ぶ', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('キーワードで検索...');
    fireEvent.change(input, { target: { value: 'テスト' } });

    // クリアボタン（×ボタン）をクリック
    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find(
      (btn) => btn.getAttribute('type') === 'button'
    );
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(mockOnSearch).toHaveBeenCalledWith('');
    }
  });

  it('ローディング中は入力を無効にする', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText('キーワードで検索...');
    expect(input).toBeDisabled();
  });

  it('キーワード入力前は検索ボタンが無効', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const submitButton = screen.getByRole('button', { name: '検索' });
    expect(submitButton).toBeDisabled();
  });
});
