import { productApi } from './api';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      return await productApi.get('/api/products', { params });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      return await productApi.get(`/api/products/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      return await productApi.post('/api/products', productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      return await productApi.put(`/api/products/${id}`, productData);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      return await productApi.delete(`/api/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      return await productApi.get('/api/products/search', { 
        params: { query } 
      });
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      return await productApi.get('/api/products/category', { 
        params: { category } 
      });
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  }
}; 