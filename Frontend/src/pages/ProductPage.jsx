import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Button,
  Spin,
  Alert,
  Row,
  Col,
  Rate,
  Select,
  Modal,
  Tabs,
  message,
} from 'antd';
import { ThemeContext } from '../components/Sider/ThemeContext';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import CustomFooter from '../components/Footer/Footer';
import ThemeProvider from '../components/Sider/ThemeContext';
import { HeartOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ProductPage = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSizeChartVisible, setIsSizeChartVisible] = useState(false);
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

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });
      if (response.ok) {
        message.success('Добавлено в вишлист');
      } else {
        message.error('Ошибка добавления в вишлист');
      }
    } catch (err) {
      message.error('Ошибка добавления в вишлист');
    }
  };

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <Content style={{ padding: 24, backgroundColor }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Row gutter={[16, 16]}>
                  {product.images.slice(0, 2).map((image, index) => (
                    <Col span={12} key={index}>
                      <div
                        style={{
                          width: '100%',
                          paddingBottom: '144.18%',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={image}
                          alt={`Фотография товара ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>

                {product.images.length > 2 && (
                  <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {product.images.slice(2).map((image, index) => (
                      <Col span={8} key={index}>
                        <div
                          style={{
                            width: '100%',
                            paddingBottom: '143.93%',
                            position: 'relative',
                          }}
                        >
                          <img
                            src={image}
                            alt={`Фотография товара ${index + 3}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>

              <Col xs={24} md={12}>
                <Title level={2} style={{ color: textColor }}>
                  {product.name}
                </Title>
                <Text style={{ color: textColor, fontSize: 16 }}>
                  Категория: {product.category} / {product.subcategory}
                </Text>

                <div style={{ marginTop: 16 }}>
                  <Rate disabled defaultValue={product.rating} allowHalf />
                  <Text type="secondary">({product.reviews} отзывов)</Text>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Text style={{ color: textColor }}>
                    Бренд: {product.brand}
                  </Text>
                  <br />
                  <Text style={{ color: textColor }}>
                    Материал: {product.material}
                  </Text>
                  <br />
                  <Select
                    style={{ width: 120, marginLeft: 8 }}
                    placeholder="Выберите цвет"
                  >
                    {product.color.map((color) => (
                      <Option key={color} value={color}>
                        {color}
                      </Option>
                    ))}
                  </Select>
                  {product.color}
                  <br />
                  <Text style={{ color: textColor }}>
                    Страна: {product.country}
                  </Text>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Select
                    style={{ width: 120, marginLeft: 8 }}
                    placeholder="Выберите размер"
                  >
                    {product.sizes.map((size) => (
                      <Option key={size} value={size}>
                        {size}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="link"
                    onClick={() => setIsSizeChartVisible(true)}
                  >
                    Таблица размеров
                  </Button>
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
                <Button
                  icon={<HeartOutlined />}
                  style={{ marginTop: 24, marginLeft: 16 }}
                  onClick={handleAddToWishlist}
                >
                  Добавить в вишлист
                </Button>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Описание" key="1">
                  <Text style={{ color: textColor }}>
                    Здесь будет полное описание товара.
                  </Text>
                </TabPane>
                <TabPane tab="Отзывы" key="2">
                  <Text style={{ color: textColor }}>
                    Здесь будут отзывы покупателей.
                  </Text>
                </TabPane>
                <TabPane tab="Вопросы" key="3">
                  <Text style={{ color: textColor }}>
                    Здесь будут вопросы от покупателей.
                  </Text>
                </TabPane>
              </Tabs>
            </div>
          </Content>
        </Layout>
        <CustomFooter />
      </Layout>

      <Modal
        title="Таблица размеров"
        visible={isSizeChartVisible}
        onCancel={() => setIsSizeChartVisible(false)}
        footer={null}
      >
        <p>Здесь будет таблица размеров.</p>
      </Modal>
    </ThemeProvider>
  );
};

export default ProductPage;
