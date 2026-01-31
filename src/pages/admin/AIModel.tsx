import { Brain, Activity, Settings as SettingsIcon, Waves, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function AIModel() {
  const [retrainingFlood, setRetrainingFlood] = useState(false);

  const handleRetrainFloodModel = async () => {
    setRetrainingFlood(true);
    // Simulate retraining - connect to actual backend endpoint
    setTimeout(() => {
      setRetrainingFlood(false);
      alert('Flood Detection Model retrained successfully!');
    }, 3000);
  };

  return (
    <div className="space-y-6 pr-28">
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

          {/* Flood Detection Model Card */}
          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="text-blue-600" size={32} />
              <h3 className="font-semibold text-lg">Flood Detection Model</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model Type:</span>
                <span className="font-medium">Random Forest</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training Data:</span>
                <span className="font-medium">50,000+ records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">2026-01-15</span>
              </div>
            </div>
            <button 
              onClick={handleRetrainFloodModel}
              disabled={retrainingFlood}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {retrainingFlood ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Retraining...
                </>
              ) : (
                'Retrain Model'
              )}
            </button>
          </div>

          {/* Anomaly Detection Stats */}
          <div className="p-6 border border-orange-200 rounded-lg bg-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-orange-600" size={32} />
              <h3 className="font-semibold text-lg">Flood Alert Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Alerts (30 days):</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Critical Alerts:</span>
                <span className="font-medium text-red-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk Alerts:</span>
                <span className="font-medium text-orange-600">34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Predictions Accuracy:</span>
                <span className="font-medium text-green-600">91.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Most Affected District:</span>
                <span className="font-medium">Ratnapura</span>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              View All Alerts
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
