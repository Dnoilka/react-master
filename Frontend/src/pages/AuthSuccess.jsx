import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { message } from "antd"
import { useUser } from "../components/Sider/UserContext"
import { Layout } from "antd"
import Header from "../components/Header/Header"
import Sider from "../components/Sider/Sider"
import ThemeProvider from "../components/Sider/ThemeContext"
import CustomFooter from "../components/Footer/Footer"

export default function AuthSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useUser()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    if (token) {
      try {
        // Декодируем JWT токен чтобы получить данные пользователя
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userData = {
          id: payload.id,
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
        }

        // Сохраняем данные в localStorage и контекст
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)

        message.success("Успешный вход через Google!")
        navigate("/")
      } catch (error) {
        message.error("Ошибка обработки токена")
        navigate("/login")
      }
    } else {
      message.error("Токен не получен")
      navigate("/login")
    }
  }, [location, navigate, setUser])

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <h2>Обработка авторизации...</h2>
          </div>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  )
}
