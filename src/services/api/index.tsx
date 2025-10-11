// src/services/api/index.ts - API service layer for backend communication

import { FoodItem, ApiResponse } from '../../types';

const BASE_URL = 'http://192.168.31.18:3000'; // Your backend server URL

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Get all food items
  async getAllFoodItems(): Promise<ApiResponse<FoodItem[]>> {
    return this.makeRequest<FoodItem[]>('/api/food-items');
  }

  // Get food items by category
  async getFoodItemsByCategory(category: string): Promise<ApiResponse<FoodItem[]>> {
    return this.makeRequest<FoodItem[]>(`/api/food-items/category/${category.toLowerCase()}`);
  }

  // Search food items
  async searchFoodItems(query: string): Promise<ApiResponse<FoodItem[]>> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<FoodItem[]>(`/api/food-items?search=${encodedQuery}`);
  }

  // Get single food item
  async getFoodItem(id: string): Promise<ApiResponse<FoodItem>> {
    return this.makeRequest<FoodItem>(`/api/food-items/${id}`);
  }

  // Create new food item (admin only)
  async createFoodItem(foodItem: Omit<FoodItem, '_id'>): Promise<ApiResponse<FoodItem>> {
    return this.makeRequest<FoodItem>('/api/food-items', {
      method: 'POST',
      body: JSON.stringify(foodItem),
    });
  }

  // Update food item (admin only)
  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<ApiResponse<FoodItem>> {
    return this.makeRequest<FoodItem>(`/api/food-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete food item (admin only)
  async deleteFoodItem(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>(`/api/food-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Seed sample data (development only)
  async seedSampleData(): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/api/food-items/seed', {
      method: 'POST',
    });
  }

  // Test server connection
  async testConnection(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/api/test');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/health');
  }
  // Add these cart methods to your ApiService class

// Get cart
async getCart(userId: string = 'guest'): Promise<ApiResponse<any>> {
  return this.makeRequest<any>(`/api/cart/${userId}`);
}

// Add to cart
async addToCart(userId: string = 'guest', item: any): Promise<ApiResponse<any>> {
  return this.makeRequest<any>('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ userId, ...item }),
  });
}





// Update cart quantity
async updateCartQuantity(userId: string = 'guest', foodItemId: string, quantity: number): Promise<ApiResponse<any>> {
  return this.makeRequest<any>('/api/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ userId, foodItemId, quantity }),
  });
}

// Remove from cart
async removeFromCart(userId: string = 'guest', foodItemId: string): Promise<ApiResponse<any>> {
  return this.makeRequest<any>(`/api/cart/${userId}/${foodItemId}`, {
    method: 'DELETE',
  });
}
}

export const apiService = new ApiService();
export default apiService;