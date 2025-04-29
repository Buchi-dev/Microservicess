import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Button, 
  message 
} from 'antd';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  const adminCards = [
    {
      title: 'Product Management',
      icon: <AppstoreOutlined style={{ fontSize: '36px', color: '#1890ff' }} />,
      description: 'Add, edit, or remove products from the catalog',
      link: '/admin/products',
      color: '#e6f7ff'
    },
    {
      title: 'Order Management',
      icon: <FileTextOutlined style={{ fontSize: '36px', color: '#52c41a' }} />,
      description: 'View and manage customer orders',
      link: '/admin/orders',
      color: '#f6ffed'
    },
    {
      title: 'User Management',
      icon: <UserOutlined style={{ fontSize: '36px', color: '#faad14' }} />,
      description: 'Manage user accounts and permissions',
      link: '/admin/users',
      color: '#fffbe6'
    },
    {
      title: 'Category Management',
      icon: <TagOutlined style={{ fontSize: '36px', color: '#eb2f96' }} />,
      description: 'Manage product categories',
      link: '/admin/categories',
      color: '#fff0f6'
    }
  ];

  // Mock statistics - in a real app, you'd fetch these from the backend
  const statistics = [
    {
      title: 'Total Products',
      value: 120,
      icon: <ShoppingOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Total Users',
      value: 843,
      icon: <UserOutlined />,
      color: '#faad14'
    },
    {
      title: 'Total Orders',
      value: 592,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Total Revenue',
      value: 34567,
      icon: <DollarOutlined />,
      color: '#eb2f96',
      prefix: '$'
    }
  ];

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="admin-dashboard-page">
      <Title level={2}>Admin Dashboard</Title>
      
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statistics.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix ? stat.prefix : stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Admin Tools */}
      <Title level={3}>Admin Tools</Title>
      <Row gutter={[16, 16]}>
        {adminCards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: card.color
              }}
              bodyStyle={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                {card.icon}
                <Title level={4} style={{ marginTop: '8px', textAlign: 'center' }}>{card.title}</Title>
              </div>
              <p style={{ flexGrow: 1 }}>{card.description}</p>
              <Link to={card.link}>
                <Button type="primary" block>
                  Manage
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboardPage; 