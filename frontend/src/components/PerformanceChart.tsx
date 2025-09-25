import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PerformanceChart: React.FC = () => {
  const [chartData, setChartData] = React.useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analysis/performance')
        if (response.ok) {
          const data = await response.json()
          
          // 順位分布データの準備
          const positionData = data.position_distribution || {}
          const labels = ['1-3位', '4-10位', '11-20位', '21-50位', '50位以下']
          const keywordCounts = [
            positionData.top_3?.count || 0,
            positionData.top_10?.count || 0,
            positionData.top_20?.count || 0,
            positionData.top_50?.count || 0,
            positionData.not_ranking?.count || 0,
          ]
          const trafficData = [
            positionData.top_3?.total_traffic || 0,
            positionData.top_10?.total_traffic || 0,
            positionData.top_20?.total_traffic || 0,
            positionData.top_50?.total_traffic || 0,
            positionData.not_ranking?.total_traffic || 0,
          ]

          setChartData({
            labels,
            datasets: [
              {
                label: 'キーワード数',
                data: keywordCounts,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                yAxisID: 'y',
              },
              {
                label: 'トラフィック',
                data: trafficData,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                yAxisID: 'y1',
              },
            ],
          })
        }
      } catch (error) {
        console.error('チャートデータの取得に失敗:', error)
      }
    }

    fetchData()
  }, [])

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'キーワード数',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'トラフィック',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">データを読み込み中...</div>
      </div>
    )
  }

  return <Bar options={options} data={chartData} />
}

export default PerformanceChart
