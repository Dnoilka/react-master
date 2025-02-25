import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"
import { CartProvider } from "./components/Header/CartContext"
import { Layout } from "antd"
import Subscribe from "./pages/Subscribe"
import CartPage from "./pages/Cart"
import { UserProvider } from "./components/Sider/UserContext"
import EmailVerified from "./pages/EmailVerified"
import ResetPassword from "./pages/ResetPassword"
import EmailVerificationHandler from "./pages/EmailVerificationHandler"

export default function App() {
  return (
    <Router>
      <CartProvider>
        <UserProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route
                path="/verify-email"
                element={<EmailVerificationHandler />}
              />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </Layout>
        </UserProvider>
      </CartProvider>
    </Router>
  )
}
