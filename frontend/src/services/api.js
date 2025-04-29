import axios from 'axios';

// Get API URLs from environment variables or use defaults
const API_URL_USER = import.meta.env.VITE_API_USER_URL || 'http://localhost:3001';
const API_URL_PRODUCT = import.meta.env.VITE_API_PRODUCT_URL || 'http://localhost:3002';
const API_URL_ORDER = import.meta.env.VITE_API_ORDER_URL || 'http://localhost:3003';
const API_URL_PAYMENT = import.meta.env.VITE_API_PAYMENT_URL || 'http://localhost:3004';

// Create API instances for each service
export const userApi = axios.create({
  baseURL: API_URL_USER,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = axios.create({
  baseURL: API_URL_PRODUCT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderApi = axios.create({
  baseURL: API_URL_ORDER,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paymentApi = axios.create({
  baseURL: API_URL_PAYMENT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
const addAuthToken = (api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Apply the interceptor to all APIs
addAuthToken(userApi);
addAuthToken(productApi);
addAuthToken(orderApi);
addAuthToken(paymentApi); 