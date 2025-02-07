import React, { useState, useContext } from 'react';
import {
  Layout,
  Row,
  Col,
  Typography,
  Input,
  Button,
  List,
  Space,
  Form,
  message,
} from 'antd';
import { ThemeContext } from '../Sider/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function CustomFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const email = values.email;
    setEmail(email);

    try {
      const response = await fetch('http://localhost/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.message === 'Вы уже получили промокод!') {
        message.info('Вы уже получили свой промокод!');
      } else {
        await subscribeEmail(email);
      }
    } catch (error) {
      message.error('Ошибка подключения к серверу!');
    }
  };

  const subscribeEmail = async (email) => {
    try {
      const response = await fetch('http://localhost/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubscribed(true);
        message.success('Спасибо! Мы уже отправили промокод вам на почту.');
      } else {
        message.error(data.message || 'Ошибка подписки!');
      }
    } catch (error) {
      message.error('Ошибка подключения к серверу!');
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Введите корректный email!');
  };

  const isDarkTheme = theme === 'dark';
  const footerStyle = {
    backgroundColor: isDarkTheme ? '#001529' : '#fff',
    color: isDarkTheme ? '#fff' : '#000',
    padding: '30px 50px',
  };

  const baseTextStyle = {
    color: isDarkTheme ? '#fff' : '#000',
    transition: 'color 0.3s ease',
  };

  return (
    <Footer style={footerStyle}>
      <Row gutter={[16, 16]} justify="space-between">
        <Col xs={24} md={8} lg={6}>
          <div
            style={{
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <Title level={4} style={baseTextStyle}>
              Скидка 10% за подписку на новинки и акции
            </Title>
            {!subscribed ? (
              <Form
                name="suscribe"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите ваш email!',
                    },
                    {
                      type: 'email',
                      message: 'Введите корректный email!',
                    },
                  ]}
                >
                  <Input
                    placeholder="Введите ваш Email"
                    style={{
                      marginBottom: '10px',
                      borderRadius: '4px',
                    }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{
                    backgroundColor: isDarkTheme ? '#fff' : '#000',
                    borderColor: isDarkTheme ? '#fff' : '#000',
                    color: isDarkTheme ? '#000' : '#fff',
                    borderRadius: '4px',
                    marginBottom: '10px',
                  }}
                >
                  Подписаться
                </Button>
              </Form>
            ) : (
              <div id="successMessage">
                <div className="success-icon">✔</div>
                <Text style={baseTextStyle}>
                  Спасибо! Мы уже отправили промокод вам на почту.
                </Text>
              </div>
            )}

            <Link
              style={baseTextStyle}
              onClick={() => navigate('/subscribe')}
              onMouseEnter={(e) => (e.target.style.color = '#1890ff')}
              onMouseLeave={(e) =>
                (e.target.style.color = isDarkTheme ? '#fff' : '#000')
              }
            >
              Условия акции
            </Link>
          </div>
        </Col>

        <Col xs={24} md={8} lg={4}>
          <Title level={4} style={baseTextStyle}>
            О НАС
          </Title>
          <List
            dataSource={[
              'Сотрудничество',
              'Стать поставщиком',
              'Отношения с инвесторами',
              'Партнерская программа',
            ]}
            renderItem={(item) => (
              <List.Item>
                <Link
                  href="#"
                  style={baseTextStyle}
                  onMouseEnter={(e) => (e.target.style.color = '#1890ff')}
                  onMouseLeave={(e) =>
                    (e.target.style.color = isDarkTheme ? '#fff' : '#000')
                  }
                >
                  {item}
                </Link>
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} md={8} lg={4}>
          <Title level={4} style={baseTextStyle}>
            ПОЛЕЗНЫЕ ССЫЛКИ
          </Title>
          <List
            dataSource={[
              'Наши контакты',
              'FAQs',
              'Условия',
              'Отслеживайте заказы',
            ]}
            renderItem={(item) => (
              <List.Item>
                <Link
                  href="#"
                  style={baseTextStyle}
                  onMouseEnter={(e) => (e.target.style.color = '#1890ff')}
                  onMouseLeave={(e) =>
                    (e.target.style.color = isDarkTheme ? '#fff' : '#000')
                  }
                >
                  {item}
                </Link>
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} md={8} lg={4}>
          <Title level={4} style={baseTextStyle}>
            ОНЛАЙН ПОКУПКИ
          </Title>
          <List
            dataSource={['Мужская одежда', 'Подарочные карты', 'Аксессуары']}
            renderItem={(item) => (
              <List.Item>
                <Link
                  href="#"
                  style={baseTextStyle}
                  onMouseEnter={(e) => (e.target.style.color = '#1890ff')}
                  onMouseLeave={(e) =>
                    (e.target.style.color = isDarkTheme ? '#fff' : '#000')
                  }
                >
                  {item}
                </Link>
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} md={8} lg={6}>
          <Title level={4} style={baseTextStyle}>
            СПОСОБЫ ОПЛАТЫ
          </Title>
          <Text style={{ ...baseTextStyle, marginBottom: '10px' }}>
            Вы можете оплатить покупки наличными при получении, либо выбрать
            другой способ оплаты.
          </Text>
          <Space
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src="assets/images/виса.svg"
              alt="Visa"
              height="30"
              style={{ marginRight: '15px' }}
            />
            <img
              src="assets/images/download.svg"
              alt="Mastercard"
              height="50"
              style={{ marginRight: '15px' }}
            />
            <img src="/assets/images/мир.svg" alt="MIR" height="20" />
          </Space>
        </Col>
      </Row>
    </Footer>
  );
}
