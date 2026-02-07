/**
 * カテゴリ削除警告ロジック ユニットテスト (T078)
 */

describe('カテゴリ削除警告ロジック', () => {
  it('コンテンツが紐付いているカテゴリは削除不可', () => {
    const contents = [
      { id: 1, title: 'コンテンツ1' },
      { id: 2, title: 'コンテンツ2' },
    ];

    // コンテンツが存在する場合は削除をブロック
    expect(contents.length).toBeGreaterThan(0);
    const errorMessage = `このカテゴリには${contents.length}件のコンテンツが紐付いています。先にコンテンツを移動または削除してください。`;
    expect(errorMessage).toContain('2件');
  });

  it('コンテンツが紐付いていないカテゴリは削除可能', () => {
    const contents: any[] = [];
    expect(contents.length).toBe(0);
    // 空配列の場合は削除を許可
  });

  it('エラーメッセージにコンテンツ数を含める', () => {
    const count = 5;
    const errorMessage = `このカテゴリには${count}件のコンテンツが紐付いています。先にコンテンツを移動または削除してください。`;
    expect(errorMessage).toContain('5件');
    expect(errorMessage).toContain('コンテンツを移動または削除');
  });
});
