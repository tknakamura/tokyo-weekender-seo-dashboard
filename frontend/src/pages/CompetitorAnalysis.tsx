import React from 'react'
import { Users, TrendingUp, Target } from 'lucide-react'

const CompetitorAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">競合分析</h1>
        <p className="mt-1 text-gray-600">
          競合サイトとの比較分析と機会発見
        </p>
      </div>

      {/* 競合概要 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">追跡中の競合数</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">機会キーワード</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">潜在トラフィック</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 競合データのアップロード */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">競合データのアップロード</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">競合サイトのキーワードデータをアップロード</h4>
          <p className="text-gray-600 mb-4">
            Ahrefsからエクスポートした競合サイトのキーワードデータをCSV形式でアップロードしてください
          </p>
          <button className="btn-primary">
            ファイルを選択
          </button>
        </div>
      </div>

      {/* 競合比較 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">競合比較分析</h3>
        <div className="text-center py-8 text-gray-500">
          競合データのアップロード後に比較分析が表示されます
        </div>
      </div>
    </div>
  )
}

export default CompetitorAnalysis
