import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Image, 
  Descriptions, 
  InputNumber, 
  Tag, 
  Spin, 
  message 
} from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const { Title, Paragraph } = Typography;

// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with amazing features and high-resolution camera. This phone comes with a powerful processor, extended battery life, and an amazing display. Perfect for professionals and tech enthusiasts.',
    price: 999.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/500?text=Smartphone',
    inStock: true,
    quantity: 15,
    rating: 4.5,
    reviews: 120,
    features: [
      '6.7-inch Super AMOLED display',
      '128GB storage, 8GB RAM',
      '48MP triple camera system',
      'Fast charging battery',
      'Water and dust resistant'
    ]
  },
  {
    _id: '2',
    name: 'Laptop Pro',
    description: 'Powerful laptop for professionals with high performance specs. Designed for developers, designers, and content creators who need reliable performance and excellent display quality.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/500?text=Laptop',
    inStock: true,
    quantity: 8,
    rating: 4.8,
    reviews: 95,
    features: [
      '15.6-inch 4K display',
      '512GB SSD, 16GB RAM',
      'Dedicated graphics card',
      'Backlit keyboard',
      'All-day battery life',
      'Multiple connectivity options'
    ]
  },
  {
    _id: '3',
    name: 'Wireless Headphones',
    description: 'Premium sound quality headphones with noise cancellation technology. Enjoy your music without any disturbances with these comfortable and stylish headphones.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/500?text=Headphones',
    inStock: true,
    quantity: 20,
    rating: 4.6,
    reviews: 210,
    features: [
      'Active noise cancellation',
      'Bluetooth 5.0 connectivity',
      '30 hours battery life',
      'Premium sound quality',
      'Comfortable ear cushions',
      'Built-in microphone for calls'
    ]
  },
  {
    _id: '4',
    name: 'Running Shoes',
    description: 'Comfortable shoes for running with excellent support and cushioning. These shoes are designed for long-distance runners who need reliability and comfort.',
    price: 89.99,
    category: 'Clothing',
    image: 'https://via.placeholder.com/500?text=Shoes',
    inStock: true,
    quantity: 25,
    rating: 4.3,
    reviews: 150,
    features: [
      'Lightweight design',
      'Cushioned insole',
      'Breathable mesh upper',
      'Durable rubber outsole',
      'Available in multiple colors'
    ]
  },
  {
    _id: '5',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker for home with programmable settings. Make your perfect cup of coffee every morning with this easy-to-use and reliable coffee maker.',
    price: 79.99,
    category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/500?text=Coffee+Maker',
    inStock: true,
    quantity: 12,
    rating: 4.4,
    reviews: 88,
    features: [
      'Programmable timer',
      '12-cup capacity',
      'Auto shut-off feature',
      'Easy to clean',
      'Compact design'
    ]
  },
  {
    _id: '6',
    name: 'Novel Book',
    description: 'Bestselling novel of the year with an engaging storyline. This book has received critical acclaim and topped bestseller lists for several weeks.',
    price: 14.99,
    category: 'Books',
    image: 'https://via.placeholder.com/500?text=Book',
    inStock: true,
    quantity: 30,
    rating: 4.7,
    reviews: 230,
    features: [
      'Hardcover edition',
      'Award-winning author',
      '400 pages',
      'Includes bonus chapter',
      'Signed by the author'
    ]
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundProduct = mockProducts.find(p => p._id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        message.error('Product not found');
      }
      
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart(product, quantity);
        message.success(`${product.name} added to cart`);
      }
    } catch (error) {
      message.error(error.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (product) {
        const result = await addToWishlist(product);
        if (result.success) {
          message.success(`${product.name} added to wishlist`);
        } else {
          message.info(result.message);
        }
      }
    } catch (error) {
      message.error(error.message || 'Failed to add to wishlist');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Title level={4}>Product not found</Title>
        <Button type="primary" onClick={handleGoBack}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleGoBack}
        style={{ marginBottom: 16, padding: 0 }}
      >
        Back to Products
      </Button>
      
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Image
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            fallback="https://via.placeholder.com/500?text=Image+Not+Available"
          />
        </Col>
        
        <Col xs={24} md={12}>
          <Card bordered={false}>
            <Title level={2}>{product.name}</Title>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{product.category}</Tag>
              {product.inStock ? (
                <Tag color="green">In Stock</Tag>
              ) : (
                <Tag color="red">Out of Stock</Tag>
              )}
            </div>
            
            <Title level={3}>${product.price.toFixed(2)}</Title>
            
            <Paragraph style={{ fontSize: 16 }}>{product.description}</Paragraph>
            
            {product.features && product.features.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={4}>Features</Title>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Descriptions bordered column={1} style={{ marginTop: 24 }}>
              <Descriptions.Item label="Rating">{product.rating} / 5</Descriptions.Item>
              <Descriptions.Item label="Reviews">{product.reviews}</Descriptions.Item>
              <Descriptions.Item label="Availability">
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24 }}>
              <Row gutter={16} align="middle">
                <Col>
                  <InputNumber
                    min={1}
                    max={product.quantity}
                    defaultValue={1}
                    onChange={handleQuantityChange}
                    disabled={!product.inStock}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    Add to Cart
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="default"
                    icon={<HeartOutlined />}
                    size="large"
                    onClick={handleAddToWishlist}
                  >
                    Add to Wishlist
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage; 