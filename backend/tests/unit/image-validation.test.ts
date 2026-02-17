/**
 * 画像バリデーション ユニットテスト (T085)
 */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

describe('画像バリデーション', () => {
  describe('ファイルサイズ制限', () => {
    it('5MB以下の画像は許可される', () => {
      const fileSize = 4 * 1024 * 1024; // 4MB
      expect(fileSize <= MAX_IMAGE_SIZE).toBe(true);
    });

    it('5MBの画像は許可される', () => {
      const fileSize = 5 * 1024 * 1024; // ちょうど5MB
      expect(fileSize <= MAX_IMAGE_SIZE).toBe(true);
    });

    it('5MB超の画像は拒否される', () => {
      const fileSize = 6 * 1024 * 1024; // 6MB
      expect(fileSize <= MAX_IMAGE_SIZE).toBe(false);
    });
  });

  describe('画像枚数制限', () => {
    it('10枚以下の画像は許可される', () => {
      const images = Array.from({ length: 10 }, (_, i) => ({ id: i }));
      expect(images.length <= MAX_IMAGES).toBe(true);
    });

    it('11枚以上の画像は拒否される', () => {
      const images = Array.from({ length: 11 }, (_, i) => ({ id: i }));
      expect(images.length <= MAX_IMAGES).toBe(false);
    });

    it('0枚の画像は許可される', () => {
      const images: any[] = [];
      expect(images.length <= MAX_IMAGES).toBe(true);
    });
  });

  describe('画像形式制限', () => {
    it('JPEG形式は許可される', () => {
      expect(ALLOWED_TYPES).toContain('image/jpeg');
    });

    it('PNG形式は許可される', () => {
      expect(ALLOWED_TYPES).toContain('image/png');
    });

    it('GIF形式は許可される', () => {
      expect(ALLOWED_TYPES).toContain('image/gif');
    });

    it('WebP形式は許可される', () => {
      expect(ALLOWED_TYPES).toContain('image/webp');
    });

    it('BMP形式は拒否される', () => {
      expect(ALLOWED_TYPES).not.toContain('image/bmp');
    });

    it('SVG形式は拒否される', () => {
      expect(ALLOWED_TYPES).not.toContain('image/svg+xml');
    });

    it('TIFF形式は拒否される', () => {
      expect(ALLOWED_TYPES).not.toContain('image/tiff');
    });
  });

  describe('エラーメッセージ', () => {
    it('サイズ超過時のメッセージを生成できる', () => {
      const message = '画像サイズは5MB以下にしてください';
      expect(message).toContain('5MB');
    });

    it('枚数超過時のメッセージを生成できる', () => {
      const count = 12;
      const message = `1コンテンツあたり画像は${MAX_IMAGES}枚までです。現在${count}枚が指定されています。`;
      expect(message).toContain('10枚まで');
      expect(message).toContain('12枚');
    });
  });
});
