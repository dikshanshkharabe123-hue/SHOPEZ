import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getItems();
      const { cartItems, total } = response.data;
      setCartItems(cartItems);
      setTotal(total);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData) => {
    try {
      const response = await cartAPI.addItem(productData);
      await fetchCartItems(); // Refresh cart
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, quantity);
      await fetchCartItems(); // Refresh cart
      return { success: true, message: 'Cart updated' };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCartItems(); // Refresh cart
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setTotal(0);
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
  };

  const value = {
    cartItems,
    loading,
    total,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCartItems,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};