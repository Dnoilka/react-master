import React, { useContext, useState, useEffect } from "react"
import { Layout, Row, Col, Typography, Button } from "antd"
import { ThemeContext } from "../../Sider/ThemeContext"
import ProductCard from "../../ShopPage/Content/ProductCard" // Импорт ProductCard
import { Link } from "react-router-dom"

const { Content } = Layout
const { Title, Paragraph } = Typography

const ContentComponent = () => {
  const { theme } = useContext(ThemeContext)
  const isDarkMode = theme === "dark"
  const backgroundColor = isDarkMode ? "#12172a" : "#ffffff"
  const textColor = isDarkMode ? "#fff" : "#000"

  // Определение темы для Ant Design, аналогично ShopContent
  const antTheme = {
    token: {
      colorBgContainer: isDarkMode ? "#1c2233" : "#fff",
      colorText: textColor,
      colorBorder: isDarkMode ? "#2d3746" : "#d9d9d9",
      colorPrimary: "#1890ff",
    },
    components: {
      Card: {
        colorBgContainer: isDarkMode ? "#1c2233" : "#fff",
        colorBorderSecondary: isDarkMode ? "#2d3746" : "#f0f0f0",
      },
    },
  }

  // Состояния для хранения товаров
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [bigPopularProducts, setBigPopularProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])

  // Загрузка данных с сервера при монтировании компонента
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products?sort=random&limit=3"
        )
        const data = await response.json()
        setRecommendedProducts(data.products)
      } catch (error) {
        console.error("Ошибка загрузки рекомендуемых товаров:", error)
      }
    }

    const fetchBigPopular = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products?sort=reviews_desc&limit=4"
        )
        const data = await response.json()
        // Перемешиваем на клиенте для случайного порядка
        const shuffled = data.products.sort(() => 0.5 - Math.random())
        setBigPopularProducts(shuffled)
      } catch (error) {
        console.error(
          "Ошибка загрузки товаров с наибольшей популярностью:",
          error
        )
      }
    }

    const fetchPopular = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products?min_reviews=10&sort=random&limit=8"
        )
        const data = await response.json()
        setPopularProducts(data.products)
      } catch (error) {
        console.error("Ошибка загрузки популярных товаров:", error)
      }
    }

    fetchRecommended()
    fetchBigPopular()
    fetchPopular()
  }, [])

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: backgroundColor,
        transition: "background-color 0.3s ease",
      }}
    >
      <Content style={{ padding: "0", overflow: "hidden" }}>
        {/* Основная секция */}
        <section
          style={{
            backgroundColor: isDarkMode ? "#12172a" : "#f0f0f0",
            height: "100vh",
            position: "relative",
            overflow: "hidden",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "90%",
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 20px, #a87c53 20px, #a87c53 40px)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: isDarkMode
                ? "rgba(18, 23, 42, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              color: textColor,
              textAlign: "center",
              transition: "color 0.3s ease",
            }}
          >
            <Title
              level={1}
              style={{
                fontSize: "48px",
                fontWeight: 700,
                marginBottom: "20px",
                color: textColor,
                transition: "color 0.3s ease",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Салон мужской одежды
            </Title>
            <Link to="/shop">
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "#eab676",
                  borderColor: "#eab676",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  color: isDarkMode ? "#000" : "#fff",
                  fontFamily: "Sherif, serif",
                }}
              >
                За покупками
              </Button>
            </Link>
          </div>
        </section>

        {/* Секция "Рекомендуемые товары" */}
        <section
          style={{
            padding: "50px 0",
            backgroundColor: isDarkMode ? "#333" : "#f4f4f4",
            transition: "background-color 0.3s ease",
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: textColor,
              transition: "color 0.3s ease",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Рекомендуемые товары
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {recommendedProducts.map(product => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                xxl={3}
                key={product.id}
              >
                <ProductCard
                  product={product}
                  textColor={textColor}
                  antTheme={antTheme}
                />
              </Col>
            ))}
          </Row>
        </section>

        {/* Секция со скидкой */}
        <section
          style={{
            backgroundColor: "#e9dacd",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "Playfair Display, serif",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <Title
              level={1}
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "10px",
                fontFamily: "Playfair Display, serif",
              }}
            >
              50% скидка
            </Title>
            <Paragraph
              style={{
                fontSize: "24px",
                marginBottom: "5px",
                fontFamily: "Playfair Display, serif",
              }}
            >
              На всю мужскую коллекцию.
            </Paragraph>
            <Paragraph
              style={{
                fontSize: "24px",
                marginBottom: "20px",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Не пропустите
            </Paragraph>
            <Link to="/shop">
              <Button
                type="default"
                size="large"
                style={{
                  padding: "10px 30px",
                  fontSize: "18px",
                  backgroundColor: "transparent",
                  border: "2px solid #000",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                За покупками
              </Button>
            </Link>
          </div>
        </section>

        {/* Секция "С наибольшей популярностью" */}
        <section style={{ padding: "50px 0", paddingLeft: "10px" }}>
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: textColor,
              transition: "color 0.3s ease",
              fontFamily: "Playfair Display, serif",
            }}
          >
            С НАИБОЛЬШЕЙ ПОПУЛЯРНОСТЬЮ
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {bigPopularProducts.map(product => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                xxl={3}
                key={product.id}
              >
                <ProductCard
                  product={product}
                  textColor={textColor}
                  antTheme={antTheme}
                />
              </Col>
            ))}
          </Row>
        </section>

        {/* Секция "Популярные товары" */}
        <section
          style={{
            padding: "50px 0",
            paddingLeft: "10px",
            backgroundColor: isDarkMode ? "#333" : "#f4f4f4",
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: textColor,
              transition: "color 0.3s ease",
              fontFamily: "Playfair Display, serif",
            }}
          >
            ПОПУЛЯРНЫЕ ТОВАРЫ
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {popularProducts.map(product => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                xxl={3}
                key={product.id}
              >
                <ProductCard
                  product={product}
                  textColor={textColor}
                  antTheme={antTheme}
                />
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  )
}

export default ContentComponent
