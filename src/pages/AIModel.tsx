import { Brain, Activity, Settings as SettingsIcon } from 'lucide-react';

export default function AIModel() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">AI Model Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-emerald-600" size={32} />
              <h3 className="font-semibold text-lg">Price Prediction Model</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">92.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">2025-11-08</span>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Retrain Model
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-blue-600" size={32} />
              <h3 className="font-semibold text-lg">Demand Forecasting</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">88.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">2025-11-07</span>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Retrain Model
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="text-gray-700" size={24} />
            <h3 className="font-semibold text-lg">Model Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Data Size
              </label>
              <input
                type="text"
                value="10,000 records"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Frequency
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
