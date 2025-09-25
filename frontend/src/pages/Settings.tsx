import React from 'react'
import { Settings as SettingsIcon, Upload, Database, RefreshCw } from 'lucide-react'

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Data management and system configuration
        </p>
      </div>

      {/* データ管理 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Tokyo Weekender Keyword Data</h4>
              <p className="text-sm text-gray-500">Current data: 60,872 keywords</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Update</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Competitor Site Data</h4>
              <p className="text-sm text-gray-500">Uploaded data: 0 items</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Google Search Console Data</h4>
              <p className="text-sm text-gray-500">Not connected</p>
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      {/* 分析設定 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Analysis Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              High Performance Keywords Definition
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum Search Volume</label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maximum Position</label>
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
              Improvement Opportunity Keywords Definition
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum Search Volume</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="11-20">11-20</option>
                  <option value="11-30">11-30</option>
                  <option value="11-50">11-50</option>
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
          System Operations
        </h3>
        <div className="space-y-3">
          <button className="btn-primary w-full sm:w-auto">
            Recalculate Analysis Data
          </button>
          <button className="btn-secondary w-full sm:w-auto">
            Clear Cache
          </button>
          <button className="btn-secondary w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
