import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Download, ExternalLink } from 'lucide-react'
import { apiRequest } from '../utils/api'

interface Keyword {
  Keyword: string
  'Country code': string
  Location: string
  Volume: number
  'Current position': number
  'Organic traffic': number
  KD: number
  'Current URL': string
  Informational: boolean
  Commercial: boolean
  Transactional: boolean
  Navigational: boolean
  Branded: boolean
  Local: boolean
}

// ソート関数
const sortKeywords = (keywords: Keyword[], sortBy: string, sortOrder: 'asc' | 'desc'): Keyword[] => {
  return [...keywords].sort((a, b) => {
    let aValue: number
    let bValue: number
    
    switch (sortBy) {
      case 'traffic':
        aValue = a['Organic traffic'] || 0
        bValue = b['Organic traffic'] || 0
        break
      case 'volume':
        aValue = a.Volume || 0
        bValue = b.Volume || 0
        break
      case 'position':
        aValue = a['Current position'] || 999
        bValue = b['Current position'] || 999
        break
      case 'difficulty':
        aValue = a.KD || 0
        bValue = b.KD || 0
        break
      default:
        return 0
    }
    
    if (sortOrder === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })
}

const KeywordAnalysis: React.FC = () => {
  const [filters, setFilters] = useState({
    minVolume: 100,
    maxPosition: 50,
    intent: ''
  })
  const [sortBy, setSortBy] = useState<'traffic' | 'volume' | 'position' | 'difficulty'>('traffic')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        min_volume: filters.minVolume.toString(),
        max_position: filters.maxPosition.toString(),
        intent: filters.intent,
        limit: '100'
      })
      
      const response = await apiRequest(`/api/keywords/search?${params}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      console.log('Search results:', data)
      
      // フロントエンドでソートを適用
      const sortedData = sortKeywords(data, sortBy, sortOrder)
      setKeywords(sortedData)
    } catch (err) {
      setError('Failed to search keywords')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, sortOrder]) // filters, sortBy, sortOrderが変更された時のみ再実行

  // ページロード時にデフォルト検索を実行
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-100'
    if (position <= 10) return 'text-blue-600 bg-blue-100'
    if (position <= 20) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keyword Analysis</h1>
          <p className="mt-1 text-gray-600">
            Detailed analysis of Tokyo Weekender keyword performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* フィルターセクション */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Conditions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Search Volume
            </label>
            <input
              type="number"
              value={filters.minVolume}
              onChange={(e) => setFilters({...filters, minVolume: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Position
            </label>
            <input
              type="number"
              value={filters.maxPosition}
              onChange={(e) => setFilters({...filters, maxPosition: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intent Classification
            </label>
            <select 
              value={filters.intent}
              onChange={(e) => setFilters({...filters, intent: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="Informational">Informational</option>
              <option value="Commercial">Commercial</option>
              <option value="Transactional">Transactional</option>
              <option value="Navigational">Navigational</option>
              <option value="Branded">Branded</option>
              <option value="Local">Local</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort Options</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'traffic' | 'volume' | 'position' | 'difficulty')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="traffic">Organic Traffic</option>
              <option value="volume">Search Volume</option>
              <option value="position">Current Position</option>
              <option value="difficulty">Keyword Difficulty</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 text-red-600">⚠️</div>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* キーワード一覧 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Keyword List</h3>
          {keywords.length > 0 && (
            <span className="text-sm text-gray-500">
              {keywords.length} keywords found
            </span>
          )}
        </div>
        
        {keywords.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            Click "Search" to find keywords based on your filter criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortBy === 'volume') {
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      } else {
                        setSortBy('volume')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    Volume {sortBy === 'volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortBy === 'position') {
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      } else {
                        setSortBy('position')
                        setSortOrder('asc')
                      }
                    }}
                  >
                    Position {sortBy === 'position' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortBy === 'traffic') {
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      } else {
                        setSortBy('traffic')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    Traffic {sortBy === 'traffic' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortBy === 'difficulty') {
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      } else {
                        setSortBy('difficulty')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    Difficulty {sortBy === 'difficulty' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intent
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
                        {keyword.Keyword}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {keyword.Location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.Volume?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(keyword['Current position'])}`}>
                        {keyword['Current position']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword['Organic traffic']?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.KD}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {keyword.Informational && <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Info</span>}
                        {keyword.Commercial && <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Commercial</span>}
                        {keyword.Transactional && <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Transaction</span>}
                        {keyword.Navigational && <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Navigate</span>}
                        {keyword.Branded && <span className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Branded</span>}
                        {keyword.Local && <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Local</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {keyword['Current URL'] && (
                        <a
                          href={keyword['Current URL']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeywordAnalysis
