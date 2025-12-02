export interface Product {
  market_id: number;
  farmer_id: number;
  crop: {
    crop_id: number;
    crop_name?: string | null;
    description?: string | null;
    image?: string | null;
    category?: string | null;
  };
  price: number;
  unit: string;
  predicted_date: string;
  quantity: number;
  farming_method?: string | null;
  region?: string | null;
  district?: string | null;
  image?: string | null;
  status?: string | null;
}