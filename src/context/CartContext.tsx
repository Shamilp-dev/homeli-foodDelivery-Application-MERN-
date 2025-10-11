import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';

interface CartItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalAmount: number;
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (foodItemId: string, quantity: number) => Promise<void>;
  removeItem: (foodItemId: string) => Promise<void>;
  loadCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userId = 'guest';

  const loadCart = async () => {
    try {
      const response = await apiService.getCart(userId);
      if (response.success && response.data) {
        setCartItems(response.data.items || []);
        setTotalAmount(response.data.totalAmount || 0);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (item: any) => {
    try {
      const response = await apiService.addToCart(userId, {
        foodItemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
      
      if (response.success && response.data) {
        setCartItems(response.data.items || []);
        setTotalAmount(response.data.totalAmount || 0);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (foodItemId: string, quantity: number) => {
    try {
      const response = await apiService.updateCartQuantity(userId, foodItemId, quantity);
      if (response.success && response.data) {
        setCartItems(response.data.items || []);
        setTotalAmount(response.data.totalAmount || 0);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (foodItemId: string) => {
    try {
      const response = await apiService.removeFromCart(userId, foodItemId);
      if (response.success && response.data) {
        setCartItems(response.data.items || []);
        setTotalAmount(response.data.totalAmount || 0);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = () => {
  setCartItems([]);
  setTotalAmount(0);
  console.log('Cart cleared successfully'); // optional
};

  useEffect(() => {
    loadCart();
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      totalAmount,
      addToCart,
      updateQuantity,
      removeItem,
      loadCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};