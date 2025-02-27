import React from 'react';
import { Typography, Card, List } from 'antd';
import { Layout } from 'antd';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import ThemeProvider from '../components/Sider/ThemeContext';
import CustomFooter from '../components/Footer/Footer';

const { Title } = Typography;

const Orders = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <div style={{ padding: 24, width: '100%' }}>
            <Card title="Мои заказы">
              <Title level={4}>Активные заказы</Title>
              <List
                locale={{ emptyText: 'У вас нет активных заказов' }}
                dataSource={[]}
                renderItem={() => {}}
              />
            </Card>
          </div>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default Orders;
