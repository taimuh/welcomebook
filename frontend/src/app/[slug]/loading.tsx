/**
 * 物件ページ ローディング状態 (T090)
 */

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダースケルトン */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-24 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </header>

      {/* カテゴリリストスケルトン */}
      <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
