import { Layout } from 'antd';
import React from 'react';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import ThemeProvider from '../components/Sider/ThemeContext';
import CustomFooter from '../components/Footer/Footer';
import ShopContent from '../components/ShopPage/Content/ShopContent';
const Shop = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <ShopContent />
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default Shop;
