import React, { useState } from 'react';
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
  Switch,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';

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

const products = [
  {
    id: 1,
    name: 'Mademan Футболка',
    category: 'Одежда',
    subcategory: 'Майки',
    price: 780,
    oldPrice: 2599,
    discount: '-69%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 2,
    name: 'Demix Тайцы',
    category: 'Спорт',
    subcategory: 'Поло',
    price: 1759,
    oldPrice: 3499,
    discount: '-45%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 3,
    name: 'Fila Брюки спортивные',
    category: 'Одежда',
    subcategory: 'Брюки',
    price: 2529,
    oldPrice: 4599,
    discount: '-45%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 4,
    name: 'Envylab Лонгслив Ruff',
    category: 'Одежда',
    subcategory: 'Домашняя одежда',
    price: 1505,
    oldPrice: 5300,
    discount: '-71%',
    image: 'https://via.placeholder.com/200x250',
  },
];

const dropdownMenus = {
  'Подобрали для вас': ['Рекомендуемое', 'Популярное', 'Скидки'],
  Материалы: ['Хлопок', 'Шерсть', 'Кожа', 'Синтетика'],
  Цвет: ['Красный', 'Синий', 'Зеленый', 'Черный'],
  Размер: ['S', 'M', 'L', 'XL', 'XXL'],
  Бренд: ['Nike', 'Adidas', 'Puma', 'Reebok'],
  Цена: ['До 1000 ₽', '1000-3000 ₽', '3000-5000 ₽', 'Больше 5000 ₽'],
  'Страна производства': ['Армения', 'Турция', 'Россия'],
};

const ShopContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [onlyWithDiscount, setOnlyWithDiscount] = useState(false); // Новый фильтр

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Сбрасываем подкатегорию
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleFilterChange = (key, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setOnlyWithDiscount(false); // Сбрасываем фильтр скидок
  };

  const hasActiveFilters =
    Object.values(activeFilters).some((value) => value && value.length > 0) ||
    onlyWithDiscount;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSubcategory =
      !selectedSubcategory || product.subcategory === selectedSubcategory;

    const matchesFilters = Object.entries(activeFilters).every(
      ([key, values]) =>
        values.length === 0
          ? true
          : values.some((value) => product.name.includes(value))
    );

    const matchesDiscount = !onlyWithDiscount || product.discount; // Проверяем наличие скидки

    return (
      matchesCategory && matchesSubcategory && matchesFilters && matchesDiscount
    );
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        style={{
          background: '#fff',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <Title level={4} style={{ marginBottom: '20px', color: '#333' }}>
          Категории
        </Title>
        <Menu
          mode="inline"
          style={{
            border: 'none',
            fontSize: '14px',
          }}
        >
          {categories.map((category) => (
            <Menu.SubMenu
              key={category.title}
              title={category.title}
              onTitleClick={() => handleCategoryClick(category.title)}
              style={{
                background:
                  selectedCategory === category.title ? '#e6f7ff' : '',
                color: selectedCategory === category.title ? '#1890ff' : '',
              }}
            >
              {category.subcategories.map((sub) => (
                <Menu.Item
                  key={sub}
                  onClick={() => handleSubcategoryClick(sub)}
                  style={{
                    background: selectedSubcategory === sub ? '#e6f7ff' : '',
                    color: selectedSubcategory === sub ? '#1890ff' : '',
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
        <Content style={{ padding: '20px', background: '#fff' }}>
          <Space size="large" style={{ marginBottom: '20px' }}>
            {Object.keys(dropdownMenus).map((key) => (
              <Dropdown
                key={key}
                overlay={
                  <div style={{ padding: '10px', background: '#fff' }}>
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
            ))}
            <div>
              <Text>Только со скидкой:</Text>
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
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                >
                  <Title level={5}>{product.name}</Title>
                  <Text delete>{product.oldPrice} ₽</Text>{' '}
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {product.price} ₽
                  </Text>
                  <br />
                  <Text type="danger">{product.discount}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShopContent;
