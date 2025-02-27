import React from 'react';
import { Typography, Card, Form, Input, Button } from 'antd';
import { useUser } from '../components/Sider/UserContext';
import { Layout } from 'antd';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import ThemeProvider from '../components/Sider/ThemeContext';
import CustomFooter from '../components/Footer/Footer';

const { Title } = Typography;

const Settings = () => {
  const { user } = useUser();

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <div style={{ padding: 24, width: '100%' }}>
            <Card title="Настройки профиля">
              <Title level={4}>Обновить информацию</Title>
              <Form initialValues={user}>
                <Form.Item label="Имя" name="name">
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
                <Button type="primary">Сохранить изменения</Button>
              </Form>
            </Card>
          </div>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default Settings;
