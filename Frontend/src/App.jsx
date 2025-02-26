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
import AuthSuccess from "./pages/AuthSuccess"
import EmailVerificationHandler from "./pages/EmailVerificationHandler"
import PrivateRoute from "./components/PrivateRoute"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import Settings from "./pages/Settings"

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
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
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
