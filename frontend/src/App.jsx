import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/layout/AppLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrderManagementPage from './pages/OrderManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';

import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  // Helper function to check if user is admin
  const isAdmin = user && user.role === 'admin';

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route 
            path="checkout" 
            element={user ? <CheckoutPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="orders" 
            element={user ? <OrdersPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="orders/:id" 
            element={user ? <OrderDetailPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="admin" 
            element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="admin/products" 
            element={isAdmin ? <AdminProductsPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="admin/orders" 
            element={isAdmin ? <OrderManagementPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="admin/users" 
            element={isAdmin ? <UserManagementPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="admin/categories" 
            element={isAdmin ? <CategoryManagementPage /> : <Navigate to="/" replace />} 
          />
          
          {/* Auth Routes */}
          <Route path="login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
