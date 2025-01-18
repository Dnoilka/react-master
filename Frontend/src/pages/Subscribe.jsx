import { Layout } from 'antd';
import React from 'react';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import { ThemeProvider } from '../components/Sider/ThemeContext';
import CustomFooter from '../components/Footer/Footer';
import SubscriptionForm from '../components/SobscribePage/Content/SubContent';
const Subscribe = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <SubscriptionForm />
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default Subscribe;
