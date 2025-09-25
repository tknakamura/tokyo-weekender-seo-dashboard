import React from 'react'
import { Settings as SettingsIcon, Upload, Database, RefreshCw } from 'lucide-react'

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-gray-600">
          データ管理とシステム設定
        </p>
      </div>

      {/* データ管理 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          データ管理
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Tokyo Weekender キーワードデータ</h4>
              <p className="text-sm text-gray-500">現在のデータ: 2,677件のキーワード</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>更新</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">競合サイトデータ</h4>
              <p className="text-sm text-gray-500">アップロードされたデータ: 0件</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>アップロード</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Google Search Console データ</h4>
              <p className="text-sm text-gray-500">未接続</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>接続</span>
            </button>
          </div>
        </div>
      </div>

      {/* 分析設定 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          分析設定
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              高パフォーマンスキーワードの定義
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">最小検索ボリューム</label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">最大順位</label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              改善機会キーワードの定義
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">最小検索ボリューム</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">順位範囲</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="11-20">11-20位</option>
                  <option value="11-30">11-30位</option>
                  <option value="11-50">11-50位</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* システム操作 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2" />
          システム操作
        </h3>
        <div className="space-y-3">
          <button className="btn-primary w-full sm:w-auto">
            分析データの再計算
          </button>
          <button className="btn-secondary w-full sm:w-auto">
            キャッシュのクリア
          </button>
          <button className="btn-secondary w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">
            全データのリセット
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
