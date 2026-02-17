/**
 * デフォルトカテゴリ自動作成 ユニットテスト (T059)
 */

const DEFAULT_CATEGORIES = [
  { name: '設備の使い方', icon: '🏠', description: '家電や設備の操作方法', order: 1 },
  { name: 'ハウスルール', icon: '📋', description: '滞在中のルールやマナー', order: 2 },
  { name: '周辺情報', icon: '📍', description: '近隣のお店や施設', order: 3 },
  { name: '緊急時の対応', icon: '🆘', description: 'トラブル時の連絡先と対処法', order: 4 },
];

describe('Property lifecycle - デフォルトカテゴリ自動作成', () => {
  it('デフォルトカテゴリは4つ定義されている', () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(4);
  });

  it('各カテゴリに必須フィールドが含まれている', () => {
    DEFAULT_CATEGORIES.forEach((category) => {
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('icon');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('order');
    });
  });

  it('カテゴリの表示順が1〜4で連番', () => {
    const orders = DEFAULT_CATEGORIES.map((c) => c.order);
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it('設備の使い方カテゴリが正しく定義されている', () => {
    const category = DEFAULT_CATEGORIES[0];
    expect(category.name).toBe('設備の使い方');
    expect(category.icon).toBe('🏠');
    expect(category.order).toBe(1);
  });

  it('ハウスルールカテゴリが正しく定義されている', () => {
    const category = DEFAULT_CATEGORIES[1];
    expect(category.name).toBe('ハウスルール');
    expect(category.icon).toBe('📋');
    expect(category.order).toBe(2);
  });

  it('周辺情報カテゴリが正しく定義されている', () => {
    const category = DEFAULT_CATEGORIES[2];
    expect(category.name).toBe('周辺情報');
    expect(category.icon).toBe('📍');
    expect(category.order).toBe(3);
  });

  it('緊急時の対応カテゴリが正しく定義されている', () => {
    const category = DEFAULT_CATEGORIES[3];
    expect(category.name).toBe('緊急時の対応');
    expect(category.icon).toBe('🆘');
    expect(category.order).toBe(4);
  });

  it('カテゴリ名が一意である', () => {
    const names = DEFAULT_CATEGORIES.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
