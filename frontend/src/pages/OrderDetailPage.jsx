import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Descriptions, 
  Table, 
  Button, 
  Tag, 
  Steps, 
  Divider, 
  Spin,
  Row,
  Col,
  message 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

// Mock order data
const mockOrders = {
  'ORD12345678': {
    id: 'ORD12345678',
    date: '2023-09-15',
    total: 299.97,
    subtotal: 279.97,
    tax: 20.00,
    shipping: 0,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK9876543210',
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    items: [
      {
        id: '1',
        name: 'Smartphone X',
        price: 999.99,
        quantity: 1,
        image: 'https://via.placeholder.com/50?text=Phone'
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/50?text=Headphones'
      },
      {
        id: '3',
        name: 'Phone Case',
        price: 19.99,
        quantity: 1,
        image: 'https://via.placeholder.com/50?text=Case'
      }
    ],
    timeline: [
      { time: '2023-09-15 09:30', status: 'Order Placed', description: 'Your order has been placed' },
      { time: '2023-09-15 14:20', status: 'Payment Confirmed', description: 'Your payment has been confirmed' },
      { time: '2023-09-16 10:45', status: 'Processed', description: 'Your order has been processed' },
      { time: '2023-09-17 09:15', status: 'Shipped', description: 'Your order has been shipped' },
      { time: '2023-09-19 14:30', status: 'Delivered', description: 'Your order has been delivered' }
    ]
  },
  'ORD23456789': {
    id: 'ORD23456789',
    date: '2023-08-28',
    total: 149.99,
    subtotal: 139.99,
    tax: 10.00,
    shipping: 0,
    status: 'Processing',
    paymentMethod: 'PayPal',
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    items: [
      {
        id: '4',
        name: 'Laptop Pro',
        price: 1299.99,
        quantity: 1,
        image: 'https://via.placeholder.com/50?text=Laptop'
      }
    ],
    timeline: [
      { time: '2023-08-28 15:45', status: 'Order Placed', description: 'Your order has been placed' },
      { time: '2023-08-28 16:30', status: 'Payment Confirmed', description: 'Your payment has been confirmed' },
      { time: '2023-08-29 09:20', status: 'Processed', description: 'Your order has been processed' }
    ]
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundOrder = mockOrders[id];
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        message.error('Order not found');
      }
      
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleGoBack = () => {
    navigate('/orders');
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.image && (
            <img 
              src={record.image} 
              alt={text} 
              style={{ 
                width: 50, 
                height: 50, 
                objectFit: 'cover',
                marginRight: 10 
              }} 
            />
          )}
          {text}
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: record => `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Title level={4}>Order not found</Title>
        <Button type="primary" onClick={handleGoBack}>
          Go Back to Orders
        </Button>
      </div>
    );
  }

  // Calculate the current step based on order status
  const getStatusStep = (status) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Payment Confirmed':
        return 1;
      case 'Processed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleGoBack}
        style={{ marginBottom: 16, padding: 0 }}
      >
        Back to Orders
      </Button>
      
      <Title level={2}>Order Details</Title>
      <Paragraph>Order Number: {order.id}</Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card title="Order Status" style={{ marginBottom: 16 }}>
            <Steps current={getStatusStep(order.status)} size="small">
              <Step title="Placed" description="Order placed" />
              <Step title="Confirmed" description="Payment confirmed" />
              <Step title="Processed" description="Order processed" />
              <Step title="Shipped" description="Order shipped" />
              <Step title="Delivered" description="Order delivered" />
            </Steps>
            
            <Divider />
            
            <div>
              <Title level={4}>Timeline</Title>
              {order.timeline.map((event, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{event.status}</strong>
                    <span>{event.time}</span>
                  </div>
                  <div>{event.description}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Items in Your Order">
            <Table 
              columns={columns} 
              dataSource={order.items} 
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={6}>
          <Card title="Order Summary">
            <Descriptions column={1}>
              <Descriptions.Item label="Order Date">{order.date}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={order.status === 'Delivered' ? 'green' : 'blue'}>
                  {order.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">{order.paymentMethod}</Descriptions.Item>
              {order.trackingNumber && (
                <Descriptions.Item label="Tracking">{order.trackingNumber}</Descriptions.Item>
              )}
            </Descriptions>
            
            <Divider />
            
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <Divider />
            <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </Card>
          
          <Card title="Shipping Address" style={{ marginTop: 16 }}>
            <div>
              <div>{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.addressLine1}</div>
              {order.shippingAddress.addressLine2 && (
                <div>{order.shippingAddress.addressLine2}</div>
              )}
              <div>{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}</div>
              <div>{order.shippingAddress.country}</div>
              <div>{order.shippingAddress.phone}</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage; 