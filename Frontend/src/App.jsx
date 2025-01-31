import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import { Layout } from 'antd';
import Subscribe from './pages/Subscribe';

export default function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Subscribe" element={<Subscribe />} />
        </Routes>
      </Layout>
    </Router>
  );
}
