import React from 'react'
import { FileText, Lightbulb, TrendingUp, Target } from 'lucide-react'

const ContentRecommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Recommendations</h1>
        <p className="mt-1 text-gray-600">
          New content creation and existing content improvement recommendations
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
              <p className="text-sm font-medium text-gray-500">New Content Proposals</p>
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
              <p className="text-sm font-medium text-gray-500">Improvement Proposals</p>
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
              <p className="text-sm font-medium text-gray-500">Potential Traffic</p>
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
              <p className="text-sm font-medium text-gray-500">Priority</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* 新規コンテンツ提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Content Creation Proposals</h3>
        <div className="text-center py-8 text-gray-500">
          New content proposals based on analysis of high-volume, low-competition keywords will be displayed
        </div>
      </div>

      {/* 既存コンテンツ改善提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Content Improvement Proposals</h3>
        <div className="text-center py-8 text-gray-500">
          Improvement proposals for keywords with high potential for ranking improvement will be displayed
        </div>
      </div>

      {/* トピッククラスター提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Cluster Proposals</h3>
        <div className="text-center py-8 text-gray-500">
          Topic cluster proposals grouping related keywords will be displayed
        </div>
      </div>
    </div>
  )
}

export default ContentRecommendations
