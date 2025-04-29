import { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Empty, Card, Typography, Space, message, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const { cartItems, updateCartItem, removeCartItem } = useCart();

  useEffect(() => {
    // Simulate loading from API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      message.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      message.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      message.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical">
          <Link to={`/products/${record.productId}`}>
            <Text strong>{text}</Text>
          </Link>
          {record.image && (
            <img 
              src={record.image} 
              alt={text} 
              style={{ 
                width: 50, 
                height: 50, 
                objectFit: 'cover' 
              }} 
            />
          )}
        </Space>
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
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={10}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: record => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          icon={<DeleteOutlined />} 
          danger
          onClick={() => handleRemoveItem(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Shopping Cart</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '50px' }}>
          <Spin size="large" />
        </div>
      ) : cartItems.length > 0 ? (
        <>
          <Table 
            dataSource={cartItems} 
            columns={columns} 
            rowKey="id"
            pagination={false}
          />
          
          <Card style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>Total: ${calculateTotal()}</Title>
              <Link to="/checkout">
                <Button type="primary" size="large">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </Card>
        </>
      ) : (
        <Empty 
          description="Your cart is empty" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/products">
            <Button type="primary">Continue Shopping</Button>
          </Link>
        </Empty>
      )}
    </div>
  );
};

export default CartPage; 