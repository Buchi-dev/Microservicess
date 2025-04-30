import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table, 
  Button, 
  Statistic, 
  Tabs, 
  Spin, 
  message,
  Badge,
  Select,
  Popconfirm,
  Form,
  Input
} from 'antd';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  ReloadOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryForm] = Form.useForm();
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Redirect if user is not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics
      const metricsPromises = [
        productService.getProducts({ limit: 1 }),
        userService.getUsers({ limit: 1 }),
        orderService.getOrders({ limit: 1 }),
        orderService.getRevenue()
      ];
      
      const [productsRes, usersRes, ordersRes, revenueRes] = await Promise.all(metricsPromises);
      
      setMetrics({
        totalProducts: productsRes.data.total || 0,
        totalUsers: usersRes.data.total || 0,
        totalOrders: ordersRes.data.total || 0,
        totalRevenue: revenueRes.data.revenue || 0
      });
      
      // Fetch recent orders
      const recentOrdersRes = await orderService.getOrders({ limit: 5, sort: '-createdAt' });
      setRecentOrders(recentOrdersRes.data.data || []);
      
      // Fetch recent users
      const recentUsersRes = await userService.getUsers({ limit: 5, sort: '-createdAt' });
      setRecentUsers(recentUsersRes.data.data || []);
      
      // Fetch categories
      const categoriesRes = await productService.getCategories();
      setCategories(categoriesRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    message.success('Dashboard data refreshed');
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, { status });
      message.success(`Order status updated to ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      await productService.createCategory(values.name);
      message.success('Category created successfully');
      categoryForm.resetFields();
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating category:', error);
      message.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (values) => {
    try {
      await productService.updateCategory(editingCategoryId, values.name);
      message.success('Category updated successfully');
      setEditingCategoryId(null);
      categoryForm.resetFields();
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await productService.deleteCategory(categoryId);
      message.success('Category deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category');
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: id => <Text ellipsis style={{ maxWidth: 150 }}>{id}</Text>
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: user => user?.name || 'Unknown'
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: amount => `$${amount.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        if (status === 'completed') color = 'green';
        if (status === 'cancelled') color = 'red';
        return <Badge color={color} text={status} />;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/orders/${record._id}`)}
          >
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleUpdateOrderStatus(record._id, value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
      )
    }
  ];

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => navigate(`/admin/users/${record._id}`)}
        >
          View
        </Button>
      )
    }
  ];

  const categoryColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Products Count',
      dataIndex: 'count',
      key: 'count',
      render: (_, record) => record.count || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size="small" 
            type="primary"
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingCategoryId(record.id);
              categoryForm.setFieldsValue({ name: record.name });
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  const formattedCategories = categories.map(category => ({
    id: category,
    name: category,
    key: category
  }));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <Title level={2}>Admin Dashboard</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </div>

      {/* Metrics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={metrics.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/products">Manage Products</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={metrics.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/users">Manage Users</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={metrics.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/orders">Manage Orders</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
              title="Total Revenue"
              value={metrics.totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/sales">View Sales Report</Link>
            </div>
            </Card>
          </Col>
      </Row>
      
      {/* Tabs Section */}
      <Card>
        <Tabs defaultActiveKey="orders">
          <TabPane tab="Recent Orders" key="orders">
            <Table 
              columns={orderColumns} 
              dataSource={recentOrders} 
              rowKey="_id" 
              pagination={false}
              scroll={{ x: true }}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Link to="/admin/orders">
                <Button type="primary">View All Orders</Button>
              </Link>
              </div>
          </TabPane>
          
          <TabPane tab="Recent Users" key="users">
            <Table 
              columns={userColumns} 
              dataSource={recentUsers} 
              rowKey="_id" 
              pagination={false}
              scroll={{ x: true }}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Link to="/admin/users">
                <Button type="primary">View All Users</Button>
              </Link>
            </div>
          </TabPane>
          
          <TabPane tab="Categories" key="categories">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title={editingCategoryId ? "Edit Category" : "Add Category"}>
                  <Form
                    form={categoryForm}
                    onFinish={editingCategoryId ? handleUpdateCategory : handleCreateCategory}
                    layout="vertical"
                  >
                    <Form.Item
                      name="name"
                      label="Category Name"
                      rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                      <Input placeholder="Enter category name" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {editingCategoryId ? "Update Category" : "Add Category"}
                      </Button>
                      {editingCategoryId && (
                        <Button 
                          style={{ marginLeft: 8 }} 
                          onClick={() => {
                            setEditingCategoryId(null);
                            categoryForm.resetFields();
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
            </Card>
          </Col>
              <Col xs={24} md={12}>
                <Table 
                  columns={categoryColumns} 
                  dataSource={formattedCategories} 
                  rowKey="id" 
                  pagination={false}
                />
              </Col>
      </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboardPage; 