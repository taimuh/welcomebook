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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h1>
        <p className="text-gray-500 mb-6">
          ページの読み込み中に問題が発生しました。
          <br />
          しばらくしてからもう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
