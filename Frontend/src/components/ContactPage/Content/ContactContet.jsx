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
          overflowX: 'hidden',
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
                  <div>
                    <Title level={4} style={{ color: textColor }}>
                      Рабочий Телефон
                    </Title>
                    <Paragraph style={{ color: textColor }}>
                      +7 961 943-77-70
                    </Paragraph>
                  </div>
                  <div>
                    <Title level={4} style={{ color: textColor }}>
                      Рабочее Время
                    </Title>
                    <Paragraph style={{ color: textColor }}>
                      Понедельник 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Вторник 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Среда 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Четверг 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Пятница 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Суббота 10:00 - 22:00
                    </Paragraph>
                    <Paragraph style={{ color: textColor }}>
                      Воскресенье 10:00 - 22:00
                    </Paragraph>
                  </div>
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
                  <Input
                    style={{ height: '50px' }}
                    placeholder="Введите ваше имя"
                  />
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
                  <Input
                    style={{ height: '50px' }}
                    placeholder="Введите ваш Email"
                  />
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
                    style={{ width: '100%', height: '50PX' }}
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
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              height: '800px',
            }}
          >
            <a
              href="https://yandex.ru/maps/org/dominik/101442983159/?utm_medium=mapframe&utm_source=maps"
              style={{
                color: '#eee',
                fontSize: '12px',
                position: 'absolute',
                top: 0,
              }}
            >
              Dominik
            </a>
            <a
              href="https://yandex.ru/maps/48/orenburg/category/clothing_store/184107943/?utm_medium=mapframe&utm_source=maps"
              style={{
                color: '#eee',
                fontSize: '12px',
                position: 'absolute',
                top: '14px',
              }}
            >
              Магазин одежды в Оренбурге
            </a>
            <iframe
              src="https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=55.198619%2C51.775612&mode=search&oid=101442983159&ol=biz&sctx=ZAAAAAgBEAAaKAoSCSpWDcLccEtAEcU56ui45ElAEhIJfEYiNIKNzz8RPgPqzaj5tj8iBgABAgMEBSgKOABA258NSAFqAnJ1nQHNzMw9oAEAqAEAvQGfs4zQwgEG96nk8%2FkCggIO0JTQvtC80LjQvdC40LqKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=55.198748%2C51.775612&sspn=0.000963%2C0.000351&text=%D0%94%D0%BE%D0%BC%D0%B8%D0%BD%D0%B8%D0%BA&z=21"
              width="100%"
              height="800"
              frameBorder="1"
              allowFullScreen={true}
              style={{ position: 'relative' }}
            ></iframe>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ContactPage;
