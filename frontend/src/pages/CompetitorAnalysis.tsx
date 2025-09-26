import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp, Target, ExternalLink, BarChart3 } from 'lucide-react'
import { apiRequest } from '../utils/api'

interface Competitor {
  site_name: string
  display_name: string
  total_keywords: number
  total_traffic: number
  avg_position: number
  total_volume: number
}

interface CompetitorSummary {
  competitors: Competitor[]
  summary: {
    total_competitors: number
    total_traffic: number
    total_keywords: number
  }
}

const CompetitorAnalysis: React.FC = () => {
  const navigate = useNavigate()
  const [competitorData, setCompetitorData] = useState<CompetitorSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetitorData = async () => {
      try {
        const response = await apiRequest('/api/competitors/summary')
        if (!response.ok) {
          throw new Error('Failed to fetch competitor data')
        }
        const data = await response.json()
        setCompetitorData(data)
      } catch (err) {
        setError('Failed to load competitor data')
        console.error('Error fetching competitor data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitorData()
  }, [])

  const getTrafficColor = (traffic: number) => {
    if (traffic > 500000) return 'text-green-600 bg-green-100'
    if (traffic > 100000) return 'text-blue-600 bg-blue-100'
    if (traffic > 50000) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getPositionColor = (position: number) => {
    if (position <= 10) return 'text-green-600 bg-green-100'
    if (position <= 20) return 'text-blue-600 bg-blue-100'
    if (position <= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Loading competitor data...</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Competitor Analysis</h1>
        <p className="mt-1 text-gray-600">
          Comparative analysis with competitor sites and opportunity discovery
        </p>
      </div>

      {/* Competitor Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tracked Competitors</p>
              <p className="text-2xl font-bold text-gray-900">{competitorData?.summary.total_competitors || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Keywords</p>
              <p className="text-2xl font-bold text-gray-900">{competitorData?.summary.total_keywords?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Traffic</p>
              <p className="text-2xl font-bold text-gray-900">{competitorData?.summary.total_traffic?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 競合データのアップロード */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Competitor Data</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Competitor Site Keyword Data</h4>
          <p className="text-gray-600 mb-4">
            Please upload competitor site keyword data exported from Ahrefs in CSV format
          </p>
          <button className="btn-primary">
            Select File
          </button>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Comparison Analysis</h3>
        {competitorData?.competitors && competitorData.competitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keywords
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traffic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitorData.competitors.map((competitor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {competitor.display_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {competitor.site_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {competitor.total_keywords?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrafficColor(competitor.total_traffic)}`}>
                        {competitor.total_traffic?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(competitor.avg_position)}`}>
                        {competitor.avg_position?.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {competitor.total_volume?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/competitors/${competitor.site_name}`)}
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Compare
                        </button>
                        <a
                          href={`https://${competitor.site_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit Site
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No competitor data available
          </div>
        )}
      </div>
    </div>
  )
}

export default CompetitorAnalysis
