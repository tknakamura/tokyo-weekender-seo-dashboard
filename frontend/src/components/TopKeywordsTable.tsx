import React, { useEffect, useState } from 'react'
import { ExternalLink, TrendingUp, Eye } from 'lucide-react'

interface Keyword {
  Keyword: string
  Volume: number
  'Organic traffic': number
  'Current position': number
  'Current URL': string
  KD: number
}

interface TopKeywordsTableProps {
  type: 'high-performance' | 'improvement-opportunities'
}

const TopKeywordsTable: React.FC<TopKeywordsTableProps> = ({ type }) => {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setLoading(true)
        const endpoint = type === 'high-performance' 
          ? '/api/keywords/top-performing'
          : '/api/keywords/improvement-opportunities'
        
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
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
        <div className="text-gray-500">データを読み込み中...</div>
      </div>
    )
  }

  if (keywords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        データが見つかりませんでした
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              キーワード
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              検索ボリューム
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              トラフィック
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              順位
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              難易度
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ページ
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
                <div className="flex items-center text-sm text-gray-900">
                  <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                  {formatNumber(keyword.Volume)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Eye className="h-4 w-4 text-gray-400 mr-2" />
                  {formatNumber(keyword['Organic traffic'])}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(keyword['Current position'])}`}>
                  {keyword['Current position']}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {keyword.KD || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {keyword['Current URL'] && (
                  <a
                    href={keyword['Current URL']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    ページを見る
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopKeywordsTable
