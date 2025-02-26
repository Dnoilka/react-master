import React, { useState, useContext, useEffect } from "react"
import {
  Menu,
  Layout,
  Button,
  Modal,
  Input,
  Form,
  Divider,
  Typography,
  Dropdown,
  Avatar,
  Space,
} from "antd"
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
  SettingOutlined,
  GiftOutlined,
  HistoryOutlined,
} from "@ant-design/icons"
import { ThemeContext } from "./ThemeContext"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "./UserContext"

const { Sider: AntSider } = Layout
const { Text } = Typography

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("siderCollapsed") === "true"
  )
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { user, setUser, logout } = useUser()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem("siderCollapsed", collapsed)
  }, [collapsed])

  const handleMenuClick = e => {
    if (e.key === "login") {
      if (user) {
        Modal.confirm({
          title: "Подтверждение выхода",
          content: "Вы уверены, что хотите выйти из системы?",
          okText: "Выйти",
          cancelText: "Отмена",
          onOk: () => logout(),
        })
      } else {
        setIsLoginModalVisible(true)
      }
    } else if (e.key === "theme") {
      toggleTheme()
    }
  }

  const renderUserMenu = () => {
    if (!user) return null

    const items = [
      {
        key: "profile",
        label: (
          <Link to="/profile" style={{ display: "block", padding: "8px 16px" }}>
            <Space>
              <UserOutlined />
              Мои данные
            </Space>
          </Link>
        ),
      },
      {
        key: "orders",
        label: (
          <Link to="/orders" style={{ display: "block", padding: "8px 16px" }}>
            <Space>
              <HistoryOutlined />
              Мои заказы
            </Space>
          </Link>
        ),
      },
      {
        key: "promo",
        label: (
          <Link to="/promo" style={{ display: "block", padding: "8px 16px" }}>
            <Space>
              <GiftOutlined />
              Промокоды
            </Space>
          </Link>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "settings",
        label: (
          <Link
            to="/settings"
            style={{ display: "block", padding: "8px 16px" }}
          >
            <Space>
              <SettingOutlined />
              Настройки
            </Space>
          </Link>
        ),
      },
      {
        key: "logout",
        label: (
          <div
            onClick={logout}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              color:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(0, 0, 0, 0.88)",
            }}
          >
            <Space>
              <LogoutOutlined />
              Выйти
            </Space>
          </div>
        ),
      },
    ]

    return (
      <Dropdown
        menu={{
          items,
          style: {
            backgroundColor: theme === "dark" ? "#1c2233" : "#ffffff",
            border: `1px solid ${theme === "dark" ? "#2d3746" : "#f0f0f0"}`,
            borderRadius: "8px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
          },
        }}
        trigger={["hover"]}
        placement="bottomLeft"
        overlayStyle={{
          minWidth: 200,
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            transition: "background 0.3s",
            ":hover": {
              backgroundColor: theme === "dark" ? "#2d3746" : "#f5f5f5",
            },
          }}
        >
          <Space>
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
              }}
            />
            <span
              style={{
                color:
                  theme === "dark"
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(0, 0, 0, 0.88)",
                fontWeight: 500,
              }}
            >
              {user.name}
            </span>
          </Space>
        </div>
      </Dropdown>
    )
  }

  const menuItems = [
    {
      key: "theme",
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MoonOutlined />
          <span>{theme === "dark" ? "Светлая тема" : "Тёмная тема"}</span>
        </div>
      ),
    },
    ...(user
      ? [
          {
            key: "user-menu",
            label: renderUserMenu(),
            style: {
              height: "auto",
              padding: 0,
              lineHeight: "normal",
            },
          },
        ]
      : [
          {
            key: "login",
            icon: <UserOutlined />,
            label: "Личный кабинет",
            onClick: handleMenuClick,
          },
        ]),
    {
      key: "sub1",
      label: "Навигация",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "home",
          label: (
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <HomeOutlined />
              <span>Главная</span>
            </Link>
          ),
        },
        {
          key: "shop",
          label: (
            <Link
              to="/shop"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <ShoppingOutlined />
              <span>Магазин</span>
            </Link>
          ),
        },
        {
          key: "contact",
          label: (
            <Link
              to="/contact"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <ContactsOutlined />
              <span>Контакты</span>
            </Link>
          ),
        },
      ],
    },
  ]

  // Остальная часть кода остается без изменений
  const handleAuthSubmit = async (values, isLogin) => {
    setLoading(true)
    try {
      const url = isLogin ? "/api/login" : "/api/register"
      const body = {
        email: values.email,
        password: values.password,
        ...(!isLogin && { name: values.name }),
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера")
      }

      if (data.token) {
        setUser(data.user)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        Modal.success({
          title: "Успешный вход!",
          content: `Добро пожаловать, ${data.user.name}!`,
        })
        isLogin
          ? setIsLoginModalVisible(false)
          : setIsRegisterModalVisible(false)
      }
    } catch (error) {
      Modal.error({ title: "Ошибка", content: error.message })
    } finally {
      setLoading(false)
    }
  }

  const switchToRegister = () => {
    setIsLoginModalVisible(false)
    setIsRegisterModalVisible(true)
  }

  const switchToLogin = () => {
    setIsRegisterModalVisible(false)
    setIsLoginModalVisible(true)
  }

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
        onFinish={values => handleAuthSubmit(values, true)}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
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
          onClick={() => (window.location.href = "/api/auth/google")}
          style={{ height: 40, marginBottom: 16 }}
        >
          Войти через Google
        </Button>

        <Text style={{ textAlign: "center", display: "block" }}>
          Нет аккаунта?{" "}
          <Button type="link" onClick={switchToRegister} style={{ padding: 0 }}>
            Зарегистрироваться
          </Button>
        </Text>
      </Form>
    </Modal>
  )

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
        onFinish={values => handleAuthSubmit(values, false)}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Введите ваше имя" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Ваше имя" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 8, message: "Минимум 8 символов" },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d).+/,
              message: "Должна быть заглавная буква и цифра",
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

        <Text style={{ textAlign: "center", display: "block" }}>
          Уже есть аккаунт?{" "}
          <Button type="link" onClick={switchToLogin} style={{ padding: 0 }}>
            Войти
          </Button>
        </Text>
      </Form>
    </Modal>
  )

  return (
    <>
      <AntSider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={280}
        theme={theme}
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 80,
          left: 0,
          height: "calc(100vh - 80px)",
          zIndex: 999,
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: 10,
            borderBottom: `1px solid ${
              theme === "dark" ? "#303030" : "#f0f0f0"
            }`,
          }}
        >
          <Button
            type="default"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              color: "#000",
              borderColor: theme === "dark" ? "#3f3f3f" : "#000",
              backgroundColor: "#fff",
            }}
          />
        </div>

        <Menu
          theme={theme}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            padding: "16px 0",
            borderRight: "none",
          }}
        />
      </AntSider>

      {renderLoginModal()}
      {renderRegisterModal()}
    </>
  )
}

export default SiderComponent
