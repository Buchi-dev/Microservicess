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

  getCategories: async () => {
    try {
      return await productApi.get('/api/products/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      return await productApi.get('/api/products', { 
        params: { category } 
      });
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },

  // Category management methods
  createCategory: async (name) => {
    try {
      return await productApi.post('/api/products/categories', { name });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, newName) => {
    try {
      return await productApi.put(`/api/products/categories/${id}`, { name: newName });
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      return await productApi.delete(`/api/products/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  getCategoryProducts: async (categoryId, params = {}) => {
    try {
      return await productApi.get(`/api/products/categories/${categoryId}/products`, { params });
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },
  
  bulkUpdateProductCategories: async (productIds, categoryId) => {
    try {
      return await productApi.post('/api/products/bulk-update-category', { 
        productIds, 
        categoryId 
      });
    } catch (error) {
      console.error('Error bulk updating product categories:', error);
      throw error;
    }
  },
  
  uploadCategoryImage: async (categoryId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      return await productApi.post(`/api/products/categories/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error(`Error uploading image for category ${categoryId}:`, error);
      throw error;
    }
  }
}; 