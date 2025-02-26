import React from "react"
import { Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

import { Layout } from "antd"

import Header from "../components/Header/Header"
import Sider from "../components/Sider/Sider"
import ThemeProvider from "../components/Sider/ThemeContext"
import CustomFooter from "../components/Footer/Footer"

const EmailVerified = () => {
  const navigate = useNavigate()

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <Result
            status="success"
            title="Email успешно подтвержден!"
            subTitle="Теперь вы можете пользоваться всеми функциями сайта"
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                На главную
              </Button>,
              <Button key="shop" onClick={() => navigate("/shop")}>
                В магазин
              </Button>,
            ]}
          />
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  )
}

export default EmailVerified
