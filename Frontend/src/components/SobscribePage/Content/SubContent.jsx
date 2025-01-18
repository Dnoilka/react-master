import React, { useContext, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Layout,
  message,
} from 'antd';
import { ThemeContext } from '../../Sider/ThemeContext';

const { Title, Paragraph } = Typography;

const SubscriptionForm = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';

  const [loading, setLoading] = useState(false); // Состояние загрузки

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(data.message);
      } else {
        message.error(data.message || 'Ошибка подписки!');
      }
    } catch (error) {
      message.error('Ошибка подключения к серверу!');
    } finally {
      setLoading(false);
    }
  };

  const ContentStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
  };

  return (
    <Layout style={ContentStyle}>
      <section
        style={{
          backgroundColor: backgroundColor,
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'repeating-linear-gradient(45deg, transparent, transparent 20px, #a87c53 20px, #a87c53 40px)',
            zIndex: 0,
          }}
        ></div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: isDarkMode
              ? 'rgba(18, 23, 42, 0.7)'
              : 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            color: textColor,
            textAlign: 'center',
            transition: 'color 0.3s ease',
          }}
        >
          <Title
            level={1}
            style={{
              fontSize: '48px',
              fontWeight: 700,
              marginBottom: '20px',
              color: textColor,
              transition: 'color 0.3s ease',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            Салон мужской одежды
          </Title>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: '#eab676',
              borderColor: '#eab676',
              fontWeight: 'bold',
              padding: '12px 24px',
              color: isDarkMode ? '#000' : '#fff',
              fontFamily: 'Sherif, serif',
            }}
            onClick={() => alert('За покупками!')}
          >
            За покупками
          </Button>
        </div>
      </section>
      <div
        style={{ margin: '0 auto', padding: '50px 20px', textAlign: 'center' }}
      >
        <Card
          style={{
            margin: '0 auto',
            padding: '40px',
            textAlign: 'left',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: isDarkMode ? '#1c2233' : '#fff',
            transition: 'background-color 0.3s ease',
            color: textColor,
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: 'center',
              fontSize: '36px',
              marginBottom: '10px',
              color: textColor,
            }}
          >
            Дополнительная скидка 10%
          </Title>
          <Paragraph
            style={{
              textAlign: 'center',
              fontSize: '16px',
              color: isDarkMode ? '#ddd' : '#777',
              marginBottom: '20px',
            }}
          >
            за подписку на наши новости
          </Paragraph>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Введите корректный e-mail!',
                },
              ]}
            >
              <Input
                placeholder="Введите ваш e-mail"
                size="large"
                style={{
                  color: textColor,
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff', // добавляем фоновый цвет
                }}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('Необходимо принять условия!')
                        ),
                },
              ]}
            >
              <Checkbox style={{ color: textColor }}>
                Согласен получать рассылку о выгодных предложениях
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: '100%',
                  backgroundColor: '#eab676',
                  borderColor: '#eab676',
                  color: isDarkMode ? '#000' : '#fff',
                }}
                loading={loading}
              >
                Подписаться
              </Button>
            </Form.Item>
          </Form>

          <div
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#aaa' : '#666',
              marginTop: '30px',
            }}
          >
            <Paragraph
              style={{ fontSize: '14px', marginTop: '30px', color: textColor }}
            >
              Подпишитесь на рассылку и подтвердите подписку, перейдя по ссылке
              в письме, которое мы вышлем на ваш e-mail. Получите скидку 10% по
              промокоду.
            </Paragraph>
            <Paragraph
              style={{ fontSize: '14px', marginTop: '30px', color: textColor }}
            >
              Промокод является уникальным и может быть применен только один
              раз. Скидка действует при любой сумме заказа и распространяется на
              любые товары продавца.
            </Paragraph>
            <Paragraph
              style={{ fontSize: '14px', marginTop: '30px', color: textColor }}
            >
              Дополнительная скидка по программе лояльности Dominik не
              применяется совместно с данным промокодом.
            </Paragraph>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionForm;
