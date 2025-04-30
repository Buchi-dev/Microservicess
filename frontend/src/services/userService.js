import { userApi } from './api';

export const userService = {
  // Get currently logged in user
  getCurrentUser: async () => {
    try {
      return await userApi.get('/api/auth/me');
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      return await userApi.post('/api/auth/login', credentials);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      return await userApi.post('/api/auth/register', userData);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      return await userApi.put('/api/users/profile', userData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  getUsers: async (params = {}) => {
    try {
      return await userApi.get('/api/users', { params });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID (admin only)
  getUser: async (id) => {
    try {
      return await userApi.get(`/api/users/${id}`);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Update user (admin only)
  updateUser: async (id, userData) => {
    try {
      return await userApi.put(`/api/users/${id}`, userData);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    try {
      return await userApi.delete(`/api/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
  
  // Change user password
  changePassword: async (passwordData) => {
    try {
      return await userApi.put('/api/users/password', passwordData);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}; 