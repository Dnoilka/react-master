import React, { useState } from "react"
import { Form, Input, Button, Alert, Typography } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Layout } from "antd"
import Header from "../components/Header/Header"
import Sider from "../components/Sider/Sider"
import ThemeProvider from "../components/Sider/ThemeContext"
import CustomFooter from "../components/Footer/Footer"
const { Title } = Typography

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const onFinish = async values => {
    setLoading(true)
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: searchParams.get("token"),
          password: values.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
              Сброс пароля
            </Title>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}
            {success && (
              <Alert
                message="Пароль успешно изменен!"
                type="success"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="password"
                label="Новый пароль"
                rules={[
                  { required: true, message: "Введите новый пароль" },
                  { min: 8, message: "Минимум 8 символов" },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d).+/,
                    message: "Должна быть заглавная буква и цифра",
                  },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Подтверждение пароля"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Подтвердите пароль" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("Пароли не совпадают"))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Сбросить пароль
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  )
}

export default ResetPassword
