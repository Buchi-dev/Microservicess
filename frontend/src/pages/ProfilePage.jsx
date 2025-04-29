import { useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Tabs, 
  Table, 
  Tag, 
  Space, 
  Descriptions,
  message,
  Row,
  Col
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock order data
const mockOrders = [
  {
    id: 'ORD12345678',
    date: '2023-09-15',
    total: 299.97,
    status: 'Delivered',
    items: 3
  },
  {
    id: 'ORD23456789',
    date: '2023-08-28',
    total: 149.99,
    status: 'Processing',
    items: 1
  },
  {
    id: 'ORD34567890',
    date: '2023-07-10',
    total: 59.98,
    status: 'Delivered',
    items: 2
  }
];

// Mock address data
const mockAddress = {
  fullName: 'John Doe',
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'United States',
  phone: '(555) 123-4567'
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleUpdateProfile = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      message.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };
  
  const handleChangePassword = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      message.success('Password changed successfully!');
      setLoading(false);
    }, 1000);
  };
  
  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: id => <Link to={`/orders/${id}`}>{id}</Link>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: amount => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Delivered' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/orders/${record.id}`}>View Details</Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>My Profile</Title>
      
      <Tabs defaultActiveKey="profile">
        <TabPane tab="Profile Information" key="profile">
          <Card>
            <Form
              layout="vertical"
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: '(555) 123-4567', // Mock data
              }}
              onFinish={handleUpdateProfile}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="Shipping Address" key="address">
          <Card>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{mockAddress.fullName}</Descriptions.Item>
              <Descriptions.Item label="Address Line 1">{mockAddress.addressLine1}</Descriptions.Item>
              <Descriptions.Item label="Address Line 2">{mockAddress.addressLine2}</Descriptions.Item>
              <Descriptions.Item label="City">{mockAddress.city}</Descriptions.Item>
              <Descriptions.Item label="State/Province">{mockAddress.state}</Descriptions.Item>
              <Descriptions.Item label="Postal Code">{mockAddress.postalCode}</Descriptions.Item>
              <Descriptions.Item label="Country">{mockAddress.country}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{mockAddress.phone}</Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 16 }}>
              <Button type="primary" icon={<EnvironmentOutlined />}>
                Edit Address
              </Button>
            </div>
          </Card>
        </TabPane>
        
        <TabPane tab="Change Password" key="password">
          <Card>
            <Form
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="Order History" key="orders">
          <Card>
            <Table 
              columns={orderColumns} 
              dataSource={mockOrders} 
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfilePage; 