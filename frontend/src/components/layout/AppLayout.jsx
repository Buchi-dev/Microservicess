import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Badge, 
  Button, 
  Drawer, 
  Space, 
  Avatar, 
  Dropdown 
} from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        {
          key: 'orders',
          icon: <FileTextOutlined />,
          label: <Link to="/orders">Orders</Link>,
        },
        ...(user && user.role === 'admin' ? [
          {
            key: 'admin-dashboard',
            icon: <AppstoreOutlined />,
            label: <Link to="/admin">Admin Dashboard</Link>,
          },
          {
            key: 'admin-products',
            icon: <AppstoreOutlined />,
            label: <Link to="/admin/products">Manage Products</Link>,
          }
        ] : []),
        {
          type: 'divider'
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogout,
        }
      ]}
    />
  );

  const mainMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'wishlist',
      icon: <HeartOutlined />,
      label: <Link to="/wishlist">Wishlist</Link>,
    },
    {
      key: 'cart',
      icon: (
        <Badge count={totalItems} size="small" offset={[10, 0]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: <Link to="/cart">Cart</Link>,
    },
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
            Microservices eCommerce
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            items={mainMenuItems}
            style={{ minWidth: 500 }}
          />
        </div>
        
        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button type="text" icon={<Avatar icon={<UserOutlined />} />} style={{ color: 'white' }}>
                {user.name}
              </Button>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" icon={<LoginOutlined />} style={{ color: 'white' }}>
                <Link to="/login">Login</Link>
              </Button>
              <Button type="primary">
                <Link to="/register">Register</Link>
              </Button>
            </Space>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            style={{ color: 'white', marginLeft: 16 }}
          />
        </div>
        
        {/* Mobile Menu Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={250}
        >
          <Menu mode="vertical" items={mainMenuItems} />
          {!user && (
            <Menu 
              mode="vertical" 
              items={[
                {
                  key: 'login',
                  icon: <LoginOutlined />,
                  label: <Link to="/login">Login</Link>,
                },
                {
                  key: 'register',
                  icon: <UserOutlined />,
                  label: <Link to="/register">Register</Link>,
                }
              ]}
            />
          )}
          {user && (
            <Menu 
              mode="vertical"
              items={[
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: <Link to="/profile">Profile</Link>,
                },
                {
                  key: 'orders',
                  icon: <FileTextOutlined />,
                  label: <Link to="/orders">Orders</Link>,
                },
                ...(user.role === 'admin' ? [
                  {
                    key: 'admin-dashboard',
                    icon: <AppstoreOutlined />,
                    label: <Link to="/admin">Admin Dashboard</Link>,
                  },
                  {
                    key: 'admin-products',
                    icon: <AppstoreOutlined />,
                    label: <Link to="/admin/products">Manage Products</Link>,
                  }
                ] : []),
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: handleLogout,
                }
              ]}
            />
          )}
        </Drawer>
      </Header>
      
      <Content style={{ padding: '0 50px', marginTop: 16 }}>
        <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
          <Outlet />
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Microservices eCommerce ©{new Date().getFullYear()} Created with React & Node.js
      </Footer>
    </Layout>
  );
};

export default AppLayout; 