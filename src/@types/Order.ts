export interface Order {
  order_id: number;
  market_id: number;
  buyer_id: number;
  quantity: number;
  price_at_order: string;
  total_amount: string;
  status: "pending" | "accepted" | "shipped" | "delivered" | "cancelled";
  full_name: string;
  phone: string;
  address: string;
  city: string;
  created_at: string;
}
