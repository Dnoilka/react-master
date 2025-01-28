import React, { useState, useEffect, useContext } from 'react';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Dropdown,
  Checkbox,
  Radio,
  Switch,
  Spin,
  Rate,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../Sider/ThemeContext';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const categories = [
  {
    title: 'Одежда',
    subcategories: [
      'Брюки',
      'Верхняя одежда',
      'Джемперы, свитеры и кардиганы',
      'Джинсы',
      'Домашняя одежда',
      'Комбинезоны',
      'Майки',
      'Нижнее белье',
    ],
  },
  {
    title: 'Спорт',
    subcategories: ['Поло', '1'],
  },
  {
    title: 'Аксессуары',
    subcategories: ['Запонки', '2'],
  },
  {
    title: 'Товары для дома',
    subcategories: ['Постельное белье', 'Кухонные принадлежности'],
  },
  {
    title: 'Красота',
    subcategories: ['Косметика', 'Парфюмерия'],
  },
];

const dropdownMenus = {
  'Подобрали для вас': ['Рекомендуемое', 'Популярное', 'Скидки'],
  Материалы: ['Хлопок', 'Шерсть', 'Кожа', 'Синтетика'],
  Цвет: ['Красный', 'Синий', 'Зеленый', 'Черный', 'Белый'],
  Размер: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  Бренд: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Gucci'],
  Цена: ['До 1000 ₽', '1000-3000 ₽', '3000-5000 ₽', 'Больше 5000 ₽'],
  'Страна производства': ['Италия', 'Китай', 'Россия', 'Турция'],
};

const ShopContent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [onlyWithDiscount, setOnlyWithDiscount] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append('category', selectedCategory);
    if (selectedSubcategory)
      queryParams.append('subcategory', selectedSubcategory);
    if (onlyWithDiscount) queryParams.append('discount', 'true');

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length) queryParams.append(key, values.join(','));
    });

    try {
      const response = await fetch(
        `http://localhost:80/api/products?${queryParams.toString()}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, onlyWithDiscount, activeFilters]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory((prevSubcategory) =>
      prevSubcategory === subcategory ? null : subcategory
    );
  };

  const handleFilterChange = (key, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setOnlyWithDiscount(false);
  };

  const hasActiveFilters =
    Object.values(activeFilters).some((value) => value && value.length > 0) ||
    onlyWithDiscount;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor }}>
      <Sider
        width={240}
        style={{
          backgroundColor,
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <Title level={4} style={{ marginBottom: '20px', color: textColor }}>
          Категории
        </Title>
        <Menu
          mode="inline"
          style={{
            border: 'none',
            fontSize: '14px',
            backgroundColor,
          }}
        >
          {categories.map((category) => (
            <Menu.SubMenu
              key={category.title}
              title={
                <span
                  style={{
                    color:
                      selectedCategory === category.title
                        ? '#1890ff'
                        : textColor,
                  }}
                >
                  {category.title}
                </span>
              }
              onTitleClick={() => handleCategoryClick(category.title)}
            >
              {category.subcategories.map((sub) => (
                <Menu.Item
                  key={sub}
                  onClick={() => handleSubcategoryClick(sub)}
                  style={{
                    background: selectedSubcategory === sub ? '#e6f7ff' : '',
                    color: selectedSubcategory === sub ? '#1890ff' : textColor,
                  }}
                >
                  {sub}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '20px', backgroundColor }}>
          <Space size="large" style={{ marginBottom: '20px' }}>
            {Object.keys(dropdownMenus).map((key) =>
              key === 'Подобрали для вас' ? (
                <Dropdown
                  key={key}
                  overlay={
                    <div style={{ padding: '10px', backgroundColor }}>
                      <Radio.Group
                        options={dropdownMenus[key]}
                        value={activeFilters[key]?.[0] || null}
                        onChange={(e) =>
                          handleFilterChange(
                            key,
                            e.target.value ? [e.target.value] : []
                          )
                        }
                      />
                    </div>
                  }
                  trigger={['click']}
                >
                  <Button>
                    {key} <DownOutlined />
                  </Button>
                </Dropdown>
              ) : (
                <Dropdown
                  key={key}
                  overlay={
                    <div style={{ padding: '10px', backgroundColor }}>
                      <Checkbox.Group
                        options={dropdownMenus[key]}
                        value={activeFilters[key] || []}
                        onChange={(values) => handleFilterChange(key, values)}
                      />
                    </div>
                  }
                  trigger={['click']}
                >
                  <Button>
                    {key} <DownOutlined />
                  </Button>
                </Dropdown>
              )
            )}
            <div>
              <Text style={{ color: textColor }}>Только со скидкой:</Text>
              <Switch
                checked={onlyWithDiscount}
                onChange={(checked) => setOnlyWithDiscount(checked)}
                style={{ marginLeft: '10px' }}
              />
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} type="primary" danger>
                Очистить фильтры
              </Button>
            )}
          </Space>
          {loading ? (
            <Spin tip="Загрузка продуктов..." />
          ) : (
            <Row
              style={{ marginLeft: '-4px', marginRight: '-4px' }}
              gutter={[4, 4]}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <Col
                    key={product.id}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={4}
                    style={{ padding: '4px' }}
                  >
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={product.image}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                          }}
                        />
                      }
                      style={{
                        position: 'relative',
                        backgroundColor: isDarkMode ? '#1c2233' : '#fff',
                        color: textColor,
                        width: '250px',
                        height: '353px',
                      }}
                      onMouseEnter={(e) => {
                        const hoverDiv =
                          e.currentTarget.querySelector('.size-hover');
                        hoverDiv.style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        const hoverDiv =
                          e.currentTarget.querySelector('.size-hover');
                        hoverDiv.style.display = 'none';
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          fontSize: '15px',
                          color: textColor,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name} (
                        {typeof product.rating === 'number' &&
                        !isNaN(product.rating)
                          ? product.rating.toFixed(1) + '★'
                          : 'N/A'}
                        )
                      </Title>
                      {product.oldPrice && (
                        <Text delete style={{ color: textColor }}>
                          {product.oldPrice} ₽
                        </Text>
                      )}{' '}
                      <Text style={{ color: 'red', fontWeight: 'bold' }}>
                        {product.price} ₽
                      </Text>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-50px',
                          left: '0',
                          right: '0',
                          padding: '10px',
                          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                          textAlign: 'center',
                          display: 'none',
                        }}
                        className="size-hover"
                      >
                        {product.sizes &&
                          product.sizes.split(',').map((size) => (
                            <Text key={size} style={{ margin: '0 5px' }}>
                              {size}
                            </Text>
                          ))}
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Text style={{ color: textColor }}>
                  Нет товаров для отображения.
                </Text>
              )}
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShopContent;
