import React, { useState, useContext } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  MoonOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Button, Modal, Input, Form } from 'antd';
import { ThemeContext } from './ThemeContext';
import { Link } from 'react-router-dom';

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'login') {
      setIsLoginModalVisible(true);
    } else if (e.key === 'theme') {
      toggleTheme();
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalVisible(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalVisible(false);
  };

  const switchToRegister = () => {
    closeLoginModal();
    setIsRegisterModalVisible(true);
  };

  const switchToLogin = () => {
    closeRegisterModal();
    setIsLoginModalVisible(true);
  };

  const items = [
    {
      key: 'theme',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MoonOutlined />
          <span>Сменить тему</span>
        </div>
      ),
    },
    {
      key: 'login',
      label: 'Войти',
      icon: <MailOutlined />,
    },
    {
      key: 'sub1',
      label: 'Навигация',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: '1',
          label: (
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <HomeOutlined />
              <span style={{ marginLeft: '10px' }}>На главную</span>
            </Link>
          ),
        },
        {
          key: '2',
          label: (
            <Link to="/Shop" style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingOutlined />
              <span style={{ marginLeft: '10px' }}>Магазин</span>
            </Link>
          ),
        },
        {
          key: '3',
          label: (
            <Link
              to="/Contact"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ContactsOutlined />
              <span style={{ marginLeft: '10px' }}>Контакты</span>
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
        onCollapse={(collapsedState) => setCollapsed(collapsedState)}
        width={250}
        style={{ minHeight: '100vh' }}
        theme={theme}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px 0',
          }}
        >
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{
              width: collapsed ? '70px' : '95%',
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
            }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>

        <Menu
          theme={theme}
          onClick={handleMenuClick}
          style={{ width: '100%' }}
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        />
      </Layout.Sider>

      <Modal
        title="Вход"
        visible={isLoginModalVisible}
        onCancel={closeLoginModal}
        footer={null}
        width={800}
        bodyStyle={{ padding: '20px' }}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={closeLoginModal}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш email!',
              },
              {
                type: 'email',
                message: 'Введите корректный email!',
              },
            ]}
          >
            <Input
              placeholder="Email"
              style={{ height: '50px', fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш пароль!',
              },
            ]}
          >
            <Input.Password
              placeholder="Пароль"
              style={{ height: '50px', fontSize: '16px' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" size="large" htmlType="submit">
              Войти
            </Button>
            <Button type="link" onClick={switchToRegister}>
              Зарегистрироваться
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Регистрация"
        visible={isRegisterModalVisible}
        onCancel={closeRegisterModal}
        footer={null}
        width={800}
        bodyStyle={{ padding: '20px' }}
      >
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={closeRegisterModal}
          layout="vertical"
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваше имя!',
              },
            ]}
          >
            <Input
              placeholder="Имя"
              style={{ height: '50px', fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш email!',
              },
              {
                type: 'email',
                message: 'Введите корректный email!',
              },
            ]}
          >
            <Input
              placeholder="Email"
              style={{ height: '50px', fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш пароль!',
              },
            ]}
          >
            <Input.Password
              placeholder="Пароль"
              style={{ height: '50px', fontSize: '16px' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" size="large" htmlType="submit">
              Зарегистрироваться
            </Button>
            <Button type="link" onClick={switchToLogin}>
              Уже есть аккаунт? Войти
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default SiderComponent;
