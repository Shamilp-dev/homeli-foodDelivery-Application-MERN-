// src/services/orderService.ts
import axios from 'axios';

// Update this to match your backend URL
const API_URL = 'http://192.168.31.18:3000/api/orders';

export interface OrderItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderData {
  userId?: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: "upi" | "card" | "cod";
  paymentStatus: "pending" | "processing" | "completed" | "failed";
  orderStatus?: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  transactionId?: string;
  upiId?: string;
  cardLast4?: string;
}

export interface PaymentUpdate {
  paymentStatus: "pending" | "processing" | "completed" | "failed" | string;
  paymentMethod?: "cod" | "upi" | "card"; // add this
  transactionId?: string;
  upiId?: string;
  cardLast4?: string;
}

/**
 * Create a new order
 */
export const createOrder = async (orderData: OrderData): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderData);
    
    if (response.data.success) {
      console.log("Order created successfully:", response.data.order);
      return response.data.order;
    } else {
      throw new Error(response.data.message || "Failed to create order");
    }
  } catch (error: any) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

/**
 * Update payment information for an order
 */
export const updateOrderPayment = async (
  orderId: string,
  paymentData: PaymentUpdate
): Promise<void> => {
  try {
    const response = await axios.put(`${API_URL}/payment/${orderId}`, paymentData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update payment");
    }
    
    console.log("Payment updated successfully for order:", orderId);
  } catch (error: any) {
    console.error("Error updating payment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update payment");
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderData["orderStatus"],
  cancellationReason?: string
): Promise<void> => {
  try {
    const data: any = { orderStatus: status };
    if (cancellationReason) {
      data.cancellationReason = cancellationReason;
    }

    const response = await axios.put(`${API_URL}/status/${orderId}`, data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update order status");
    }
    
    console.log("Order status updated:", orderId, status);
  } catch (error: any) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update order status");
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    
    if (response.data.success) {
      return response.data.order;
    } else {
      throw new Error(response.data.message || "Order not found");
    }
  } catch (error: any) {
    console.error("Error getting order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get order");
  }
};
export interface CreateOrderResponse {
  success: boolean;
  order: {
    _id: string;
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    pincode: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    transactionId?: string;
    upiId?: string;
    cardLast4?: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

/**
 * Get all orders for a specific phone number
 */
export const getOrdersByPhone = async (phoneNumber: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/phone/${phoneNumber}`);
    
    if (response.data.success) {
      return response.data.orders;
    } else {
      throw new Error(response.data.message || "Failed to fetch orders");
    }
  } catch (error: any) {
    console.error("Error getting orders by phone:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get orders");
  }
};

/**
 * Get all orders for a specific user
 */
export const getOrdersByUser = async (userId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    
    if (response.data.success) {
      return response.data.orders;
    } else {
      throw new Error(response.data.message || "Failed to fetch orders");
    }
  } catch (error: any) {
    console.error("Error getting orders by user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get orders");
  }
};

/**
 * Get all orders with optional filtering (for admin)
 */
export const getAllOrders = async (
  status?: string,
  page: number = 1,
  limit: number = 100
): Promise<any> => {
  try {
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await axios.get(url);
    
    if (response.data.success) {
      return {
        orders: response.data.orders,
        total: response.data.total,
        count: response.data.count,
        page: response.data.page
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch orders");
    }
  } catch (error: any) {
    console.error("Error getting all orders:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get orders");
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (
  orderId: string,
  cancellationReason?: string
): Promise<void> => {
  try {
    const data: any = {};
    if (cancellationReason) {
      data.cancellationReason = cancellationReason;
    }

    const response = await axios.put(`${API_URL}/cancel/${orderId}`, data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to cancel order");
    }
    
    console.log("Order cancelled:", orderId);
  } catch (error: any) {
    console.error("Error cancelling order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Order cannot be cancelled at this stage");
  }
};