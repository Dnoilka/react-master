import React, { useState } from 'react';
import {
  Layout,
  Upload,
  Button,
  Form,
  Input,
  Typography,
  Avatar,
  message,
  Card,
  Radio,
} from 'antd';
import { useUser } from '../components/Sider/UserContext';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import ThemeProvider from '../components/Sider/ThemeContext';
import CustomFooter from '../components/Footer/Footer';

const { Title } = Typography;

const Profile = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleAvatarUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, avatar: data.avatarUrl });
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, avatar: data.avatarUrl })
        );
        message.success('Аватар успешно обновлен');
      } else {
        message.error(data.error || 'Ошибка загрузки');
      }
    } catch (error) {
      message.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('Профиль обновлен');
      } else {
        message.error(data.error || 'Ошибка обновления');
      }
    } catch (error) {
      message.error('Ошибка соединения');
    }
  };

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <div style={{ width: '100%', margin: '0 auto', padding: 24 }}>
            <Card title="Профиль пользователя">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Upload
                  customRequest={handleAvatarUpload}
                  showUploadList={false}
                  disabled={loading}
                >
                  <Avatar
                    src={user?.avatar}
                    icon={!user?.avatar && <UserOutlined />}
                    size={128}
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #1890ff',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      marginBottom: 16,
                    }}
                  >
                    <CameraOutlined style={{ fontSize: 24 }} />
                  </Avatar>
                </Upload>
                <Title level={4}>{user?.name}</Title>
              </div>

              <Form
                initialValues={user}
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: 600, margin: '0 auto' }}
              >
                <Form.Item
                  label=" Фамилия"
                  name="surname"
                  rules={[{ required: true, message: 'Введите вашу фамилию' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Имя"
                  name="name"
                  rules={[{ required: true, message: 'Введите ваше имя' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Отчество"
                  name="patronymic"
                  rules={[{ required: true, message: 'Введите ваше отчество' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Введите корректный email',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="gender"
                  valuePropName="value"
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio value="male">Мужской</Radio>
                    <Radio value="female">Женский</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Сохранить изменения
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default Profile;
