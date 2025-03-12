import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Spin, Alert, Row, Col } from 'antd';
import { ThemeContext } from '../components/Sider/ThemeContext';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import CustomFooter from '../components/Footer/Footer';
import ThemeProvider from '../components/Sider/ThemeContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProductPage = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Товар не найден');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';

  if (loading) {
    return (
      <ThemeProvider>
        <Layout>
          <Header />
          <Layout>
            <Sider />
            <Content style={{ padding: 24, backgroundColor }}>
              <Spin size="large" tip="Загрузка товара..." />
            </Content>
          </Layout>
          <CustomFooter />
        </Layout>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <Layout>
          <Header />
          <Layout>
            <Sider />
            <Content style={{ padding: 24, backgroundColor }}>
              <Alert type="error" message="Ошибка" description={error} />
            </Content>
          </Layout>
          <CustomFooter />
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <Content style={{ padding: 24, backgroundColor }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div
                  style={{
                    height: 400,
                    background: `url(${
                      product.image || '/placeholder.jpg'
                    }) center/cover no-repeat`,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title level={2} style={{ color: textColor }}>
                  {product.name}
                </Title>
                <Text style={{ color: textColor, fontSize: 16 }}>
                  Категория: {product.category} / {product.subcategory}
                </Text>
                <div style={{ marginTop: 16 }}>
                  {product.rating && (
                    <Text style={{ color: '#faad14', marginRight: 8 }}>
                      ★{product.rating.toFixed(1)}
                    </Text>
                  )}
                  {product.reviews > 0 && (
                    <Text type="secondary">({product.reviews} отзывов)</Text>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  {product.oldPrice > 0 && (
                    <Text delete style={{ color: '#8c8c8c', marginRight: 8 }}>
                      {product.oldPrice.toLocaleString()}₽
                    </Text>
                  )}
                  <Text
                    style={{ color: '#cf1322', fontSize: 24, fontWeight: 600 }}
                  >
                    {product.price.toLocaleString()}₽
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  style={{ marginTop: 24 }}
                  onClick={() => navigate('/cart')}
                >
                  Добавить в корзину
                </Button>
              </Col>
            </Row>
          </Content>
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
};

export default ProductPage;
