import { Layout } from 'antd';
import React from 'react';
import Header from '../components/page1/Header/Header';
import Sider from '../components/page1/Sider/Sider';
import { ThemeProvider } from '../components/page1/Sider/ThemeContext';
import Content from '../components/page1/Content/Content';
import CustomFooter from '../components/page1/Footer/Footer';

const HomePage = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <Content />
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default HomePage;
