import axios from "axios";
import type { Product } from "../@types/Product";

const API_BASE = "http://127.0.0.1:8000/api"; // Replace with your backend URL

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_BASE}/products/`);
  console.log("Fetched raw data:", response.data);
  return response.data; // Backend should return an array of products
};
