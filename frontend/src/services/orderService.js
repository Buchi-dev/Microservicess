import { orderApi } from './api';

export const orderService = {
  getOrders: async () => {
    try {
      const response = await orderApi.get('/api/orders');
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
  
  updateOrderStatus: async (id, status) => {
    try {
      const response = await orderApi.patch(`/api/orders/${id}/status`, { status });
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
  }
}; 