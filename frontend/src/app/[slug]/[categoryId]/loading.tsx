/**
 * カテゴリページ ローディング状態
 * 実ページ構造: パンくず → カテゴリヘッダー → コンテンツリスト
 */

export default function CategoryLoading() {
  return (
    <>
      {/* パンくずスケルトン */}
      <div className="wb-breadcrumb">
        <div className="wb-skeleton" style={{ height: '11px', width: '72px' }} />
        <span className="wb-bc-sep">/</span>
        <div className="wb-skeleton" style={{ height: '11px', width: '96px' }} />
      </div>

      <div className="wb-content">
      {/* カテゴリヘッダースケルトン */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="wb-skeleton" style={{ width: '52px', height: '52px', borderRadius: '8px', flexShrink: 0 }} />
        <div style={{ flex: 1, paddingTop: '4px' }}>
          <div className="wb-skeleton" style={{ height: '24px', width: '160px', marginBottom: '10px' }} />
          <div className="wb-skeleton" style={{ height: '13px', width: '220px' }} />
        </div>
      </div>

      {/* コンテンツリストスケルトン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="wb-skeleton" style={{ height: '68px', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
    </>
  );
}
