import React, { useContext } from 'react';
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  InputNumber,
  Divider,
} from 'antd';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';
import CustomFooter from '../components/Footer/Footer';
import { CartContext } from '../components/Header/CartContext';
import { ThemeContext } from '../components/Sider/ThemeContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';
  const cardBackground = isDarkMode ? '#1c1c1c' : '#fff';

  const handleQuantityChange = (item, value) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id &&
        cartItem.color === item.color &&
        cartItem.size === item.size
          ? { ...cartItem, quantity: value }
          : cartItem
      )
    );
  };

  const handleRemove = (item) => {
    setCartItems((prev) =>
      prev.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.color === item.color &&
            cartItem.size === item.size
          )
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Content style={{ padding: 24, backgroundColor }}>
          <Row gutter={24}>
            <Col span={16}>
              <Title level={2} style={{ color: textColor }}>
                Корзина ({cartItems.length} товар
                {cartItems.length % 10 === 1 && cartItems.length !== 11
                  ? ''
                  : 'а'}
                )
              </Title>
              {cartItems.length === 0 ? (
                <Text style={{ color: textColor }}>Ваша корзина пуста</Text>
              ) : (
                cartItems.map((item, index) => (
                  <Row
                    key={index}
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      background: cardBackground,
                      borderRadius: 8,
                      boxShadow: isDarkMode
                        ? 'none'
                        : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Col span={4}>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                    </Col>
                    <Col span={16}>
                      <Link
                        to={`/products/${item.id}`}
                        style={{ color: textColor }}
                      >
                        <Text strong>{item.name}</Text>
                      </Link>
                      <p style={{ color: textColor }}>Цвет: {item.color}</p>
                      <p style={{ color: textColor }}>Размер: {item.size}</p>
                      <Text style={{ color: '#cf1322', fontSize: 16 }}>
                        {item.price.toLocaleString()}₽
                      </Text>
                      {item.oldPrice > 0 && (
                        <Text
                          delete
                          style={{ color: '#8c8c8c', marginLeft: 8 }}
                        >
                          {item.oldPrice.toLocaleString()}₽
                        </Text>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(item, value)
                          }
                        />
                      </div>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleRemove(item)}
                      >
                        Удалить
                      </Button>
                    </Col>
                  </Row>
                ))
              )}
            </Col>
            <Col span={8}>
              <div
                style={{
                  padding: 24,
                  background: cardBackground,
                  borderRadius: 8,
                  boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Title level={3} style={{ color: textColor }}>
                  Сумма заказа
                </Title>
                <Divider
                  style={{ background: isDarkMode ? '#303030' : '#e8e8e8' }}
                />
                <Text style={{ color: textColor }}>Итого: </Text>
                <Text strong style={{ color: textColor, fontSize: 18 }}>
                  {totalPrice.toLocaleString()}₽
                </Text>
                <Button
                  type="primary"
                  block
                  style={{
                    marginTop: 16,
                    background: '#000',
                    borderColor: '#000',
                  }}
                >
                  Оформить заказ
                </Button>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
};

export default CartPage;
