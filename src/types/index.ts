
export type UserRole = 'customer' | 'restaurant_owner' | 'admin' | 'delivery_partner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  addresses?: Address[];
  phone?: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_address: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  owner_id: string;
  description: string;
  cuisine_type: string[];
  address: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  closing_hours: string;
  rating: number;
  price_range: 1 | 2 | 3 | 4;
  delivery_time: number;
  featured_image: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  calories?: number;
  ingredients?: string[];
  is_available: boolean;
  featured: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Cart {
  restaurant_id: string;
  restaurant_name: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant?: Restaurant;
  address_id: string;
  address?: Address;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: 'card' | 'cash' | 'upi';
  payment_status: 'pending' | 'paid' | 'failed';
  delivery_partner_id?: string;
  placed_at: string;
  estimated_delivery_time?: string;
  delivered_at?: string;
  is_complete?: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  order_id: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface FilterOptions {
  cuisine_type?: string[];
  price_range?: number[];
  rating?: number;
  is_vegetarian?: boolean;
  delivery_time?: number;
  sort_by?: 'rating' | 'delivery_time' | 'price_low_to_high' | 'price_high_to_low';
}
