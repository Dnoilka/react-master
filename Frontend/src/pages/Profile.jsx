import { Layout } from 'antd';
import React from 'react';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import ThemeProvider from '../components/Sider/ThemeContext';
import Content from '../components/HomePage/Content/Content';
import CustomFooter from '../components/Footer/Footer';

const ProfilePage = () => {
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

export default ProfilePage;
