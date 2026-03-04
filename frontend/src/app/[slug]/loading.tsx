/**
 * 物件ページ ローディング状態 (T090)
 * WbShell は既にレンダリング済みのため、コンテンツエリアのスケルトンのみ表示
 */

export default function Loading() {
  return (
    <div className="wb-content">
      {/* ヘッダースケルトン */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="wb-skeleton" style={{ height: '11px', width: '80px', marginBottom: '12px' }} />
        <div className="wb-skeleton" style={{ height: '32px', width: '240px', marginBottom: '16px' }} />
        <div className="wb-skeleton" style={{ height: '3px', width: '40px', marginBottom: '16px' }} />
        <div className="wb-skeleton" style={{ height: '80px', borderRadius: '12px' }} />
      </div>

      {/* カテゴリグリッドスケルトン */}
      <div className="cats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="wb-skeleton"
            style={{ height: '140px', borderRadius: '20px' }}
          />
        ))}
      </div>
    </div>
  );
}
