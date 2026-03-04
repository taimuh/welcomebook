import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wb-page-center">
      <div className="wb-page-card anim-fadeup">
        <div className="wb-page-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>

        <div className="wb-page-code">404</div>

        <h1 className="wb-page-title">ページが見つかりません</h1>

        <p className="wb-page-desc">
          お探しのページは存在しないか、移動された可能性があります。
          URLをご確認のうえ、再度アクセスしてください。
        </p>

        <Link href="/" className="wb-btn-primary">
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
