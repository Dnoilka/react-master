import React, { useState, useContext, useEffect, Children } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  MoonOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Button, Modal, Input, Form, Alert } from 'antd';
import { ThemeContext } from './ThemeContext';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('siderCollapsed') === 'true'
  );
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, setUser } = useUser();
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('siderCollapsed', collapsed);
  }, [collapsed]);

  const handleMenuClick = (e) => {
    if (e.key === 'login') {
      if (user) {
        Modal.confirm({
          title: 'Подтверждение выхода',
          content: 'Вы уверены, что хотите выйти из системы?',
          okText: 'Выйти',
          cancelText: 'Отмена',
          onOk: () => setUser(null),
        });
      } else {
        setIsLoginModalVisible(true);
      }
    } else if (e.key === 'theme') {
      toggleTheme();
    }
  };

  const handleAuthSubmit = async (values, isLogin) => {
    try {
      const url = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
      }

      if (isLogin) {
        setUser(data.user);
        setIsLoginModalVisible(false);
        Modal.success({
          title: 'Вход выполнен!',
          content: `Добро пожаловать, ${data.user.name}!`,
        });
      } else {
        setIsRegisterModalVisible(false);
        Modal.success({
          title: 'Регистрация успешна!',
          content: 'Теперь вы можете войти в систему',
        });
      }
    } catch (error) {
      Modal.error({
        title: 'Ошибка',
        content: error.message,
      });
    }
  };

  const items = [
    {
      key: 'theme',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MoonOutlined />
          <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
        </div>
      ),
    },
    {
      key: 'login',
      icon: <UserOutlined />,
      label: user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{user.name}</span>
          <LogoutOutlined style={{ fontSize: 12 }} />
        </div>
      ) : (
        'Личный кабинет'
      ),
    },
    {
      key: 'sub1',
      label: 'Навигация',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: 'home',
          label: (
            <Link
              to="/"
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <HomeOutlined />
              <span>Главная</span>
            </Link>
          ),
        },
        {
          key: 'shop',
          label: (
            <Link
              to="/shop"
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <ShoppingOutlined />
              <span>Магазин</span>
            </Link>
          ),
        },
        {
          key: 'contact',
          label: (
            <Link
              to="/contact"
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <ContactsOutlined />
              <span>Контакты</span>
            </Link>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <Layout.Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={280}
        theme={theme}
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 80,
          left: 0,
          height: 'calc(100vh - 80px)',
          zIndex: 999,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            padding: 10,
            borderBottom: `1px solid ${
              theme === 'dark' ? '#303030' : '#f0f0f0'
            }`,
          }}
        >
          <Button
            type="default"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              borderColor: theme === 'dark' ? '#3f3f3f' : '#000',
              backgroundColor: '#fff',
            }}
          />
        </div>

        <Menu
          theme={theme}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          style={{
            padding: '16px 0',
            borderRight: 'none',
          }}
        />
      </Layout.Sider>
      <Modal
        title={
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: theme === 'dark' ? '#ffffff' : '#2d3436',
            }}
          >
            Вход в аккаунт
          </div>
        }
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{
          padding: 32,
          backgroundColor: theme === 'dark' ? '#141414' : '#ffffff',
        }}
      >
        <Form
          form={form}
          onFinish={(values) => handleAuthSubmit(values, true)}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              marginTop: 24,
            }}
          >
            Войти
          </Button>
          <Button
            block
            size="large"
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              marginTop: 16,
            }}
            icon={<GoogleOutlined />}
            onClick={() => (window.location.href = '/api/auth/google')}
          >
            Войти через Google
          </Button>
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              color: theme === 'dark' ? '#ffffff' : '#2d3436',
            }}
          >
            Нет аккаунта?{' '}
            <Button
              type="link"
              onClick={() => {
                setIsLoginModalVisible(false);
                setIsRegisterModalVisible(true);
              }}
              style={{ padding: 0 }}
            >
              Зарегистрироваться
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: theme === 'dark' ? '#ffffff' : '#2d3436',
            }}
          >
            Регистрация
          </div>
        }
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{
          padding: 32,
          backgroundColor: theme === 'dark' ? '#141414' : '#ffffff',
        }}
      >
        <Form
          form={form}
          onFinish={(values) => handleAuthSubmit(values, false)}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Имя"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль' },
              { min: 8, message: 'Минимум 8 символов' },
              {
                pattern: /^(?=.*[A-Z])(?=.*\d).+/,
                message: 'Должна быть заглавная буква и цифра',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Alert
            message="Пароль должен содержать:"
            description="Минимум 8 символов, заглавные буквы и цифры"
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Зарегистрироваться
          </Button>
          <Button
            block
            size="large"
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              marginTop: 16,
            }}
            icon={<GoogleOutlined />}
            onClick={() => (window.location.href = '/api/auth/google')}
          >
            Войти через Google
          </Button>
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              color: theme === 'dark' ? '#ffffff' : '#2d3436',
            }}
          >
            Уже есть аккаунт?{' '}
            <Button
              type="link"
              onClick={() => {
                setIsLoginModalVisible(true);
                setIsRegisterModalVisible(false);
              }}
              style={{ padding: 0 }}
            >
              Войти
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default SiderComponent;
