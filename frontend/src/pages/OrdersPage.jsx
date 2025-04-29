import { useState, useEffect } from 'react';
import { Typography, Table, Tag, Space, Card, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

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
  },
  {
    id: 'ORD45678901',
    date: '2023-06-22',
    total: 199.95,
    status: 'Shipped',
    items: 2
  },
  {
    id: 'ORD56789012',
    date: '2023-05-15',
    total: 89.99,
    status: 'Delivered',
    items: 1
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    {
      title: 'Order #',
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
      render: status => {
        let color = 'blue';
        if (status === 'Delivered') {
          color = 'green';
        } else if (status === 'Shipped') {
          color = 'cyan';
        } else if (status === 'Cancelled') {
          color = 'red';
        }
        
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/orders/${record.id}`}>
            <Button type="link" size="small">View Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>My Orders</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Card>
          <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default OrdersPage; 