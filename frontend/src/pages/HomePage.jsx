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
import { productService } from '../services/productService';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    // Fetch featured products from API
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({ limit: 4 });
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await productService.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchCategories();
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
      <div className="hero-banner">
        <div className="hero-content">
          <Title level={1}>Welcome to Our Shop</Title>
          <Paragraph>Discover amazing products with great deals</Paragraph>
          <Link to="/products">
            <Button type="primary" size="large">Shop Now</Button>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ margin: '3rem 0' }}>
        <Title level={2}>Shop by Category</Title>
        {categoryLoading ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <p>No categories available. Check back soon!</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {categories.map((category, index) => (
              <Col xs={12} sm={6} key={index}>
                <Link to={`/products?category=${encodeURIComponent(category)}`}>
                  <Card
                    hoverable
                    className="category-card"
                  >
                    <Meta title={category} />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
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
        ) : featuredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <p>No products available. Check back soon!</p>
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
                          <span>${product.price?.toFixed(2) || '0.00'}</span>
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
      
      <Divider />
      
      {/* Customer Benefits Section */}
      <div style={{ margin: '3rem 0' }}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={8}>
            <div className="benefit-item">
              <Title level={4}>Free Shipping</Title>
              <Paragraph>On all orders over $50</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="benefit-item">
              <Title level={4}>Easy Returns</Title>
              <Paragraph>30-day return policy</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="benefit-item">
              <Title level={4}>Secure Payments</Title>
              <Paragraph>Protected by industry standards</Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage; 