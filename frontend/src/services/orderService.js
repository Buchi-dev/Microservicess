import { orderApi } from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    try {
      const response = await orderApi.get('/api/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  getOrder: async (id) => {
    try {
      const response = await orderApi.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await orderApi.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await orderApi.patch(`/api/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },
  
  cancelOrder: async (id) => {
    try {
      const response = await orderApi.post(`/api/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await orderApi.delete(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await orderApi.patch(`/api/orders/${id}/payment`, { paymentStatus });
      return response.data;
    } catch (error) {
      console.error(`Error updating payment status for order ${id}:`, error);
      throw error;
    }
  },

  getOrdersByDateRange: async (startDate, endDate) => {
    try {
      const response = await orderApi.get('/api/orders', { 
        params: { startDate, endDate } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  },

  getOrdersByStatus: async (status) => {
    try {
      const response = await orderApi.get('/api/orders', { 
        params: { status } 
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  },

  getOrdersByUser: async (userId) => {
    try {
      const response = await orderApi.get('/api/orders', { 
        params: { userId } 
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  },

  getRevenue: async (params = {}) => {
    try {
      const response = await orderApi.get('/api/orders/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },

  exportOrders: async (params = {}) => {
    try {
      const response = await orderApi.get('/api/orders/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }
}; 