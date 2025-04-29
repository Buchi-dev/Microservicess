import { useState, useEffect } from 'react';
import { Table, Button, Empty, Card, Typography, Space, message, Spin } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const { Title, Text } = Typography;

const WishlistPage = () => {
  const [loading, setLoading] = useState(true);
  const { 
    wishlistItems, 
    removeFromWishlist, 
    moveToCart 
  } = useWishlist();

  useEffect(() => {
    // Simulate loading from API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      message.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await moveToCart(productId);
      message.success('Item moved to cart');
    } catch (error) {
      console.error('Error moving item to cart:', error);
      message.error('Failed to move item to cart');
    }
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<ShoppingCartOutlined />} 
            type="primary"
            onClick={() => handleMoveToCart(record.productId)}
          >
            Add to Cart
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleRemoveItem(record.productId)}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>My Wishlist</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '50px' }}>
          <Spin size="large" />
        </div>
      ) : wishlistItems.length > 0 ? (
        <>
          <Table 
            dataSource={wishlistItems} 
            columns={columns} 
            rowKey="productId"
            pagination={false}
          />
        </>
      ) : (
        <Empty 
          description="Your wishlist is empty" 
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

export default WishlistPage; 