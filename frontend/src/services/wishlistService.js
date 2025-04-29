import { orderApi } from './api';

export const wishlistService = {
  getWishlistItems: async () => {
    try {
      const response = await orderApi.get('/api/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      throw error;
    }
  },

  addWishlistItem: async (productId) => {
    try {
      const response = await orderApi.post('/api/wishlist', { productId });
      return response.data;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      throw error;
    }
  },

  removeWishlistItem: async (productId) => {
    try {
      const response = await orderApi.delete(`/api/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      throw error;
    }
  },

  moveToCart: async (productId) => {
    try {
      const response = await orderApi.post(`/api/wishlist/${productId}/move-to-cart`);
      return response.data;
    } catch (error) {
      console.error('Error moving item to cart:', error);
      throw error;
    }
  },

  clearWishlist: async () => {
    try {
      const response = await orderApi.delete('/api/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  },
}; 