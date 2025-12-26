import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/marketplace";

export const updateCrop = async (marketId: number, data: any) => {
  try {
    const res = await axios.patch(`${BASE_URL}/${marketId}/`, data);
    return res.data;
  } catch (error: any) {
    console.error("Update crop error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCrop = async (marketId: number) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${marketId}/`);
    return res.data;
  } catch (error: any) {
    console.error("Delete crop error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCrops = async () => {
  try {
    const res = await axios.get(BASE_URL + "/");
    return res.data;
  } catch (error: any) {
    console.error("Fetch crops error:", error.response?.data || error.message);
    throw error;
  }
};
