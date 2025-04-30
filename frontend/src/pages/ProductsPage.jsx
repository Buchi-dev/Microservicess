import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { productService } from '../services/productService';

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    // Get category from URL query params if exists
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
    
    // Fetch categories
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
    
    fetchCategories();
  }, [location.search]);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };
        
        if (category) {
          params.category = category;
        }
        
        if (search) {
          params.search = search;
        }
        
        const response = await productService.getProducts(params);
        setProducts(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.total,
          pages: response.data.pagination.pages
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, search, pagination.page, pagination.limit]);

  const handleSearch = (value) => {
    setSearch(value);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on new search
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on category change
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
              value={category || undefined}
              loading={categoryLoading}
            >
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
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
                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
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