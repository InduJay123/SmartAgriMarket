import api from "../api";

export const fetchCrops = async () => {
  try {
    const res = await api.get("/marketplace/");
    return res.data;
  } catch (error: any) {
    console.error("Fetch crops error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCrop = async (marketId: number, data: any) => {
  try {
    const res = await api.patch(`/marketplace/${marketId}/`, data);
    return res.data;
  } catch (error: any) {
    console.error("Update crop error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCrop = async (marketId: number) => {
  try {
    const res = await api.delete(`/marketplace/${marketId}/`);
    return res.data;
  } catch (error: any) {
    console.error("Delete crop error:", error.response?.data || error.message);
    throw error;
  }
};