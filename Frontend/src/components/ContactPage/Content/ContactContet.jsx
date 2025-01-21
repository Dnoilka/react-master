import React, { useContext } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Layout,
  Card,
  Row,
  Col,
  Space,
} from 'antd';
import { ThemeContext } from '../../Sider/ThemeContext';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ContactPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor, color: textColor }}>
      <Content
        style={{
          margin: '0 auto',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          width: '100%',

          boxSizing: 'border-box',
          overflowX: 'hidden', // Убираем горизонтальный скроллинг
        }}
      >
        <section
          style={{
            backgroundColor,
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
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
              width: '100%',
              padding: '0 20px',
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
                width: '100%',
                maxWidth: '300px',
                fontFamily: 'Sherif, serif',
              }}
              onClick={() => alert('За покупками!')}
            >
              За покупками
            </Button>
          </div>
        </section>

        <Row gutter={[40, 40]} style={{ marginTop: 40 }}>
          <Col xs={24} md={12}>
            <Card
              style={{
                backgroundColor: isDarkMode ? '#1c2233' : '#fff',
                color: textColor,
                transition: 'background-color 0.3s ease, color 0.3s ease',
                padding: '20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                height: '100%',
                maxWidth: '100%',
              }}
            >
              <Title level={3} style={{ color: textColor }}>
                Свяжитесь с нами
              </Title>
              <Paragraph style={{ color: textColor }}>
                Мы здесь, чтобы ответить на любые ваши вопросы. Не стесняйтесь
                обращаться через нашу контактную форму или по электронной почте
                или телефону.
              </Paragraph>
              <Space direction="vertical" size="small">
                <div>
                  <Title level={4} style={{ color: textColor }}>
                    Наш адрес
                  </Title>
                  <Paragraph style={{ color: textColor }}>
                    ТРЦ «Армада 2» Нежинское ш., 2а, Оренбург, Оренбургская
                    обл., 460051
                  </Paragraph>
                </div>
                <div>
                  <Title level={4} style={{ color: textColor }}>
                    Email
                  </Title>
                  <Paragraph style={{ color: textColor }}>
                    info@example.com
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              style={{
                backgroundColor: isDarkMode ? '#1c2233' : '#fff',
                color: textColor,
                transition: 'background-color 0.3s ease, color 0.3s ease',
                padding: '20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                height: '100%',
                maxWidth: '100%',
              }}
            >
              <Title level={2} style={{ color: textColor }}>
                Отправьте нам своё сообщение
              </Title>
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите ваше имя!',
                    },
                  ]}
                >
                  <Input placeholder="Введите ваше имя" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите ваш Email!',
                    },
                    { type: 'email', message: 'Введите корректный Email!' },
                  ]}
                >
                  <Input placeholder="Введите ваш Email" />
                </Form.Item>
                <Form.Item
                  name="message"
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите ваше сообщение!',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Введите ваше сообщение"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                  >
                    Отправить
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <Card
          style={{
            backgroundColor: isDarkMode ? '#1c2233' : '#fff',
            color: textColor,
            transition: 'background-color 0.3s ease, color 0.3s ease',
            marginTop: 40,
            maxWidth: '100%',
            borderRadius: '0',
            textAlign: 'center',
          }}
        >
          <Title level={3} style={{ color: textColor }}>
            Мы на карте
          </Title>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2188.9324984619197!2d55.19808606875078!3d51.77363836516874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x417bf7636472d2d5%3A0x44b0bf6517979ff8!2z0KLQoNCmIMKr0JDRgNC80LDQtNCwIDLCuw!5e1!3m2!1sru!2sru!4v1727561865358!5m2!1sru!2sru"
            style={{
              width: '100%',
              height: '800px',
              border: 'none',
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Card>
      </Content>
    </Layout>
  );
};

export default ContactPage;
