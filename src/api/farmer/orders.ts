import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchFarmerOrders = async (farmerId) => {
  const response = await axios.get(
    `${API_BASE}/order/farmer/${farmerId}/`
  );
  return response.data;
};
