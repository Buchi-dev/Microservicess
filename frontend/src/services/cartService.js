import { orderApi } from './api';

export const cartService = {
  getCartItems: async () => {
    try {
      const response = await orderApi.get('/api/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  addCartItem: async (cartItem) => {
    try {
      const response = await orderApi.post('/api/cart', cartItem);
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await orderApi.put(`/api/cart/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const response = await orderApi.delete(`/api/cart/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await orderApi.delete('/api/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
}; 