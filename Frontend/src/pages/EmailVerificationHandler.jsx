import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Spin, Alert, Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")
  const [status, setStatus] = React.useState("loading")
  const [error, setError] = React.useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Ошибка верификации")
        }

        setStatus("success")
        setTimeout(() => navigate("/"), 3000)
      } catch (err) {
        setStatus("error")
        setError(err.message)
      }
    }

    if (token) {
      verifyEmail()
    } else {
      setStatus("error")
      setError("Токен подтверждения отсутствует")
    }
  }, [token, navigate])

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "100px 50px" }}>
        <Spin size="large" tip="Подтверждение email..." />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 800, margin: "50px auto" }}>
        <Alert
          message="Ошибка подтверждения email"
          description={error}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: 20 }}
        >
          На главную
        </Button>
      </div>
    )
  }

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

export default EmailVerificationHandler
