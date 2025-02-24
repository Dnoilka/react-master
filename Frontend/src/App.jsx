import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import { CartProvider } from './components/Header/CartContext';
import { Layout } from 'antd';
import Subscribe from './pages/Subscribe';
import CartPage from './pages/Cart';
import { UserProvider } from './components/Sider/UserContext';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <UserProvider>
          <Layout style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/Shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/Subscribe" element={<Subscribe />} />
            </Routes>
          </Layout>
        </UserProvider>
      </CartProvider>
    </Router>
  );
}
