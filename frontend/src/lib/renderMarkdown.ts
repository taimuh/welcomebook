/**
 * Markdown レンダリング共有ユーティリティ
 * ContentDetail・PropertyHeader 等で共通使用
 */

import { marked } from 'marked';

// リンクを新しいタブで開く・画像サイズ指定のカスタムレンダラー
// 画像サイズ記法: ![alt](url "WxH") 例: "600x400" "600x" "x400"
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    link({ href, text }: { href: string; text: string }) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
    image({ href, text, title }: { href: string; text: string; title?: string | null }) {
      return renderImageTag(text, href, title);
    },
  },
});

/**
 * <img> タグ文字列を生成する（サイズ指定対応）
 * title が "WxH" 形式の場合に width/height 属性を付与する
 */
export function renderImageTag(alt: string, href: string, title?: string | null): string {
  let width = '';
  let height = '';
  if (title) {
    const m = title.match(/^(\d+)?x(\d+)?$/);
    if (m) {
      width = m[1] ?? '';
      height = m[2] ?? '';
    }
  }
  const w = width  ? ` width="${width}"`  : '';
  const h = height ? ` height="${height}"` : '';
  return `<img src="${href}" alt="${alt}"${w}${h} style="max-width:100%">`;
}

/**
 * :::image-row ブロックを横並び画像 div に変換する前処理
 *
 * 記法:
 *   ::: image-row
 *   ![説明A](url-a.jpg "300x200")
 *   ![説明B](url-b.jpg "300x200")
 *   :::
 */
function preprocessImageRow(text: string): string {
  return text.replace(
    /^:::[ \t]*image-row[ \t]*\n([\s\S]*?)\n^:::[ \t]*$/gm,
    (_, inner: string) => {
      const imgs = inner.trim().replace(
        /!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g,
        (_, imgAlt: string, href: string, title: string) =>
          renderImageTag(imgAlt, href, title),
      );
      return `<div class="img-row">${imgs}</div>`;
    },
  );
}

/**
 * ヘッダなし表: セパレータ行から始まる表に空ヘッダ行を挿入する
 * 例: |---|---| → | | |\n|---|---|
 */
function injectEmptyTableHeader(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = i > 0 ? lines[i - 1].trim() : '';
    // セパレータ行（|---|）かつ前行がテーブル行でない → 空ヘッダを挿入
    if (/^\|[-: |]+\|$/.test(line.trim()) && !prev.startsWith('|')) {
      const cols = (line.match(/\|/g)?.length ?? 2) - 1;
      result.push('|' + ' |'.repeat(cols));
    }
    result.push(line);
  }
  return result.join('\n');
}

/**
 * Markdown テキストを HTML に変換する（カスタム記法含む）
 *
 * 対応記法:
 *   - 標準 Markdown（見出し・リスト・テーブル・リンク・画像）
 *   - ==テキスト==         → <mark>（ハイライト）
 *   - {red:テキスト}       → <span class="text-red">（文字色）
 *   - ![alt](url "WxH")    → サイズ指定画像
 *   - ::: image-row ブロック → 横並び画像
 */
export function renderMarkdown(text: string): string {
  const preprocessed = preprocessImageRow(injectEmptyTableHeader(text));
  const html = marked(preprocessed) as string;
  return html
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(
      /\{(red|blue|green|orange):(.+?)\}/g,
      '<span class="text-$1">$2</span>'
    );
}
