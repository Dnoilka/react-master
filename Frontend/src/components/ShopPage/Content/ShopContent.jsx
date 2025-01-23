// "
// Можешь стилизировать эти dropdown вот так? Вот чтобы они были со стрелочкой,побольше и чтобы в подобрали для вас был выбор еденичный кружочком,а в остальных выбрать можно было бы несколько и они были квадратиком,а также нужна кнопка очистки фильтров
// "

import React from 'react';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Checkbox,
  Dropdown,
} from 'antd';

const { Header, Content, Sider } = Layout;
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
    price: 780,
    oldPrice: 2599,
    discount: '-69%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 2,
    name: 'Demix Тайцы',
    price: 1759,
    oldPrice: 3499,
    discount: '-45%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 3,
    name: 'Fila Брюки спортивные',
    price: 2529,
    oldPrice: 4599,
    discount: '-45%',
    image: 'https://via.placeholder.com/200x250',
  },
  {
    id: 4,
    name: 'Envylab Лонгслив Ruff',
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
};

const createDropdownMenu = (items) => (
  <Menu>
    {items.map((item, index) => (
      <Menu.Item key={index}>{item}</Menu.Item>
    ))}
  </Menu>
);

const ShopContent = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: 0,
          textAlign: 'center',
          fontSize: 18,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Магазин одежды
        </Title>
      </Header>
      <Layout>
        <Sider
          width={240}
          style={{
            background: '#f0f0f0',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <Title level={4}>Категории</Title>
          <Menu mode="inline" style={{ borderRight: 0 }}>
            {categories.map((category, index) => (
              <Menu.SubMenu key={index} title={category.title}>
                {category.subcategories.map((sub, subIndex) => (
                  <Menu.Item key={`${index}-${subIndex}`}>{sub}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ padding: '20px', background: '#fff' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Space size="middle">
                {Object.keys(dropdownMenus).map((key) => (
                  <Dropdown
                    key={key}
                    overlay={createDropdownMenu(dropdownMenus[key])}
                    trigger={['click']}
                  >
                    <Button>{key}</Button>
                  </Dropdown>
                ))}
                <Checkbox>Только со скидкой</Checkbox>
              </Space>
            </Row>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    }
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
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
    </Layout>
  );
};

export default ShopContent;
