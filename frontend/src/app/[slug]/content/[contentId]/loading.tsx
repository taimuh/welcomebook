/**
 * コンテンツ詳細ページ ローディング状態
 * 実ページ構造: パンくず → 戻るリンク → 記事ヘッダー → 本文
 */

export default function ContentLoading() {
  return (
    <>
      {/* パンくずスケルトン */}
      <div className="wb-breadcrumb">
        <div className="wb-skeleton" style={{ height: '11px', width: '72px' }} />
        <span className="wb-bc-sep">/</span>
        <div className="wb-skeleton" style={{ height: '11px', width: '80px' }} />
        <span className="wb-bc-sep">/</span>
        <div className="wb-skeleton" style={{ height: '11px', width: '120px' }} />
      </div>

      <div className="wb-content">
        {/* 戻るリンクスケルトン */}
        <div className="wb-skeleton" style={{ height: '13px', width: '108px', marginBottom: '20px', borderRadius: '4px' }} />

        {/* 記事ヘッダースケルトン */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="wb-skeleton" style={{ height: '22px', width: '80px', borderRadius: '999px', marginBottom: '16px' }} />
          <div className="wb-skeleton" style={{ height: '32px', width: '72%' }} />
        </div>

        {/* 本文スケルトン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="wb-skeleton" style={{ height: '15px', width: '100%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '93%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '97%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '76%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '100%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '88%' }} />
          <div className="wb-skeleton" style={{ height: '15px', width: '68%' }} />
        </div>
      </div>
    </>
  );
}
