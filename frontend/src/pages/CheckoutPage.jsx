import { useState, useEffect } from 'react';
import { 
  Typography, 
  Form, 
  Input, 
  Button, 
  Steps, 
  Divider, 
  Card, 
  Row, 
  Col, 
  Radio, 
  Table, 
  Space,
  message, 
  Spin, 
  Result 
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Simulate loading from API
    const timer = setTimeout(() => {
      setLoading(false);
      
      if (cartItems.length === 0) {
        message.info('Your cart is empty');
        navigate('/cart');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [cartItems, navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1);
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessingOrder(true);
      const values = form.getFieldsValue();
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock order ID
      const mockOrderId = 'ORD' + Date.now().toString().slice(-8);
      
      await clearCart();
      setOrderId(mockOrderId);
      setOrderComplete(true);
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
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

  const steps = [
    {
      title: 'Shipping',
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: user?.name || '',
            email: user?.email || '',
            country: 'United States',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="addressLine1"
                label="Address Line 1"
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="addressLine2" label="Address Line 2">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter your city' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="state"
                label="State/Province"
                rules={[{ required: true, message: 'Please enter your state' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="postalCode"
                label="Postal Code"
                rules={[{ required: true, message: 'Please enter your postal code' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please enter your country' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Payment',
      content: (
        <div>
          <Title level={4}>Payment Method</Title>
          <Radio.Group 
            value={paymentMethod} 
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="creditCard">Credit Card</Radio>
              <Radio value="paypal">PayPal</Radio>
              <Radio value="bankTransfer">Bank Transfer</Radio>
            </Space>
          </Radio.Group>
          
          {paymentMethod === 'creditCard' && (
            <Card style={{ marginTop: 20 }}>
              <Form layout="vertical">
                <Form.Item
                  name="cardNumber"
                  label="Card Number"
                  rules={[{ required: true, message: 'Please enter your card number' }]}
                >
                  <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="cardName"
                      label="Name on Card"
                      rules={[{ required: true, message: 'Please enter name on card' }]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item
                      name="expiryDate"
                      label="Expiry Date"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="MM/YY" maxLength={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item
                      name="cvv"
                      label="CVV"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="123" maxLength={3} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: 'Review',
      content: (
        <div>
          <Title level={4}>Order Summary</Title>
          <Table 
            dataSource={cartItems} 
            columns={columns} 
            rowKey="id"
            pagination={false}
          />
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Title level={4}>Total: ${calculateTotal()}</Title>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <Result
        status="success"
        title="Order Placed Successfully!"
        subTitle={`Order number: ${orderId}. We'll send you a confirmation email with details of your order.`}
        extra={[
          <Link to="/" key="home">
            <Button type="primary">Back to Home</Button>
          </Link>,
          <Link to="/orders" key="orders">
            <Button>View Orders</Button>
          </Link>,
        ]}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Checkout</Title>
      
      <Steps current={currentStep} style={{ marginBottom: 30 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <Card>
        <div className="steps-content">{steps[currentStep].content}</div>
        <Divider />
        <div className="steps-action" style={{ textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={handlePlaceOrder}
              loading={processingOrder}
            >
              Place Order
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CheckoutPage; 