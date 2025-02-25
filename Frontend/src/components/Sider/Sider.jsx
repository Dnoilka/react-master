import React, { useState, useContext, useEffect } from 'react';
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
import {
  Menu,
  Layout,
  Button,
  Modal,
  Input,
  Form,
  Divider,
  Typography,
} from 'antd';
import { ThemeContext } from './ThemeContext';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

const { Sider: AntSider } = Layout;
const { Text } = Typography;

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('siderCollapsed') === 'true'
  );
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext); // Добавлен toggleTheme
  const { user, setUser, logout } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
          onOk: () => logout(),
        });
      } else {
        setIsLoginModalVisible(true);
      }
    } else if (e.key === 'theme') {
      toggleTheme();
    }
  };

  const handleAuthSubmit = async (values, isLogin) => {
    setLoading(true);
    try {
      const url = isLogin ? '/api/login' : '/api/register';
      const body = {
        email: values.email,
        password: values.password,
        ...(!isLogin && { name: values.name }),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
      }

      if (data.token) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        Modal.success({
          title: 'Успешный вход!',
          content: `Добро пожаловать, ${data.user.name}!`,
        });
        isLogin
          ? setIsLoginModalVisible(false)
          : setIsRegisterModalVisible(false);
      }
    } catch (error) {
      Modal.error({ title: 'Ошибка', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Переход между модалками
  const switchToRegister = () => {
    setIsLoginModalVisible(false);
    setIsRegisterModalVisible(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalVisible(false);
    setIsLoginModalVisible(true);
  };

  const renderLoginModal = () => (
    <Modal
      title="Вход в аккаунт"
      visible={isLoginModalVisible}
      onCancel={() => setIsLoginModalVisible(false)}
      footer={null}
      centered
      bodyStyle={{
        padding: 24,
      }}
    >
      <Form
        form={form}
        onFinish={(values) => handleAuthSubmit(values, true)}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ height: 40 }}
          >
            Войти
          </Button>
        </Form.Item>

        <Divider>Или</Divider>

        <Button
          block
          icon={<GoogleOutlined />}
          onClick={() => (window.location.href = '/api/auth/google')}
          style={{ height: 40, marginBottom: 16 }}
        >
          Войти через Google
        </Button>

        <Text style={{ textAlign: 'center', display: 'block' }}>
          Нет аккаунта?{' '}
          <Button type="link" onClick={switchToRegister} style={{ padding: 0 }}>
            Зарегистрироваться
          </Button>
        </Text>
      </Form>
    </Modal>
  );

  const renderRegisterModal = () => (
    <Modal
      title="Регистрация"
      visible={isRegisterModalVisible}
      onCancel={() => setIsRegisterModalVisible(false)}
      footer={null}
      centered
      bodyStyle={{
        padding: 24,
      }}
    >
      <Form
        form={form}
        onFinish={(values) => handleAuthSubmit(values, false)}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Введите ваше имя' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Ваше имя" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 8, message: 'Минимум 8 символов' },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d).+/,
              message: 'Должна быть заглавная буква и цифра',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ height: 40 }}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>

        <Text style={{ textAlign: 'center', display: 'block' }}>
          Уже есть аккаунт?{' '}
          <Button type="link" onClick={switchToLogin} style={{ padding: 0 }}>
            Войти
          </Button>
        </Text>
      </Form>
    </Modal>
  );

  return (
    <>
      <AntSider
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
          items={[
            {
              key: 'theme',
              label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MoonOutlined />
                  <span>
                    {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                  </span>
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
          ]}
          onClick={handleMenuClick}
          style={{
            padding: '16px 0',
            borderRight: 'none',
          }}
        />
      </AntSider>

      {renderLoginModal()}
      {renderRegisterModal()}
    </>
  );
};

export default SiderComponent;
