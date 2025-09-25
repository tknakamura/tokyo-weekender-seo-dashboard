import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Search, 
  Eye, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import PerformanceChart from '../components/PerformanceChart'
import TopKeywordsTable from '../components/TopKeywordsTable'
import SERPFeaturesChart from '../components/SERPFeaturesChart'

interface SummaryStats {
  total_keywords: number
  total_volume: number
  total_traffic: number
  avg_position: number
  top_performing_keywords: number
}

const Dashboard: React.FC = () => {
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummaryStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analysis/summary')
      if (!response.ok) {
        throw new Error('データの取得に失敗しました')
      }
      const data = await response.json()
      setSummaryStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaryStats()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">データを読み込み中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <ArrowDownRight className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchSummaryStats}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
        >
          再試行
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tokyo Weekender SEO Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Organic Growth分析とコンテンツ戦略のための包括的なダッシュボード
          </p>
        </div>
        <button
          onClick={fetchSummaryStats}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>更新</span>
        </button>
      </div>

      {/* 主要メトリクス */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="総キーワード数"
          value={summaryStats?.total_keywords?.toLocaleString() || '0'}
          icon={Search}
          trend={null}
          description="追跡中のキーワード数"
        />
        <MetricCard
          title="総検索ボリューム"
          value={summaryStats?.total_volume ? formatNumber(summaryStats.total_volume) : '0'}
          icon={TrendingUp}
          trend={null}
          description="月間検索ボリューム合計"
        />
        <MetricCard
          title="総トラフィック"
          value={summaryStats?.total_traffic ? formatNumber(summaryStats.total_traffic) : '0'}
          icon={Eye}
          trend={null}
          description="月間オーガニックトラフィック"
        />
        <MetricCard
          title="平均順位"
          value={summaryStats?.avg_position ? summaryStats.avg_position.toFixed(1) : '0'}
          icon={Target}
          trend={null}
          description="全キーワードの平均順位"
        />
      </div>

      {/* パフォーマンス分析 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">順位分布</h3>
          <PerformanceChart />
        </div>
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SERP機能の取得状況</h3>
          <SERPFeaturesChart />
        </div>
      </div>

      {/* 高パフォーマンスキーワード */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">高パフォーマンスキーワード</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span>順位1-10位でボリューム100以上のキーワード</span>
          </div>
        </div>
        <TopKeywordsTable type="high-performance" />
      </div>

      {/* 改善機会 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">改善機会キーワード</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Target className="h-4 w-4 text-blue-600" />
            <span>順位11-20位でボリューム50以上のキーワード</span>
          </div>
        </div>
        <TopKeywordsTable type="improvement-opportunities" />
      </div>
    </div>
  )
}

export default Dashboard
