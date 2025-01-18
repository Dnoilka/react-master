import { React, useContext } from 'react';
import { Layout, Row, Col, Card, Button, Typography, Switch } from 'antd';
import { ThemeContext } from '../../Sider/ThemeContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ContentComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const recommendedProducts = [
    {
      id: 1,
      name: 'Товар 1',
      price: '5000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 2,
      name: 'Товар 2',
      price: '10000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 3,
      name: 'Товар 3',
      price: '15000 рублей',
      img: 'assets/images/popular1.jpg',
    },
  ];

  const bigPopularProducts = [
    {
      id: 1,
      name: 'Большой товар 1',
      price: '5000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 2,
      name: 'Большой товар 2',
      price: '10000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 3,
      name: 'Большой товар 3',
      price: '15000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 4,
      name: 'Большой товар 4',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
  ];

  const popularProducts = [
    {
      id: 1,
      name: 'Популярный товар 1',
      price: '5000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 2,
      name: 'Популярный товар 2',
      price: '10000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 3,
      name: 'Популярный товар 3',
      price: '15000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 4,
      name: 'Популярный товар 4',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 5,
      name: 'Популярный товар 5',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 6,
      name: 'Популярный товар 6',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 7,
      name: 'Популярный товар 7',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
    {
      id: 8,
      name: 'Популярный товар 8',
      price: '20000 рублей',
      img: 'assets/images/popular1.jpg',
    },
  ];

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#12172a' : '#ffffff';
  const sectionBackgroundColor = isDarkMode ? '#333' : '#f4f4f4';
  const textColor = isDarkMode ? '#fff' : '#000';
  const cardBackgroundColor = isDarkMode ? '#1a1a1a' : '#fff';
  const priceColor = isDarkMode ? '#ccc' : '#000';

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: backgroundColor,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Content style={{ padding: '0', overflow: 'hidden' }}>
        <section
          style={{
            backgroundColor: isDarkMode ? '#12172a' : '#f0f0f0',
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

        <section
          style={{
            padding: '50px 0',
            backgroundColor: sectionBackgroundColor,
            transition: 'background-color 0.3s ease',
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              color: textColor,
              transition: 'color 0.3s ease',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            Рекомендуемые товары
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {recommendedProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    backgroundColor: cardBackgroundColor,
                    transition: 'background-color 0.3s ease',
                  }}
                  cover={
                    <img
                      alt={product.name}
                      src={product.img}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: textColor,
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    {product.name}
                  </Title>
                  <p
                    className="price"
                    style={{ color: priceColor, fontFamily: 'Sherif, serif' }}
                  >
                    {product.price}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section
          style={{
            backgroundColor: '#e9dacd',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: 'Playfair Display, serif',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
            }}
          >
            <Title
              level={1}
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '10px',
                fontFamily: 'Playfair Display, serif',
              }}
            >
              50% скидка
            </Title>
            <Paragraph
              style={{
                fontSize: '24px',
                marginBottom: '5px',
                fontFamily: 'Playfair Display, serif',
              }}
            >
              На всю мужскую коллекцию.
            </Paragraph>
            <Paragraph
              style={{
                fontSize: '24px',
                marginBottom: '20px',
                fontFamily: 'Playfair Display, serif',
              }}
            >
              Не пропустите
            </Paragraph>
            <Button
              type="default"
              size="large"
              style={{
                padding: '10px 30px',
                fontSize: '18px',
                backgroundColor: 'transparent',
                border: '2px solid #000',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => alert('За покупками!')}
            >
              За покупками
            </Button>
          </div>
        </section>

        <section style={{ padding: '50px 0', paddingLeft: '10px' }}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              color: textColor,
              transition: 'color 0.3s ease',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            С НАИБОЛЬШЕЙ ПОПУЛЯРНОСТЬЮ
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {bigPopularProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  style={{
                    width: '95%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    backgroundColor: cardBackgroundColor,
                    transition: 'background-color 0.3s ease',
                  }}
                  cover={
                    <img
                      alt={product.name}
                      src={product.img}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: textColor,
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    {product.name}
                  </Title>
                  <p className="price" style={{ color: priceColor }}>
                    {product.price}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section
          style={{
            padding: '50px 0',
            paddingLeft: '10px',
            backgroundColor: sectionBackgroundColor,
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              color: textColor,
              transition: 'color 0.3s ease',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            ПОПУЛЯРНЫЕ ТОВАРЫ
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {popularProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  style={{
                    width: '95%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    backgroundColor: cardBackgroundColor,
                    transition: 'background-color 0.3s ease',
                  }}
                  cover={
                    <img
                      alt={product.name}
                      src={product.img}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: textColor,
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    {product.name}
                  </Title>
                  <p className="price" style={{ color: priceColor }}>
                    {product.price}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  );
};

export default ContentComponent;
