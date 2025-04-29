import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values);
      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem' 
    }}>
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        <Paragraph style={{ textAlign: 'center' }}>
          Sign in to your account to continue
        </Paragraph>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Or</Divider>
        
        <div style={{ textAlign: 'center' }}>
          <Paragraph>
            Don't have an account? <Link to="/register">Sign up now</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage; 