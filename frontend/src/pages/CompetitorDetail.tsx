import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, Target } from 'lucide-react'

interface ComparisonData {
  keyword: string
  volume: number
  competitor_position: number
  competitor_traffic: number
  competitor_url: string
  keyword_difficulty: number
  cpc: number
  serp_features: string
  informational: boolean
  commercial: boolean
  transactional: boolean
  navigational: boolean
  branded: boolean
  local: boolean
  tokyo_weekender_position: number
  tokyo_weekender_traffic: number
  tokyo_weekender_url: string
  opportunity_score: number
  status: 'not_ranking' | 'better' | 'worse' | 'same'
}

const CompetitorDetail: React.FC = () => {
  const { competitorSite } = useParams<{ competitorSite: string }>()
  const navigate = useNavigate()
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const displayName = {
    "tokyocheapo.com": "Tokyo Cheapo",
    "www.japan.travel": "Japan Travel", 
    "www.timeout.jp": "Timeout Tokyo",
    "www.gotokyo.org": "Go Tokyo"
  }[competitorSite || ''] || competitorSite

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!competitorSite) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/competitors/${competitorSite}/comparison?limit=100`)
        if (!response.ok) {
          throw new Error('Failed to fetch comparison data')
        }
        const data = await response.json()
        setComparisonData(data)
      } catch (err) {
        setError('Failed to load comparison data')
        console.error('Error fetching comparison data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchComparisonData()
  }, [competitorSite])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'better':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'worse':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'not_ranking':
        return <Minus className="h-4 w-4 text-gray-400" />
      case 'same':
        return <Minus className="h-4 w-4 text-blue-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'better':
        return 'text-green-600 bg-green-100'
      case 'worse':
        return 'text-red-600 bg-red-100'
      case 'not_ranking':
        return 'text-gray-600 bg-gray-100'
      case 'same':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-100'
    if (position <= 10) return 'text-blue-600 bg-blue-100'
    if (position <= 20) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getIntentTags = (keyword: ComparisonData) => {
    const tags = []
    if (keyword.informational) tags.push({ label: 'Info', color: 'bg-blue-100 text-blue-800' })
    if (keyword.commercial) tags.push({ label: 'Commercial', color: 'bg-green-100 text-green-800' })
    if (keyword.transactional) tags.push({ label: 'Transaction', color: 'bg-purple-100 text-purple-800' })
    if (keyword.navigational) tags.push({ label: 'Navigate', color: 'bg-yellow-100 text-yellow-800' })
    if (keyword.branded) tags.push({ label: 'Branded', color: 'bg-red-100 text-red-800' })
    if (keyword.local) tags.push({ label: 'Local', color: 'bg-gray-100 text-gray-800' })
    return tags
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Loading comparison data...</span>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/competitors')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Competitors
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {displayName} vs Tokyo Weekender
            </h1>
            <p className="mt-1 text-gray-600">
              Detailed keyword comparison analysis
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Keywords</p>
              <p className="text-2xl font-bold text-gray-900">{comparisonData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tokyo Weekender Better</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisonData.filter(k => k.status === 'better').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Competitor Better</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisonData.filter(k => k.status === 'worse').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Minus className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Not Ranking</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisonData.filter(k => k.status === 'not_ranking').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Keyword Comparison ({displayName} vs Tokyo Weekender)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {displayName} Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokyo Weekender Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.map((keyword, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {keyword.volume?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(keyword.competitor_position)}`}>
                      {keyword.competitor_position}
                    </span>
                    <div className="text-xs text-gray-500">
                      Traffic: {keyword.competitor_traffic?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {keyword.tokyo_weekender_position === 999 ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        Not Ranking
                      </span>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(keyword.tokyo_weekender_position)}`}>
                        {keyword.tokyo_weekender_position}
                      </span>
                    )}
                    <div className="text-xs text-gray-500">
                      Traffic: {keyword.tokyo_weekender_traffic?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(keyword.status)}`}>
                      {getStatusIcon(keyword.status)}
                      <span className="ml-1 capitalize">{keyword.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getIntentTags(keyword).map((tag, tagIndex) => (
                        <span key={tagIndex} className={`inline-flex px-2 py-1 text-xs rounded ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {keyword.competitor_url && (
                        <a
                          href={keyword.competitor_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                          title="View competitor page"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {displayName}
                        </a>
                      )}
                      {keyword.tokyo_weekender_url && (
                        <a
                          href={keyword.tokyo_weekender_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                          title="View Tokyo Weekender page"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          TW
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompetitorDetail
