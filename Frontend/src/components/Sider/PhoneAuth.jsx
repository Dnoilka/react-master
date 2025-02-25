import React, { useState } from "react"
import { Button, Input, Form, Alert } from "antd"

const PhoneAuth = () => {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendCode = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/send-sms-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) throw new Error("Ошибка отправки кода")
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/verify-sms-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <Alert message={error} type="error" showIcon />}

      {step === 1 && (
        <Form layout="vertical">
          <Form.Item label="Номер телефона">
            <Input
              placeholder="+7XXXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSendCode} loading={loading}>
            Отправить код
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form layout="vertical">
          <Form.Item label="Код из SMS">
            <Input
              placeholder="Введите 6-значный код"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleVerifyCode} loading={loading}>
            Подтвердить
          </Button>
        </Form>
      )}
    </div>
  )
}

export default PhoneAuth
