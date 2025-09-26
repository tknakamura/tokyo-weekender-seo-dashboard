import React, { useState, useEffect } from 'react'
import { FileText, Lightbulb, TrendingUp, Target, ExternalLink } from 'lucide-react'
import { apiRequest } from '../utils/api'

interface ContentRecommendation {
  title: string
  keyword: string
  volume: number
  difficulty: number
  potential_traffic: number
  content_type: string
  priority: string
  estimated_effort: string
  target_audience: string
  content_angle: string
}

interface ImprovementRecommendation {
  title: string
  current_url: string
  keyword: string
  current_position: number
  target_position: number
  potential_traffic_gain: number
  improvement_type: string
  priority: string
  recommendations: string[]
}

interface TopicCluster {
  cluster_name: string
  primary_keyword: string
  supporting_keywords: string[]
  content_pieces: number
  potential_traffic: number
  priority: string
}

interface ContentData {
  summary: {
    new_content_proposals: number
    improvement_proposals: number
    potential_traffic: number
    priority: string
  }
  new_content: ContentRecommendation[]
  improvements: ImprovementRecommendation[]
  topic_clusters: TopicCluster[]
}

const ContentRecommendations: React.FC = () => {
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await apiRequest('/api/content/recommendations')
        if (!response.ok) {
          throw new Error('Failed to fetch content recommendations')
        }
        const data = await response.json()
        setContentData(data)
      } catch (err) {
        setError('Failed to load content recommendations')
        console.error('Error fetching content recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContentData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Loading content recommendations...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 text-red-600">⚠️</div>
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    )
  }

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
              <p className="text-2xl font-bold text-gray-900">{contentData?.summary.new_content_proposals || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{contentData?.summary.improvement_proposals || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{contentData?.summary.potential_traffic?.toLocaleString() || '0'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{contentData?.summary.priority || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 新規コンテンツ提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Content Creation Proposals</h3>
        {contentData?.new_content && contentData.new_content.length > 0 ? (
          <div className="space-y-4">
            {contentData.new_content.map((proposal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{proposal.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{proposal.content_angle}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {proposal.content_type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${getPriorityColor(proposal.priority)}`}>
                        {proposal.priority} Priority
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${getEffortColor(proposal.estimated_effort)}`}>
                        {proposal.estimated_effort} Effort
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                        {proposal.target_audience}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Keyword:</span>
                        <p className="font-medium">{proposal.keyword}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <p className="font-medium">{proposal.volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Difficulty:</span>
                        <p className="font-medium">{proposal.difficulty}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Potential Traffic:</span>
                        <p className="font-medium text-green-600">{proposal.potential_traffic.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No new content proposals available
          </div>
        )}
      </div>

      {/* 既存コンテンツ改善提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Content Improvement Proposals</h3>
        {contentData?.improvements && contentData.improvements.length > 0 ? (
          <div className="space-y-4">
            {contentData.improvements.map((improvement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{improvement.title}</h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <a 
                        href={improvement.current_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Page
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {improvement.improvement_type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${getPriorityColor(improvement.priority)}`}>
                        {improvement.priority} Priority
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Keyword:</span>
                        <p className="font-medium">{improvement.keyword}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Position:</span>
                        <p className="font-medium">{improvement.current_position}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Target Position:</span>
                        <p className="font-medium text-green-600">{improvement.target_position}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Traffic Gain:</span>
                        <p className="font-medium text-green-600">+{improvement.potential_traffic_gain.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Recommendations:</span>
                      <ul className="mt-1 text-sm text-gray-600">
                        {improvement.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No improvement proposals available
          </div>
        )}
      </div>

      {/* トピッククラスター提案 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Cluster Proposals</h3>
        {contentData?.topic_clusters && contentData.topic_clusters.length > 0 ? (
          <div className="space-y-4">
            {contentData.topic_clusters.map((cluster, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{cluster.cluster_name}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                        {cluster.content_pieces} Content Pieces
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${getPriorityColor(cluster.priority)}`}>
                        {cluster.priority} Priority
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Primary Keyword:</span>
                        <p className="font-medium">{cluster.primary_keyword}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Potential Traffic:</span>
                        <p className="font-medium text-green-600">{cluster.potential_traffic.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Supporting Keywords:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {cluster.supporting_keywords.map((keyword, keywordIndex) => (
                          <span key={keywordIndex} className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No topic cluster proposals available
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentRecommendations
