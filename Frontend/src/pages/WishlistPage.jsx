import React, { useState, useEffect, useContext } from 'react';
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Modal,
  Select,
  message,
} from 'antd';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import CustomFooter from '../components/Footer/Footer';
import { WishlistContext } from '../components/Header/WishlistContext';
import { CartContext } from '../components/Header/CartContext';
import { ThemeContext } from '../components/Sider/ThemeContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';
  const cardBackground = isDarkMode ? '#1c1c1c' : '#fff';

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const fetchedProducts = await Promise.all(
        wishlist.map((id) =>
          fetch(`/api/products/${id}`).then((res) => res.json())
        )
      );
      setProducts(fetchedProducts);
    };
    fetchWishlistProducts();
  }, [wishlist]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    setSelectedSize(null);
    setIsModalVisible(true);
  };

  const confirmAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      message.error('Пожалуйста, выберите цвет и размер');
      return;
    }
    addToCart(
      { ...selectedProduct, color: selectedColor, size: selectedSize },
      selectedColor,
      selectedSize
    );
    setIsModalVisible(false);
    message.success('Товар добавлен в корзину');
  };

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Content style={{ padding: 24, backgroundColor }}>
          <Title level={2} style={{ color: textColor }}>
            Вишлист
          </Title>
          {products.length === 0 ? (
            <Text style={{ color: textColor }}>Ваш вишлист пуст</Text>
          ) : (
            products.map((product) => (
              <Row
                key={product.id}
                style={{
                  marginBottom: 16,
                  padding: 16,
                  background: cardBackground,
                  borderRadius: 8,
                  boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Col span={4}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Col>
                <Col span={16}>
                  <Link
                    to={`/products/${product.id}`}
                    style={{ color: textColor }}
                  >
                    <Text strong>{product.name}</Text>
                  </Link>
                  <p style={{ color: textColor }}>
                    Цена:{' '}
                    <Text style={{ color: '#cf1322' }}>
                      {product.price.toLocaleString()}₽
                    </Text>
                    {product.oldPrice > 0 && (
                      <Text delete style={{ color: '#8c8c8c', marginLeft: 8 }}>
                        {product.oldPrice.toLocaleString()}₽
                      </Text>
                    )}
                  </p>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    В корзину
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => removeFromWishlist(product.id)}
                    style={{ marginTop: 8 }}
                  >
                    Удалить
                  </Button>
                </Col>
              </Row>
            ))
          )}
        </Content>
      </Layout>
      <CustomFooter />

      {/* Модальное окно для выбора размера и цвета */}
      <Modal
        title="Выберите цвет и размер"
        visible={isModalVisible}
        onOk={confirmAddToCart}
        onCancel={() => setIsModalVisible(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        {selectedProduct && (
          <div>
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Выберите цвет"
              onChange={(value) => setSelectedColor(value)}
              value={selectedColor}
            >
              {selectedProduct.colors.map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: '100%' }}
              placeholder="Выберите размер"
              onChange={(value) => setSelectedSize(value)}
              value={selectedSize}
            >
              {selectedProduct.sizes.map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default WishlistPage;
