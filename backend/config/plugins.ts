/**
 * プラグイン設定 (T045, T081)
 * - リッチテキストエディタ設定
 * - 画像アップロード制限
 */

export default () => ({
  // 画像アップロード制限 (T081)
  upload: {
    config: {
      sizeLimit: 5 * 1024 * 1024, // 5MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 156,
      },
    },
  },
});
