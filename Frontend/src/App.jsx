import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import { CartProvider } from './components/Header/CartContext';
import { Layout } from 'antd';
import Subscribe from './pages/Subscribe';
import { UserProvider } from './components/Sider/UserContext';
import EmailVerified from './pages/EmailVerified';
import ResetPassword from './pages/ResetPassword';
import AuthSuccess from './pages/AuthSuccess';
import EmailVerificationHandler from './pages/EmailVerificationHandler';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import ProductPage from './pages/ProductPage';
import ThemeProvider from './components/Sider/ThemeContext';
import { WishlistProvider } from './components/Header/WishlistContext';
import CartPage from './pages/Cart';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <UserProvider>
            <WishlistProvider>
              <Layout style={{ minHeight: '100vh' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/subscribe" element={<Subscribe />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/email-verified" element={<EmailVerified />} />
                  <Route path="/auth-success" element={<AuthSuccess />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
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
            </WishlistProvider>
          </UserProvider>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}
