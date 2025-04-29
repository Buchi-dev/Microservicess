import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spin, 
  Input, 
  Select, 
  Space, 
  message 
} from 'antd';
import { SearchOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with amazing features',
    price: 999.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Smartphone',
    inStock: true,
    quantity: 15
  },
  {
    _id: '2',
    name: 'Laptop Pro',
    description: 'Powerful laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Laptop',
    inStock: true,
    quantity: 8
  },
  {
    _id: '3',
    name: 'Wireless Headphones',
    description: 'Premium sound quality headphones',
    price: 199.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Headphones',
    inStock: true,
    quantity: 20
  },
  {
    _id: '4',
    name: 'Running Shoes',
    description: 'Comfortable shoes for running',
    price: 89.99,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300?text=Shoes',
    inStock: true,
    quantity: 25
  },
  {
    _id: '5',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker for home',
    price: 79.99,
    category: 'Home & Kitchen',
    image: 'https://via.placeholder.com/300?text=Coffee+Maker',
    inStock: true,
    quantity: 12
  },
  {
    _id: '6',
    name: 'Novel Book',
    description: 'Bestselling novel of the year',
    price: 14.99,
    category: 'Books',
    image: 'https://via.placeholder.com/300?text=Book',
    inStock: true,
    quantity: 30
  }
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      if (category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === category
        );
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchLower) || 
            product.description.toLowerCase().includes(searchLower)
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [category, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setLoading(true);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setLoading(true);
  };

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
    <div className="products-page">
      <Title level={2}>Products</Title>
      <Paragraph>Browse our collection of products</Paragraph>
      
      <div className="filters" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Search
              placeholder="Search products"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by category"
              style={{ width: '100%' }}
              size="large"
              allowClear
              onChange={handleCategoryChange}
            >
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Home & Kitchen">Home & Kitchen</Option>
              <Option value="Books">Books</Option>
              <Option value="Toys">Toys</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Beauty">Beauty</Option>
              <Option value="Health">Health</Option>
              <Option value="Automotive">Automotive</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Col>
        </Row>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.length > 0 ? (
            products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
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
                    <Link to={`/products/${product._id}`} key="view">View Details</Link>,
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
                  <Meta
                    title={product.name}
                    description={
                      <Space direction="vertical">
                        <span>${product.price.toFixed(2)}</span>
                        <span>{product.category}</span>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <Title level={4}>No products found</Title>
                <Paragraph>Try changing your search criteria</Paragraph>
              </div>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default ProductsPage; 