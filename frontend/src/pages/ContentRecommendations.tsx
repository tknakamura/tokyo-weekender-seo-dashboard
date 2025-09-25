import React from 'react'
import { FileText, Lightbulb, TrendingUp, Target } from 'lucide-react'

const ContentRecommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">コンテンツ提案</h1>
        <p className="mt-1 text-gray-600">
          新規コンテンツ制作と既存コンテンツ改善の提案
        </p>
      </div>

      {/* 提案概要 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">新規コンテンツ提案</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">改善提案</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">潜在トラフィック</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">優先度</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* 新規コンテンツ提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">新規コンテンツ制作提案</h3>
        <div className="text-center py-8 text-gray-500">
          高ボリューム・低競合キーワードの分析結果に基づく新規コンテンツ提案が表示されます
        </div>
      </div>

      {/* 既存コンテンツ改善提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">既存コンテンツ改善提案</h3>
        <div className="text-center py-8 text-gray-500">
          順位改善の可能性が高いキーワードの改善提案が表示されます
        </div>
      </div>

      {/* トピッククラスター提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">トピッククラスター提案</h3>
        <div className="text-center py-8 text-gray-500">
          関連キーワードをグループ化したトピッククラスターの提案が表示されます
        </div>
      </div>
    </div>
  )
}

export default ContentRecommendations
