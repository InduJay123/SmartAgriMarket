import { useEffect, useMemo, useState } from "react";


import {

  
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  BarChart3,
  Loader2,
  RefreshCw,
  Calendar,
  DollarSign,
  Package,
  Leaf,
  AlertCircle,
  Info,
} from "lucide-react";

import Header from "../../components/farmer/Header";
import {
  predictPrice,
  predictDemand,
  AVAILABLE_CROPS,
  SEASONS,
  MARKET_TRENDS,
  CONSUMPTION_TRENDS,
  type PricePredictionResponse,
  type DemandPredictionResponse,
} from "../../lib/MLService";

interface ForecastData {
  date: string;
  price: number;
  demand: number;
}

interface YieldForecastPoint {
  month_year: string; // YYYY-MM
  predicted_yield_ha: number;
}

interface YieldForecastResponse {
  crop_type: string;
  horizon_months: number;
  start_month: string; // YYYY-MM
  unit: string; // "ha"
  predictions: YieldForecastPoint[];
}

type Tab = "price" | "demand" | "yield";

const AiInsights: React.FC = () => {
  // Shared
  const [activeTab, setActiveTab] = useState<Tab>("price");
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [season, setSeason] = useState<string>("northeast_monsoon");

  // Price/Demand
  const [forecastDays, setForecastDays] = useState<number>(7);
  const [marketTrend, setMarketTrend] = useState<string>("stable");
  const [consumptionTrend, setConsumptionTrend] = useState<string>("stable");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [priceResult, setPriceResult] = useState<PricePredictionResponse | null>(null);
  const [demandResult, setDemandResult] = useState<DemandPredictionResponse | null>(null);

  // Yield (only crop + months)
  const [yieldMonths, setYieldMonths] = useState<number>(1);
  const [yieldResult, setYieldResult] = useState<YieldForecastResponse | null>(null);
  const [yieldChart, setYieldChart] = useState<{ date: string; yield: number; mode: "preview" | "predicted" }[]>(
    []
  );

  // UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getPriceTrend = () => {
    if (forecastData.length < 2) return "stable";
    const first = forecastData[0].price;
    const last = forecastData[forecastData.length - 1].price;
    const change = ((last - first) / first) * 100;
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "stable";
  };

  const getDemandTrend = () => {
    if (forecastData.length < 2) return "stable";
    const first = forecastData[0].demand;
    const last = forecastData[forecastData.length - 1].demand;
    const change = ((last - first) / first) * 100;
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "stable";
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="text-green-500" size={20} />;
    if (trend === "down") return <TrendingDown className="text-red-500" size={20} />;
    return <Minus className="text-gray-500" size={20} />;
  };

  // -----------------------------
  // Price/Demand Forecast (unchanged)
  // -----------------------------
  const generateSimulatedForecast = () => {
    const forecasts: ForecastData[] = [];
    const today = new Date();

    for (let i = 0; i < forecastDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      forecasts.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: 150 + Math.sin((i / forecastDays) * Math.PI * 2) * 50 + Math.random() * 20,
        demand: 900 + Math.cos((i / forecastDays) * Math.PI) * 200 + Math.random() * 50,
      });
    }

    setForecastData(forecasts);
    setPriceResult({
      prediction_type: "price",
      crop_type: selectedCrop,
      predicted_price: forecasts[0].price,
      currency: "LKR",
    });
    setDemandResult({
      prediction_type: "demand",
      crop_type: selectedCrop,
      predicted_demand: forecasts[0].demand,
      unit: "tonnes",
    });
  };

  const generateForecast = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const baseSupply = 1000;
      const baseDemand = 1200;

      const [p, d] = await Promise.allSettled([
        predictPrice({
          crop_type: selectedCrop,
          season,
          supply: baseSupply,
          demand: baseDemand,
          market_trend: marketTrend,
        }),
        predictDemand({
          crop_type: selectedCrop,
          season,
          historical_demand: baseDemand,
          population: 22000000,
          consumption_trend: consumptionTrend,
        }),
      ]);

      const priceResponse = p.status === "fulfilled" ? p.value : null;
      const demandResponse = d.status === "fulfilled" ? d.value : null;

      if (!priceResponse && !demandResponse) throw new Error("Both API calls failed");

      if (priceResponse) setPriceResult(priceResponse);
      if (demandResponse) setDemandResult(demandResponse);

      const basePrice = priceResponse?.predicted_price || 150;
      const baseDemandValue = demandResponse?.predicted_demand || 900;

      const forecasts: ForecastData[] = [];
      const today = new Date();

      for (let i = 0; i < forecastDays; i++) {
        const dt = new Date(today);
        dt.setDate(today.getDate() + i);

        const trendFactor = marketTrend === "rising" ? 1.02 : marketTrend === "falling" ? 0.98 : 1;
        const dayVariation = 1 + (Math.random() - 0.5) * 0.1;
        const seasonalVariation = 1 + Math.sin((i / forecastDays) * Math.PI) * 0.05;

        forecasts.push({
          date: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: basePrice * dayVariation * seasonalVariation * Math.pow(trendFactor, i),
          demand: baseDemandValue * dayVariation * (1 + Math.cos((i / forecastDays) * Math.PI) * 0.1),
        });
      }

      setForecastData(forecasts);
    } catch (e) {
      console.error(e);
      setError("Failed to generate forecast. Using simulated data.");
      generateSimulatedForecast();
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Yield (NEW: preview + proper UI)
  // -----------------------------
  const buildYieldPreview = (months: number, crop: string) => {
    const now = new Date();
    const base = crop.toLowerCase().includes("tomato") ? 2800 : 2200;

    const data = Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      // smooth preview curve
      const y = Math.round(base + Math.sin(i / 2) * 120 + (Math.random() * 60 - 30));
      return { date: ym, yield: y, mode: "preview" as const };
    });

    setYieldChart(data);
  };

  const predictYieldForecast = async (payload: { crop_type: string; months: number; horizon_months?: number }) => {
    const res = await fetch("http://localhost:8000/api/ml/yield/forecast/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Yield forecast failed");
    }
    return (await res.json()) as YieldForecastResponse;
  };

  const handleYieldPrediction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Send BOTH keys to avoid mismatch if backend expects either one
      const response = await predictYieldForecast({
        crop_type: selectedCrop,
        months: yieldMonths,
        horizon_months: yieldMonths,
      });

      setYieldResult(response);

      const chart = (response.predictions || []).map((p) => ({
        date: p.month_year,
        yield: Math.round(p.predicted_yield_ha),
        mode: "predicted" as const,
      }));
      setYieldChart(chart);
    } catch (e) {
      console.error(e);
      setError("Failed to predict yield. Please check your connection.");
      // keep preview so UI still looks good
      buildYieldPreview(yieldMonths, selectedCrop);
    } finally {
      setIsLoading(false);
    }
  };

  const yieldSummary = useMemo(() => {
    if (!yieldChart.length) return null;
    const values = yieldChart.map((x) => x.yield);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend =
      values[values.length - 1] > values[0] ? "Increasing" : values[values.length - 1] < values[0] ? "Decreasing" : "Stable";
    return { avg, trend };
  }, [yieldChart]);

  // Initial load
  useEffect(() => {
    generateForecast();
  }, []);

  // Always keep a nice yield preview chart BEFORE predict
  useEffect(() => {
    if (activeTab === "yield") {
      // If user already predicted (yieldResult exists), keep predicted chart.
      // Otherwise regenerate preview based on current selections.
      if (!yieldResult) buildYieldPreview(yieldMonths, selectedCrop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, yieldMonths, selectedCrop]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-4 min-h-screen w-full">
      <Header
        icon={Brain}
        title="AI Insights & Forecasting"
        subTitle="Get AI-powered predictions for crop prices, demand, and yields using Random Forest ML model"
      />

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-blue-800">Random Forest ML Model</h4>
          <p className="text-sm text-blue-600">
            Predictions are powered by a Random Forest model trained on historical market/agri data. It learns seasonal patterns and trends to provide forecasts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { id: "price", label: "Price Forecast", icon: DollarSign },
          { id: "demand", label: "Demand Forecast", icon: Package },
          { id: "yield", label: "Yield Prediction", icon: Leaf },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Main */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Controls (Price-like) */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="text-green-600" size={20} />
            {activeTab === "yield" ? "Yield Parameters" : "Forecast Parameters"}
          </h3>

          <div className="space-y-4">
            {/* Crop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  if (activeTab === "yield") setYieldResult(null); // reset to preview when crop changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {AVAILABLE_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Season (kept for UI consistency, yield model ignores it) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            {activeTab === "price" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Trend</label>
                  <select
                    value={marketTrend}
                    onChange={(e) => setMarketTrend(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {MARKET_TRENDS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Days: {forecastDays}</label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={forecastDays}
                    onChange={(e) => setForecastDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3</span>
                    <span>30</span>
                  </div>
                </div>
              </>
            )}

            {/* DEMAND */}
            {activeTab === "demand" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consumption Trend</label>
                  <select
                    value={consumptionTrend}
                    onChange={(e) => setConsumptionTrend(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {CONSUMPTION_TRENDS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Days: {forecastDays}</label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={forecastDays}
                    onChange={(e) => setForecastDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3</span>
                    <span>30</span>
                  </div>
                </div>
              </>
            )}

            {/* YIELD (ONLY months) */}
            {activeTab === "yield" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Months: {yieldMonths}</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={yieldMonths}
                  onChange={(e) => {
                    setYieldMonths(parseInt(e.target.value));
                    setYieldResult(null); // go back to preview until user predicts
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>12</span>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              onClick={activeTab === "yield" ? handleYieldPrediction : generateForecast}
              disabled={isLoading}
              className="w-full mt-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  {activeTab === "yield" ? "Predict Yield" : "Generate Forecast"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary cards (Price-like) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* PRICE */}
            {activeTab === "price" && priceResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Predicted Price</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {priceResult.predicted_price?.toFixed(2) || "N/A"}</p>
                    <p className="text-xs text-gray-400">per kg</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <TrendIcon trend={getPriceTrend()} />
                  <span className="text-sm text-gray-600">
                    {getPriceTrend() === "up" ? "Price trending up" : getPriceTrend() === "down" ? "Price trending down" : "Price stable"}
                  </span>
                </div>
              </div>
            )}

            {/* DEMAND */}
            {activeTab === "demand" && demandResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Predicted Demand</p>
                    <p className="text-2xl font-bold text-blue-600">{demandResult.predicted_demand?.toFixed(0) || "N/A"}</p>
                    <p className="text-xs text-gray-400">tonnes</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Package className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <TrendIcon trend={getDemandTrend()} />
                  <span className="text-sm text-gray-600">
                    {getDemandTrend() === "up" ? "Demand increasing" : getDemandTrend() === "down" ? "Demand decreasing" : "Demand stable"}
                  </span>
                </div>
              </div>
            )}

            {/* YIELD (NEW) */}
            {activeTab === "yield" && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{yieldResult ? "Predicted Avg Yield" : "Preview Avg Yield"}</p>
                      <p className="text-2xl font-bold text-emerald-600">{yieldSummary ? yieldSummary.avg.toFixed(0) : "—"}</p>
                      <p className="text-xs text-gray-400">ha</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <Leaf className="text-emerald-600" size={24} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {yieldResult ? "Based on ML model forecast" : "Preview (click Predict Yield to run model)"}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Trend</p>
                  <p className="text-2xl font-bold text-gray-800">{yieldSummary?.trend ?? "—"}</p>
                  <p className="text-xs text-gray-400">Across {yieldMonths} months</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Forecast Period</p>
                      <p className="text-xl font-bold text-gray-800">{yieldMonths} Months</p>
                      <p className="text-xs text-gray-400">Starting this month</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Calendar className="text-gray-600" size={24} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Shared cards for price/demand only */}
            {(activeTab === "price" || activeTab === "demand") && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Selected Crop</p>
                      <p className="text-xl font-bold text-gray-800">{selectedCrop}</p>
                      <p className="text-xs text-gray-400">{season.replace(/_/g, " ")}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Leaf className="text-gray-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Forecast Period</p>
                      <p className="text-xl font-bold text-gray-800">{forecastDays} Days</p>
                      <p className="text-xs text-gray-400">Starting today</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Calendar className="text-gray-600" size={24} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Charts */}
          {(activeTab === "price" || activeTab === "demand") && forecastData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4">
                {activeTab === "price" ? "Price Forecast Chart" : "Demand Forecast Chart"}
              </h3>

              {activeTab === "price" ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      formatter={(v) => [`Rs. ${Number(v).toFixed(2)}`, "Price"]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      name="Predicted Price (LKR)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      formatter={(v) => [`${Number(v).toFixed(0)} tonnes`, "Demand"]}
                    />
                    <Legend />
                    <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Predicted Demand (tonnes)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* Yield Chart (NEW: big clean chart like price section) */}
          {activeTab === "yield" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Yield Forecast Chart</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    yieldResult ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {yieldResult ? "Model Prediction" : "Preview"}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={yieldChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    formatter={(v) => [`${Number(v).toFixed(0)} ha`, "Yield"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="yield"
                    fill="#22c55e" // green after predict, gray before
                    radius={[4, 4, 0, 0]}
                    name={yieldResult ? "Predicted Yield (ha)" : "Preview Yield (ha)"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Model Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Brain className="text-purple-600" size={20} />
              About the ML Model
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700">Algorithm</h4>
                <p className="text-gray-600">Random Forest Regressor</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Training Data</h4>
                <p className="text-gray-600">Historical market prices & agricultural data</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Yield Features</h4>
                <p className="text-gray-600">Year, month, season code, crop code, lag yields</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Update Frequency</h4>
                <p className="text-gray-600">Retrain when new monthly data is added</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
