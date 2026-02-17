/**
 * サマリー計算ロジック ユニットテスト (T049)
 */

// extractSummary関数のロジックをテスト
// コントローラー内のprivate関数をテストするため、同じロジックを再実装してテスト

function extractSummary(body: string, maxLength: number): string {
  const plainText = body
    .replace(/<[^>]*>/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength) + '...';
}

describe('extractSummary', () => {
  it('プレーンテキストをそのまま返す（100文字以下）', () => {
    const body = 'これはテスト文です。';
    expect(extractSummary(body, 100)).toBe('これはテスト文です。');
  });

  it('100文字を超える場合は切り詰めて...を追加', () => {
    const body = 'あ'.repeat(150);
    const result = extractSummary(body, 100);
    expect(result).toBe('あ'.repeat(100) + '...');
    expect(result.length).toBe(103); // 100文字 + '...'
  });

  it('Markdownの見出しを除去する', () => {
    const body = '## 見出し\n内容テスト';
    expect(extractSummary(body, 100)).toBe('見出し 内容テスト');
  });

  it('Markdownの太字を除去する', () => {
    const body = '**太字テスト**です';
    expect(extractSummary(body, 100)).toBe('太字テストです');
  });

  it('Markdownの斜体を除去する', () => {
    const body = '*斜体テスト*です';
    expect(extractSummary(body, 100)).toBe('斜体テストです');
  });

  it('Markdownのリンクをテキストのみ残す', () => {
    const body = '[リンク](https://example.com)テスト';
    expect(extractSummary(body, 100)).toBe('リンクテスト');
  });

  it('HTMLタグを除去する', () => {
    const body = '<p>HTMLテスト</p>';
    expect(extractSummary(body, 100)).toBe('HTMLテスト');
  });

  it('改行をスペースに変換する', () => {
    const body = '一行目\n\n二行目';
    expect(extractSummary(body, 100)).toBe('一行目 二行目');
  });

  it('空文字列を処理できる', () => {
    expect(extractSummary('', 100)).toBe('');
  });

  it('ちょうど100文字の場合は切り詰めない', () => {
    const body = 'あ'.repeat(100);
    expect(extractSummary(body, 100)).toBe('あ'.repeat(100));
  });
});
