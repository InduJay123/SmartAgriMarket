import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  MapPin,
  Thermometer,
  Wind,
  Waves,
  Shield,
  TrendingUp,
  RefreshCw,
  Bell,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Header from "../../components/farmer/Header";
import type {
  FloodPredictionInput,
  FloodPredictionResult,
  FloodAlert,
} from "../../api/farmer/floodDetection";
import {
  predictFloodRisk,
  getActiveFloodAlerts,
  getCurrentWeatherData,
  getFloodModelInfo,
} from "../../api/farmer/floodDetection";

// Sri Lankan districts
const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle"
];

const FloodDetection: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FloodPredictionInput>({
    district: "",
    rainfall_mm: 0,
    river_level_m: 0,
    soil_moisture_percent: 0,
    temperature_celsius: 0,
    humidity_percent: 0,
    previous_flood_history: false,
    elevation_m: 0,
    drainage_quality: "moderate",
  });

  // Results and UI state
  const [predictionResult, setPredictionResult] = useState<FloodPredictionResult | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<FloodAlert[]>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active alerts and model info on mount
  useEffect(() => {
    loadActiveAlerts();
    loadModelInfo();
  }, []);

  const loadActiveAlerts = async () => {
    try {
      setAlertsLoading(true);
      const alerts = await getActiveFloodAlerts();
      setActiveAlerts(alerts);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadModelInfo = async () => {
    try {
      const info = await getFloodModelInfo();
      setModelInfo(info);
    } catch (err) {
      console.error("Failed to load model info:", err);
    }
  };

  const fetchWeatherData = async () => {
    if (!formData.district) {
      setError("Please select a district first");
      return;
    }

    try {
      setFetchingWeather(true);
      setError(null);
      const weather = await getCurrentWeatherData(formData.district);
      setFormData((prev) => ({
        ...prev,
        rainfall_mm: weather.rainfall_mm || 0,
        temperature_celsius: weather.temperature_celsius || 0,
        humidity_percent: weather.humidity_percent || 0,
        river_level_m: weather.river_level_m || 0,
        soil_moisture_percent: weather.soil_moisture_percent || 0,
      }));
    } catch (err) {
      setError("Failed to fetch weather data. Please enter values manually.");
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePredict = async () => {
    if (!formData.district) {
      setError("Please select a district");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await predictFloodRisk(formData);
      setPredictionResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to predict flood risk. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "moderate":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "moderate":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "text-red-700";
      case "high":
        return "text-orange-700";
      case "moderate":
        return "text-yellow-700";
      case "low":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Waves className="text-blue-600" size={28} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Flood Detection & Anomaly Alert System
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            AI-powered flood risk prediction to protect your crops and farm
          </p>
        </div>

        {/* Active Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="text-red-600" size={20} />
              <h3 className="font-semibold text-red-800">Active Flood Alerts</h3>
            </div>
            <div className="space-y-2">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getRiskBgColor(alert.risk_level)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={getRiskTextColor(alert.risk_level)} size={18} />
                      <span className={`font-medium ${getRiskTextColor(alert.risk_level)}`}>
                        {alert.district} - {alert.risk_level.toUpperCase()} Risk
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.warning_message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold">Flood Risk Assessment</h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <XCircle className="text-red-500" size={18} />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-1" size={16} />
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fetch Weather Button */}
                <div className="flex items-end">
                  <button
                    onClick={fetchWeatherData}
                    disabled={fetchingWeather || !formData.district}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {fetchingWeather ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <RefreshCw size={18} />
                    )}
                    Fetch Current Weather
                  </button>
                </div>

                {/* Rainfall */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CloudRain className="inline mr-1" size={16} />
                    Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    name="rainfall_mm"
                    value={formData.rainfall_mm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 150"
                    min="0"
                  />
                </div>

                {/* River Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Waves className="inline mr-1" size={16} />
                    River Level (m)
                  </label>
                  <input
                    type="number"
                    name="river_level_m"
                    value={formData.river_level_m}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3.5"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Soil Moisture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="inline mr-1" size={16} />
                    Soil Moisture (%)
                  </label>
                  <input
                    type="number"
                    name="soil_moisture_percent"
                    value={formData.soil_moisture_percent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 80"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="inline mr-1" size={16} />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature_celsius"
                    value={formData.temperature_celsius}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 28"
                    min="-10"
                    max="50"
                  />
                </div>

                {/* Humidity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Wind className="inline mr-1" size={16} />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity_percent"
                    value={formData.humidity_percent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Elevation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline mr-1" size={16} />
                    Elevation (m)
                  </label>
                  <input
                    type="number"
                    name="elevation_m"
                    value={formData.elevation_m}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50"
                    min="0"
                  />
                </div>

                {/* Drainage Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drainage Quality
                  </label>
                  <select
                    name="drainage_quality"
                    value={formData.drainage_quality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="poor">Poor</option>
                    <option value="moderate">Moderate</option>
                    <option value="good">Good</option>
                  </select>
                </div>

                {/* Flood History */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="previous_flood_history"
                      checked={formData.previous_flood_history}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      This area has experienced flooding in the past
                    </span>
                  </label>
                </div>
              </div>

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={loading || !formData.district}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing Risk...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Predict Flood Risk
                  </>
                )}
              </button>
            </div>

            {/* Prediction Results */}
            {predictionResult && (
              <div className={`mt-6 bg-white rounded-xl shadow-lg p-6 border-l-4 ${getRiskColor(predictionResult.risk_level)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Prediction Results</h3>
                  <span
                    className={`px-4 py-1 rounded-full text-white font-semibold ${getRiskColor(predictionResult.risk_level)}`}
                  >
                    {predictionResult.risk_level.toUpperCase()} RISK
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {predictionResult.risk_score.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Probability</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(predictionResult.probability * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">likelihood</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Predicted Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {predictionResult.predicted_date || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">if conditions persist</p>
                  </div>
                </div>

                {/* Warning Message */}
                <div className={`p-4 rounded-lg mb-4 ${getRiskBgColor(predictionResult.risk_level)}`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={getRiskTextColor(predictionResult.risk_level)} size={20} />
                    <p className={`${getRiskTextColor(predictionResult.risk_level)} font-medium`}>
                      {predictionResult.warning_message}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={18} />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {predictionResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Affected Crops */}
                {predictionResult.affected_crops.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="text-orange-600" size={18} />
                      Potentially Affected Crops
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {predictionResult.affected_crops.map((crop, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Model Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-blue-600" size={20} />
                <h3 className="font-semibold">AI Model Info</h3>
              </div>
              {modelInfo ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Type:</span>
                    <span className="font-medium">{modelInfo.model_type || "Random Forest"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium text-green-600">
                      {modelInfo.accuracy || "94.2%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{modelInfo.last_updated || "2026-01-15"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Points:</span>
                    <span className="font-medium">{modelInfo.data_points || "50,000+"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Loading model info...</div>
              )}
            </div>

            {/* Risk Level Guide */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4">Risk Level Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-sm">Low Risk (0-25)</p>
                    <p className="text-xs text-gray-500">Normal conditions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="font-medium text-sm">Moderate Risk (26-50)</p>
                    <p className="text-xs text-gray-500">Monitor conditions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <p className="font-medium text-sm">High Risk (51-75)</p>
                    <p className="text-xs text-gray-500">Take precautions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <div>
                    <p className="font-medium text-sm">Critical Risk (76-100)</p>
                    <p className="text-xs text-gray-500">Immediate action required</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span>💡</span>
                  <span>Check predictions regularly during monsoon season</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span>Enable alerts for your district</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🌾</span>
                  <span>Plan harvesting based on flood forecasts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🚜</span>
                  <span>Prepare drainage systems before rainy season</span>
                </li>
              </ul>
            </div>

            {/* Refresh Alerts */}
            <button
              onClick={loadActiveAlerts}
              disabled={alertsLoading}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              {alertsLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <RefreshCw size={18} />
              )}
              Refresh Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodDetection;
