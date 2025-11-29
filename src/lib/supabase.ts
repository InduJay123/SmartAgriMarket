export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image_url: string;
  description: string;
  farmer_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    category: 'vegetables',
    price: 2.99,
    unit: 'kg',
    stock: 50,
    image_url: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    description: 'Fresh, ripe organic tomatoes sourced directly from local farmers',
    farmer_id: 'farmer1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Fresh Carrots',
    category: 'vegetables',
    price: 1.99,
    unit: 'kg',
    stock: 60,
    image_url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    description: 'Crispy orange carrots packed with nutrients',
    farmer_id: 'farmer2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Green Lettuce',
    category: 'vegetables',
    price: 2.49,
    unit: 'head',
    stock: 40,
    image_url: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    description: 'Tender green lettuce perfect for salads',
    farmer_id: 'farmer1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Apples',
    category: 'fruits',
    price: 3.99,
    unit: 'kg',
    stock: 45,
    image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    description: 'Juicy and sweet apples picked fresh',
    farmer_id: 'farmer3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Bananas',
    category: 'fruits',
    price: 1.49,
    unit: 'kg',
    stock: 70,
    image_url: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
    description: 'Golden ripe bananas full of potassium',
    farmer_id: 'farmer2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Strawberries',
    category: 'fruits',
    price: 4.99,
    unit: 'kg',
    stock: 35,
    image_url: 'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg',
    description: 'Fresh red strawberries loaded with flavor',
    farmer_id: 'farmer1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Bell Peppers',
    category: 'vegetables',
    price: 2.99,
    unit: 'kg',
    stock: 50,
    image_url: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg',
    description: 'Colorful bell peppers packed with vitamins',
    farmer_id: 'farmer3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Potatoes',
    category: 'vegetables',
    price: 1.49,
    unit: 'kg',
    stock: 80,
    image_url: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg',
    description: 'Earthy potatoes ideal for all your cooking needs',
    farmer_id: 'farmer2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
