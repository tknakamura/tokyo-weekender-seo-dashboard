import React from 'react'
import { Search, Filter, Download } from 'lucide-react'

const KeywordAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">キーワード分析</h1>
          <p className="mt-1 text-gray-600">
            Tokyo Weekenderのキーワードパフォーマンス詳細分析
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>フィルター</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>エクスポート</span>
          </button>
        </div>
      </div>

      {/* フィルターセクション */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">フィルター条件</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最小検索ボリューム
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例: 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大順位
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例: 50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              意図分類
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">すべて</option>
              <option value="Informational">情報検索</option>
              <option value="Commercial">商業検索</option>
              <option value="Transactional">取引検索</option>
              <option value="Navigational">ナビゲーション</option>
              <option value="Branded">ブランド</option>
              <option value="Local">ローカル</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">
              <Search className="h-4 w-4 mr-2" />
              検索
            </button>
          </div>
        </div>
      </div>

      {/* キーワード一覧 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">キーワード一覧</h3>
        <div className="text-center py-8 text-gray-500">
          キーワードデータの表示機能は開発中です
        </div>
      </div>
    </div>
  )
}

export default KeywordAnalysis
