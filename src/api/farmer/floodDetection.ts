import api from "../api";

export interface FloodPredictionInput {
  district: string;
  rainfall_mm: number;
  river_level_m: number;
  soil_moisture_percent: number;
  temperature_celsius: number;
  humidity_percent: number;
  previous_flood_history: boolean;
  elevation_m: number;
  drainage_quality: "poor" | "moderate" | "good";
}

export interface FloodPredictionResult {
  risk_level: "low" | "moderate" | "high" | "critical";
  risk_score: number;
  probability: number;
  recommendations: string[];
  affected_crops: string[];
  predicted_date?: string;
  warning_message: string;
}

export interface FloodAlert {
  id: number;
  district: string;
  risk_level: string;
  risk_score: number;
  probability: number;
  warning_message: string;
  recommendations: string[];
  created_at: string;
  is_active: boolean;
}

export interface HistoricalFloodData {
  date: string;
  district: string;
  rainfall_mm: number;
  river_level_m: number;
  flood_occurred: boolean;
}

// Predict flood risk based on input parameters
export const predictFloodRisk = async (data: FloodPredictionInput): Promise<FloodPredictionResult> => {
  try {
    const res = await api.post("/flood-detection/predict/", data);
    return res.data;
  } catch (error: any) {
    console.error("Flood prediction error:", error.response?.data || error.message);
    throw error;
  }
};

// Get active flood alerts for farmer's region
export const getActiveFloodAlerts = async (): Promise<FloodAlert[]> => {
  try {
    const res = await api.get("/flood-detection/alerts/");
    return res.data;
  } catch (error: any) {
    console.error("Fetch flood alerts error:", error.response?.data || error.message);
    throw error;
  }
};

// Get flood alerts by district
export const getFloodAlertsByDistrict = async (district: string): Promise<FloodAlert[]> => {
  try {
    const res = await api.get(`/flood-detection/alerts/${district}/`);
    return res.data;
  } catch (error: any) {
    console.error("Fetch district alerts error:", error.response?.data || error.message);
    throw error;
  }
};

// Get historical flood data for analytics
export const getHistoricalFloodData = async (district?: string): Promise<HistoricalFloodData[]> => {
  try {
    const url = district 
      ? `/flood-detection/historical/?district=${district}` 
      : "/flood-detection/historical/";
    const res = await api.get(url);
    return res.data;
  } catch (error: any) {
    console.error("Fetch historical data error:", error.response?.data || error.message);
    throw error;
  }
};

// Get current weather data for a district
export const getCurrentWeatherData = async (district: string) => {
  try {
    const res = await api.get(`/flood-detection/weather/${district}/`);
    return res.data;
  } catch (error: any) {
    console.error("Fetch weather data error:", error.response?.data || error.message);
    throw error;
  }
};

// Subscribe to flood alerts for a region
export const subscribeToFloodAlerts = async (district: string) => {
  try {
    const res = await api.post("/flood-detection/subscribe/", { district });
    return res.data;
  } catch (error: any) {
    console.error("Subscribe to alerts error:", error.response?.data || error.message);
    throw error;
  }
};

// Get model information
export const getFloodModelInfo = async () => {
  try {
    const res = await api.get("/flood-detection/model-info/");
    return res.data;
  } catch (error: any) {
    console.error("Fetch model info error:", error.response?.data || error.message);
    throw error;
  }
};
