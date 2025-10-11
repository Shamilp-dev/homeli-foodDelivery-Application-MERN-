// src/types/index.ts - TypeScript interfaces for the app

export interface FoodItem {
  _id?: string;
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'dessert';
  description?: string;
  isAvailable?: boolean;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  isActive?: boolean;
  dbCategory?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  _id?: string;
  user: string | User;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  paymentMethod?: 'cash' | 'card' | 'upi';
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryType = 'breakfast' | 'lunch' | 'dinner' | 'more' | 'snacks' | 'icecream';