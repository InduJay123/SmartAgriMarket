import axios from "axios";

const ML_API_BASE = "http://127.0.0.1:8000/api/ml";

// Types for ML API requests and responses
export interface PricePredictionRequest {
  crop_type: string;
  season: string;
  supply: number;
  demand: number;
  market_trend: string;
}

export interface PricePredictionResponse {
  prediction_type: string;
  crop_type: string;
  predicted_price: number;
  currency: string;
  confidence: number;
  model_accuracy: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
}

export interface DemandPredictionRequest {
  crop_type: string;
  year?: number;
  month?: number;
}

export interface DemandPredictionResponse {
  prediction_type: string;
  crop_type: string;
  predicted_demand: number;
  unit: string;
  confidence: number;
  model_accuracy: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
}

export interface YieldPredictionRequest {
  crop_type: string;
  rainfall: number;
  temperature: number;
  soil_quality: string;
  fertilizer: number;
  irrigation: boolean;
}

export interface YieldPredictionResponse {
  prediction_type: string;
  crop_type: string;
  predicted_yield: number;
  unit: string;
  confidence?: number;
  model_accuracy?: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
}

export interface ForecastDataPoint {
  date: string;
  predicted_price: number;
  product: string;
}

export interface PredictionHistory {
  id: number;
  prediction_type: string;
  crop_name: string;
  input_features: Record<string, unknown>;
  predicted_value: number;
  confidence: number;
  created_at: string;
  updated_at: string;
}

// Price Prediction API
export const predictPrice = async (
  data: PricePredictionRequest
): Promise<PricePredictionResponse> => {
  const response = await axios.post(`${ML_API_BASE}/predict/price/`, data);
  return response.data;
};

// Demand Prediction API
export const predictDemand = async (
  data: DemandPredictionRequest
): Promise<DemandPredictionResponse> => {
  const response = await axios.post(`${ML_API_BASE}/predict/demand/`, data);
  return response.data;
};

// Yield Prediction API
export const predictYield = async (
  data: YieldPredictionRequest
): Promise<YieldPredictionResponse> => {
  const response = await axios.post(`${ML_API_BASE}/predict/yield/`, data);
  return response.data;
};

// Get Prediction History
export const getPredictionHistory = async (): Promise<PredictionHistory[]> => {
  const response = await axios.get(`${ML_API_BASE}/history/`);
  return response.data;
};

// Get Prediction History by Type
export const getPredictionHistoryByType = async (
  type: "price" | "demand" | "yield"
): Promise<PredictionHistory[]> => {
  const response = await axios.get(`${ML_API_BASE}/history/by_type/?type=${type}`);
  return response.data;
};

// Get Prediction History by Crop
export const getPredictionHistoryByCrop = async (
  cropName: string
): Promise<PredictionHistory[]> => {
  const response = await axios.get(`${ML_API_BASE}/history/by_crop/?crop=${cropName}`);
  return response.data;
};

// Helper function to generate forecast data for multiple days
export const generatePriceForecast = async (
  cropType: string,
  days: number = 7
): Promise<ForecastDataPoint[]> => {
  const forecasts: ForecastDataPoint[] = [];
  const today = new Date();

  // Get current season based on month
  const month = today.getMonth();
  const season = getSeason(month);

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);

    try {
      // Simulate varying market conditions for each day
      const response = await predictPrice({
        crop_type: cropType,
        season: season,
        supply: 1000 + Math.random() * 500, // Simulated supply variation
        demand: 1200 + Math.random() * 400, // Simulated demand variation
        market_trend: getMarketTrend(i),
      });

      forecasts.push({
        date: forecastDate.toISOString().split("T")[0],
        predicted_price: response.predicted_price,
        product: cropType,
      });
    } catch (error) {
      console.error(`Error predicting price for day ${i}:`, error);
      // Add fallback data point
      forecasts.push({
        date: forecastDate.toISOString().split("T")[0],
        predicted_price: 0,
        product: cropType,
      });
    }
  }

  return forecasts;
};

// Helper function to get season based on month (Sri Lanka seasons)
const getSeason = (month: number): string => {
  if (month >= 2 && month <= 4) return "first_inter_monsoon"; // March-May
  if (month >= 5 && month <= 8) return "southwest_monsoon"; // June-September
  if (month >= 9 && month <= 10) return "second_inter_monsoon"; // October-November
  return "northeast_monsoon"; // December-February
};

// Helper function to simulate market trend
const getMarketTrend = (dayIndex: number): string => {
  const trends = ["stable", "increasing", "decreasing"];
  return trends[dayIndex % 3];
};

// Available crops for prediction
export const AVAILABLE_CROPS = [
  "Tomato",
  "Potato",
  "Carrot",
  "Cabbage",
  "Onion",
  "Brinjal",
  "Beans",
  "Pumpkin",
  "Cucumber",
  "Capsicum",
  "Leeks",
  "Beetroot",
  "Radish",
  "Cauliflower",
  "Spinach",
  "Lettuce",
];

// Market trend options
export const MARKET_TRENDS = [
  { value: "stable", label: "Stable" },
  { value: "increasing", label: "Increasing" },
  { value: "decreasing", label: "Decreasing" },
];

// Season options (Sri Lanka)
export const SEASONS = [
  { value: "northeast_monsoon", label: "Northeast Monsoon (Dec-Feb)" },
  { value: "first_inter_monsoon", label: "First Inter Monsoon (Mar-May)" },
  { value: "southwest_monsoon", label: "Southwest Monsoon (Jun-Sep)" },
  { value: "second_inter_monsoon", label: "Second Inter Monsoon (Oct-Nov)" },
];

// Consumption trend options
export const CONSUMPTION_TRENDS = [
  { value: "stable", label: "Stable" },
  { value: "increasing", label: "Increasing" },
  { value: "decreasing", label: "Decreasing" },
  { value: "seasonal_peak", label: "Seasonal Peak" },
  { value: "seasonal_low", label: "Seasonal Low" },
];

// Soil quality options
export const SOIL_QUALITIES = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "poor", label: "Poor" },
];
