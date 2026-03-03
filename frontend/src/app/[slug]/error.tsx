/**
 * 物件ページ エラーバウンダリ (T091)
 */

'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Property page error:', error);
  }, [error]);

  return (
    <div className="wb-content wb-error-center">
      <div className="wb-page-card">
        <div className="wb-page-emoji">😵</div>
        <h1 className="wb-page-title">エラーが発生しました</h1>
        <p className="wb-page-desc">
          ページの読み込み中に問題が発生しました。
          しばらくしてからもう一度お試しください。
        </p>
        <button onClick={reset} className="wb-btn-primary">
          もう一度試す
        </button>
      </div>
    </div>
  );
}
