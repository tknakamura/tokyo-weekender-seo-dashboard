import React, { useEffect, useState } from 'react'
import { ExternalLink, TrendingUp, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/api'

interface Keyword {
  keyword: string
  volume: number
  organic_traffic: number
  current_position: number
  current_url: string
  keyword_difficulty: number
}

interface TopKeywordsTableProps {
  type: 'high-performance' | 'improvement-opportunities'
}

const TopKeywordsTable: React.FC<TopKeywordsTableProps> = ({ type }) => {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setLoading(true)
        const endpoint = type === 'high-performance' 
          ? '/api/keywords/top-performing'
          : '/api/keywords/improvement-opportunities'
        
        const response = await apiRequest(endpoint)
        if (response.ok) {
          const data = await response.json()
          console.log(`Fetched ${type} keywords:`, data)
          setKeywords(data)
        }
      } catch (error) {
        console.error('キーワードデータの取得に失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKeywords()
  }, [type])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-100'
    if (position <= 10) return 'text-blue-600 bg-blue-100'
    if (position <= 20) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading data...</div>
        </div>
    )
  }

  if (keywords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Keyword
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Search Volume
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Traffic
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Page
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {keywords.map((keyword, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {keyword.keyword}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                  {formatNumber(keyword.volume)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Eye className="h-4 w-4 text-gray-400 mr-2" />
                  {formatNumber(keyword.organic_traffic)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(keyword.current_position)}`}>
                  {keyword.current_position}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {keyword.keyword_difficulty || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => navigate('/keywords')}
                  className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Page
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopKeywordsTable
