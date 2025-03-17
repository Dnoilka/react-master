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
import { HeartOutlined } from '@ant-design/icons';
import { CartContext } from '../components/Header/CartContext';
import { WishlistContext } from '../components/Header/WishlistContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ProductPage = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSizeChartVisible, setIsSizeChartVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
    );
  }

  if (error) {
    return (
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
    );
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);
      message.success('Добавлено в вишлист');
    } catch (err) {
      message.error('Ошибка добавления в вишлист');
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      message.error('Пожалуйста, выберите цвет и размер');
      return;
    }
    addToCart(
      { ...product, color: selectedColor, size: selectedSize },
      selectedColor,
      selectedSize
    );
    setIsCartModalVisible(true);
  };

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Content style={{ padding: 24, backgroundColor }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              {product.images.length <= 4 ? (
                <Row gutter={[16, 16]}>
                  {product.images.map((image, index) => (
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
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setSelectedImage(image);
                            setIsImageModalVisible(true);
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <>
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
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setSelectedImage(image);
                              setIsImageModalVisible(true);
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
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
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setSelectedImage(image);
                              setIsImageModalVisible(true);
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
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
                <Text style={{ color: textColor }}>Бренд: {product.brand}</Text>
                <br />
                <Text style={{ color: textColor }}>
                  Материал: {product.material}
                </Text>
                <br />
                <Select
                  style={{ width: 120, marginTop: 8 }}
                  placeholder="Выберите цвет"
                  onChange={(value) => setSelectedColor(value)}
                >
                  {product.colors.map((color) => (
                    <Option key={color} value={color}>
                      {color}
                    </Option>
                  ))}
                </Select>
                <br />
                <Text style={{ color: textColor }}>
                  Страна: {product.country}
                </Text>
              </div>
              <div style={{ marginTop: 16 }}>
                <Select
                  style={{ width: 120 }}
                  placeholder="Выберите размер"
                  onChange={(value) => setSelectedSize(value)}
                >
                  {product.sizes.map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
                <Button type="link" onClick={() => setIsSizeChartVisible(true)}>
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
                onClick={handleAddToCart}
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
                  Полное описание товара.
                </Text>
              </TabPane>
              <TabPane tab="Отзывы" key="2">
                <Text style={{ color: textColor }}>Отзывы покупателей.</Text>
              </TabPane>
              <TabPane tab="Вопросы" key="3">
                <Text style={{ color: textColor }}>Вопросы покупателей.</Text>
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
      <CustomFooter />

      {/* Модальное окно таблицы размеров */}
      <Modal
        title="Таблица размеров"
        visible={isSizeChartVisible}
        onCancel={() => setIsSizeChartVisible(false)}
        footer={null}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>
                Европейский размер
              </th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>
                Российский размер
              </th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>
                Обхват груди (см)
              </th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>
                Обхват талии (см)
              </th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>
                Обхват бедер (см)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>XS</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>40-42</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>80-84</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>60-64</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>88-92</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>S</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>42-44</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>84-88</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>64-68</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>92-96</td>
            </tr>
          </tbody>
        </table>
      </Modal>

      {/* Модальное окно подтверждения добавления в корзину */}
      <Modal
        title="Товар добавлен в корзину"
        visible={isCartModalVisible}
        onCancel={() => setIsCartModalVisible(false)}
        footer={[
          <Button key="continue" onClick={() => setIsCartModalVisible(false)}>
            Продолжить покупки
          </Button>,
          <Button key="cart" type="primary" onClick={() => navigate('/cart')}>
            Перейти в корзину
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: 100, marginRight: 16 }}
          />
          <div>
            <Text strong>{product.name}</Text>
            <p>Цвет: {selectedColor}</p>
            <p>Размер: {selectedSize}</p>
            <p>Цена: {product.price.toLocaleString()}₽</p>
            <p>Количество: 1</p>
          </div>
        </div>
      </Modal>

      {/* Модальное окно увеличенного изображения */}
      <Modal
        visible={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width="80%"
      >
        <img
          src={selectedImage}
          alt="Увеличенное изображение"
          style={{ width: '100%' }}
        />
      </Modal>
    </Layout>
  );
};

export default ProductPage;
