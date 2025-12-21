import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000/api";
const userId = 1;

// Get buyer profile
export const getBuyerProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE}/buyer/profile/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    return null;
  }
};

// Update buyer profile
export const updateBuyerProfile = async (data: any) => {
  try {
    const response = await axios.put(`${API_BASE}/buyer/profile/${userId}/update/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating buyer profile:", error);
    return null;
  }
};