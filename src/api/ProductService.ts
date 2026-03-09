import type { Product } from "../@types/Product";
import api from "./api";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get("/marketplace/products/");
  console.log("Fetched raw data:", response.data);
  return response.data; 
};
