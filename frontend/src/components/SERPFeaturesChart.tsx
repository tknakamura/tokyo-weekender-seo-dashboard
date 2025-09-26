import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { apiRequest } from '../utils/api'

ChartJS.register(ArcElement, Tooltip, Legend)

const SERPFeaturesChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest('/api/analysis/serp-features')
        if (response.ok) {
          const data = await response.json()
          
          // SERP機能データの準備
          const features = Object.keys(data)
          const counts = features.map(feature => data[feature]?.count || 0)
          
          // 色の配列
          const colors = [
            'rgba(59, 130, 246, 0.8)',   // Blue
            'rgba(16, 185, 129, 0.8)',   // Green
            'rgba(245, 158, 11, 0.8)',   // Yellow
            'rgba(239, 68, 68, 0.8)',    // Red
            'rgba(139, 92, 246, 0.8)',   // Purple
            'rgba(236, 72, 153, 0.8)',   // Pink
            'rgba(14, 165, 233, 0.8)',   // Sky
            'rgba(34, 197, 94, 0.8)',    // Emerald
          ]

          setChartData({
            labels: features,
            datasets: [
              {
                data: counts,
                backgroundColor: colors.slice(0, features.length),
                borderColor: colors.slice(0, features.length).map(color => color.replace('0.8', '1')),
                borderWidth: 2,
              },
            ],
          })
        }
      } catch (error) {
        console.error('SERP機能データの取得に失敗:', error)
      }
    }

    fetchData()
  }, [])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    },
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading data...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Doughnut options={options} data={chartData} />
    </div>
  )
}

export default SERPFeaturesChart
