import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Typography, 
  Button, 
  Badge, 
  Select, 
  message, 
  Card, 
  Spin, 
  Input, 
  DatePicker, 
  Space, 
  Popconfirm,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: '',
    dateRange: null
  });

  // Redirect if user is not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch orders on mount and when filters/pagination change
  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.current,
        limit: pagination.pageSize
      };

      // Add filters if they exist
      if (filters.status) params.status = filters.status;
      if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        params.startDate = filters.dateRange[0].toISOString();
        params.endDate = filters.dateRange[1].toISOString();
      }

      const response = await orderService.getOrders(params);
      
      setOrders(response.data.data || []);
      setPagination({
        ...pagination,
        total: response.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    message.success('Orders refreshed');
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current
    });
  };

  const handleStatusFilterChange = (value) => {
    setFilters({
      ...filters,
      status: value
    });
    setPagination({
      ...pagination,
      current: 1 // Reset to first page when filter changes
    });
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters({
      ...filters,
      searchTerm
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const handleDateRangeChange = (dates) => {
    setFilters({
      ...filters,
      dateRange: dates
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, { status });
      message.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      message.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Failed to delete order');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: id => <Typography.Text ellipsis style={{ maxWidth: 150 }}>{id}</Typography.Text>
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: user => user?.name || 'Unknown'
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: items => <Typography.Text>{items?.length || 0} items</Typography.Text>
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: amount => `$${amount?.toFixed(2) || '0.00'}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        if (status === 'completed') color = 'green';
        if (status === 'cancelled') color = 'red';
        if (status === 'shipped') color = 'purple';
        if (status === 'processing') color = 'orange';
        return <Badge color={color} text={status} />;
      }
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: status => {
        if (status === 'paid') return <Tag color="green">Paid</Tag>;
        return <Tag color="orange">Pending</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/orders/${record._id}`)}
          >
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleUpdateOrderStatus(record._id, value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDeleteOrder(record._id)}
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
    <div className="order-management-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Order Management</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
        >
          Refresh Orders
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            allowClear
            onChange={handleStatusFilterChange}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          
          <Input
            placeholder="Search by order ID or customer"
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
            allowClear
          />
          
          <RangePicker onChange={handleDateRangeChange} />
        </div>
      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading orders...</div>
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="_id" 
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} orders`
            }}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
        )}
      </Card>
    </div>
  );
};

export default OrderManagementPage; 