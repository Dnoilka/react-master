import React from "react"
import { Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

const EmailVerified = () => {
  const navigate = useNavigate()

  return (
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
  )
}

export default EmailVerified
