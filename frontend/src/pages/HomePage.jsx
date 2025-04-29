import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Carousel, 
  Spin, 
  Divider, 
  Space, 
  message 
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Import local placeholder images
import placeholderBanner from '../assets/placeholder-banner.svg';
import placeholderProduct from '../assets/placeholder-product.svg';
import placeholderCategory from '../assets/placeholder-category.svg';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with amazing features',
    price: 999.99,
    category: 'Electronics',
    image: placeholderProduct,
    inStock: true,
    quantity: 15
  },
  {
    _id: '2',
    name: 'Laptop Pro',
    description: 'Powerful laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    image: placeholderProduct,
    inStock: true,
    quantity: 8
  },
  {
    _id: '3',
    name: 'Wireless Headphones',
    description: 'Premium sound quality headphones',
    price: 199.99,
    category: 'Electronics',
    image: placeholderProduct,
    inStock: true,
    quantity: 20
  },
  {
    _id: '4',
    name: 'Running Shoes',
    description: 'Comfortable shoes for running',
    price: 89.99,
    category: 'Clothing',
    image: placeholderProduct,
    inStock: true,
    quantity: 25
  }
];

const banners = [
  {
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items',
    image: placeholderBanner,
    link: '/products?category=summer'
  },
  {
    title: 'New Arrivals',
    description: 'Check out our latest products',
    image: placeholderBanner,
    link: '/products?category=new'
  },
  {
    title: 'Limited Time Offers',
    description: 'Special deals for a limited time',
    image: placeholderBanner,
    link: '/products?category=deals'
  }
];

const categories = [
  {
    name: 'Electronics',
    image: placeholderCategory,
    link: '/products?category=Electronics'
  },
  {
    name: 'Clothing',
    image: placeholderCategory,
    link: '/products?category=Clothing'
  },
  {
    name: 'Home & Kitchen',
    image: placeholderCategory,
    link: '/products?category=Home+%26+Kitchen'
  },
  {
    name: 'Books',
    image: placeholderCategory,
    link: '/products?category=Books'
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      message.success(`${product.name} added to cart`);
    } catch (error) {
      message.error(error.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const result = await addToWishlist(product);
      if (result.success) {
        message.success(`${product.name} added to wishlist`);
      } else {
        message.info(result.message);
      }
    } catch (error) {
      message.error(error.message || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <Carousel autoplay>
        {banners.map((banner, index) => (
          <div key={index}>
            <div 
              style={{ 
                position: 'relative',
                height: '400px',
              }}
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white'
                }}
              >
                <Title level={2} style={{ color: 'white', margin: 0 }}>{banner.title}</Title>
                <Paragraph style={{ color: 'white', margin: '0.5rem 0 1rem' }}>{banner.description}</Paragraph>
                <Link to={banner.link}>
                  <Button type="primary" size="large">Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Categories */}
      <div style={{ margin: '3rem 0' }}>
        <Title level={2}>Shop by Category</Title>
        <Row gutter={[16, 16]}>
          {categories.map((category, index) => (
            <Col xs={12} sm={6} key={index}>
              <Link to={category.link}>
                <Card
                  hoverable
                  cover={<img alt={category.name} src={category.image} />}
                >
                  <Meta title={category.name} />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      
      {/* Featured Products */}
      <div style={{ margin: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Title level={2}>Featured Products</Title>
          <Link to="/products">
            <Button type="link" icon={<ArrowRightOutlined />}>View All</Button>
          </Link>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={6} key={product._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      type="link"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product)}
                      key="add-to-cart"
                    >
                      Add to Cart
                    </Button>,
                    <Button
                      type="link"
                      icon={<HeartOutlined />}
                      onClick={() => handleAddToWishlist(product)}
                      key="add-to-wishlist"
                    >
                      Wishlist
                    </Button>,
                  ]}
                >
                  <Link to={`/products/${product._id}`}>
                    <Meta
                      title={product.name}
                      description={
                        <Space direction="vertical">
                          <span>${product.price.toFixed(2)}</span>
                          <span>{product.category}</span>
                        </Space>
                      }
                    />
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      
      {/* Promotional Banner */}
      <div 
        style={{ 
          margin: '3rem 0',
          padding: '2rem',
          background: '#f0f2f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <Title level={2}>Join Our Newsletter</Title>
        <Paragraph>
          Subscribe to our newsletter and be the first to know about new products and special offers!
        </Paragraph>
        <Button type="primary" size="large">Subscribe Now</Button>
      </div>
    </div>
  );
};

export default HomePage; 