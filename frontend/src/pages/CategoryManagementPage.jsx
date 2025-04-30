import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row,
  Col,
  Table, 
  Typography, 
  Button, 
  message, 
  Card, 
  Spin, 
  Input, 
  Space, 
  Popconfirm,
  Form,
  Modal,
  Statistic,
  Upload,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  AppstoreAddOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryStats, setCategoryStats] = useState({
    totalCategories: 0,
    categoriesWithProducts: 0,
    mostPopularCategory: null
  });
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if user is not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch categories on mount and when search changes
  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesRes = await productService.getCategories();
      const categoriesData = categoriesRes.data.data || [];
      
      // Apply search filter if needed
      const filteredCategories = searchTerm 
        ? categoriesData.filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) 
        : categoriesData;
      
      // Format categories for table
      const formattedCategories = filteredCategories.map(category => ({
        id: category,
        name: category,
        key: category
      }));
      
      setCategories(formattedCategories);
      
      // Get product counts for each category
      const productsRes = await productService.getProducts({ limit: 1000 });
      const products = productsRes.data.data || [];
      
      // Count products by category
      const categoryCounts = {};
      products.forEach(product => {
        if (product.category) {
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        }
      });
      
      // Update categories with counts
      const categoriesWithCounts = formattedCategories.map(category => ({
        ...category,
        count: categoryCounts[category.name] || 0
      }));
      
      setCategories(categoriesWithCounts);
      
      // Calculate stats
      const categoriesWithProducts = Object.keys(categoryCounts).length;
      let mostPopularCategory = null;
      let maxCount = 0;
      
      Object.entries(categoryCounts).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostPopularCategory = {
            name: category,
            count
          };
        }
      });
      
      setCategoryStats({
        totalCategories: formattedCategories.length,
        categoriesWithProducts,
        mostPopularCategory
      });
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCategories();
    message.success('Categories refreshed');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue({
      name: category.name
    });
    setFileList([]);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await productService.deleteCategory(categoryId);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category');
    }
  };

  const handleSaveCategory = async (values) => {
    try {
      if (currentCategory) {
        // Update existing category
        await productService.updateCategory(currentCategory.id, values.name);
        message.success('Category updated successfully');
      } else {
        // Create new category
        await productService.createCategory(values.name);
        message.success('Category created successfully');
      }
      
      // Handle image upload if provided
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // This is a placeholder for category image upload
        // In a real implementation, you would upload the image to storage
        // and associate it with the category
        message.info('Category image upload would be processed here');
      }
      
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      message.error('Failed to save category');
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Products Count',
      dataIndex: 'count',
      key: 'count',
      render: (count) => count || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCategory(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => navigate(`/admin/products?category=${record.name}`)}
          >
            View Products
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description="This will not delete associated products, but they will become uncategorized."
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="category-management-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Category Management</Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Categories"
              value={categoryStats.totalCategories}
              prefix={<AppstoreAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Categories With Products"
              value={categoryStats.categoriesWithProducts}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Most Popular Category"
              value={categoryStats.mostPopularCategory?.name || 'None'}
              suffix={categoryStats.mostPopularCategory ? `(${categoryStats.mostPopularCategory.count} products)` : ''}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search categories"
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading categories...</div>
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={categories} 
            rowKey="id" 
            pagination={categories.length > 10 ? { pageSize: 10 } : false}
          />
        )}
      </Card>

      {/* Category Form Modal */}
      <Modal
        title={currentCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCategory}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Category Image"
            tooltip="Upload an image for this category (optional)"
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          
          <Divider />
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {currentCategory ? "Update Category" : "Add Category"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage; 