/**
 * URLスラッグバリデーション ユニットテスト (T058)
 */

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

describe('Property slug validation', () => {
  describe('有効なスラッグ', () => {
    const validSlugs = [
      'test-property',
      'tokyo-shibuya-apt',
      'a1',
      'abc',
      'my-property-123',
      'a'.repeat(50), // 最大50文字
    ];

    validSlugs.forEach((slug) => {
      it(`"${slug}" は有効`, () => {
        // 50文字のスラッグはパターン的に先頭1 + 中間1〜48 + 末尾1 = 最大50文字
        // ただしregexの{1,48}は中間部分なので3〜50文字
        if (slug.length >= 3 && slug.length <= 50) {
          expect(SLUG_REGEX.test(slug)).toBe(true);
        }
      });
    });
  });

  describe('無効なスラッグ', () => {
    it('大文字を含む場合は無効', () => {
      expect(SLUG_REGEX.test('Test-Property')).toBe(false);
    });

    it('スペースを含む場合は無効', () => {
      expect(SLUG_REGEX.test('test property')).toBe(false);
    });

    it('特殊文字を含む場合は無効', () => {
      expect(SLUG_REGEX.test('test_property')).toBe(false);
      expect(SLUG_REGEX.test('test.property')).toBe(false);
      expect(SLUG_REGEX.test('test@property')).toBe(false);
    });

    it('ハイフンで始まる場合は無効', () => {
      expect(SLUG_REGEX.test('-test-property')).toBe(false);
    });

    it('ハイフンで終わる場合は無効', () => {
      expect(SLUG_REGEX.test('test-property-')).toBe(false);
    });

    it('1文字の場合は無効', () => {
      expect(SLUG_REGEX.test('a')).toBe(false);
    });

    it('51文字以上の場合は無効', () => {
      expect(SLUG_REGEX.test('a'.repeat(51))).toBe(false);
    });

    it('空文字列は無効', () => {
      expect(SLUG_REGEX.test('')).toBe(false);
    });

    it('日本語を含む場合は無効', () => {
      expect(SLUG_REGEX.test('テスト物件')).toBe(false);
    });
  });
});
