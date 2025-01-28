import React, { useState, useEffect, useContext, useCallback } from 'react';
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
  Alert,
  ConfigProvider,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../Sider/ThemeContext';
import { debounce } from 'lodash-es';
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
    subcategories: ['Поло', 'Спортивные костюмы'],
  },
  {
    title: 'Аксессуары',
    subcategories: ['Запонки', 'Ремни'],
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
  'Подобрали для вас': [
    'Подобрали для вас',
    'Новинки',
    'Сначала дороже',
    'Сначала дешевле',
    'По величине скидки',
  ],
  Материалы: ['Хлопок', 'Шерсть', 'Кожа', 'Синтетика'],
  Цвет: ['Красный', 'Синий', 'Зеленый', 'Черный', 'Белый'],
  Размер: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  Бренд: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Gucci'],
  Цена: ['До 1000 ₽', '1000-3000 ₽', '3000-5000 ₽', 'Больше 5000 ₽'],
  'Страна производства': ['Италия', 'Китай', 'Россия', 'Турция'],
};

const ShopContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [onlyWithDiscount, setOnlyWithDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    debounce(async (params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:80/api/products?${params.toString()}`
        );
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append('category', selectedCategory);
    if (selectedSubcategory)
      queryParams.append('subcategory', selectedSubcategory);
    if (onlyWithDiscount) queryParams.append('discount', 'true');

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length) queryParams.append(key, values.join(','));
    });

    fetchProducts(queryParams);
  }, [
    selectedCategory,
    selectedSubcategory,
    onlyWithDiscount,
    activeFilters,
    fetchProducts,
  ]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategoryClick = useCallback((subcategory) => {
    setSelectedSubcategory((prev) =>
      prev === subcategory ? null : subcategory
    );
  }, []);

  const handleFilterChange = useCallback((key, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setOnlyWithDiscount(false);
  }, []);

  const hasActiveFilters =
    Object.values(activeFilters).some((value) => value?.length > 0) ||
    onlyWithDiscount;

  const antTheme = {
    token: {
      colorBgContainer: isDarkMode ? '#1c2233' : '#fff',
      colorText: textColor,
      colorBorder: isDarkMode ? '#2d3746' : '#d9d9d9',
      colorPrimary: '#1890ff',
    },
    components: {
      Dropdown: {
        colorBgElevated: backgroundColor,
        colorText: textColor,
      },
      Card: {
        colorBgContainer: isDarkMode ? '#1c2233' : '#fff',
      },
    },
  };

  return (
    <ConfigProvider theme={antTheme}>
      <Layout style={{ minHeight: '100vh', backgroundColor }}>
        <Sider
          width={240}
          style={{
            backgroundColor,
            padding: '20px',
            overflowY: 'auto',
            borderRight: `1px solid ${antTheme.token.colorBorder}`,
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
                          ? antTheme.token.colorPrimary
                          : textColor,
                      fontWeight: 600,
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
                      background:
                        selectedSubcategory === sub
                          ? '#e6f7ff20'
                          : 'transparent',
                      color:
                        selectedSubcategory === sub
                          ? antTheme.token.colorPrimary
                          : textColor,
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
            {error && (
              <Alert
                message="Ошибка"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 20 }}
              />
            )}

            <Space wrap size="large" style={{ marginBottom: '20px' }}>
              {Object.keys(dropdownMenus).map((key) =>
                key === 'Подобрали для вас' ? (
                  <Dropdown
                    key={key}
                    menu={{
                      items: dropdownMenus[key].map((item) => ({
                        key: item,
                        label: (
                          <Radio
                            value={item}
                            checked={activeFilters[key]?.[0] === item}
                            style={{ color: textColor }}
                          >
                            {item}
                          </Radio>
                        ),
                      })),
                      onClick: ({ key: value }) =>
                        handleFilterChange(key, [value]),
                    }}
                    trigger={['click']}
                  >
                    <Button>
                      {key} <DownOutlined />
                    </Button>
                  </Dropdown>
                ) : (
                  <Dropdown
                    key={key}
                    menu={{
                      items: dropdownMenus[key].map((item) => ({
                        key: item,
                        label: (
                          <Checkbox
                            checked={activeFilters[key]?.includes(item)}
                            style={{ color: textColor }}
                          >
                            {item}
                          </Checkbox>
                        ),
                      })),
                      selectable: true,
                      multiple: true,
                      onSelect: ({ key: value }) => {
                        const currentValues = activeFilters[key] || [];
                        const newValues = currentValues.includes(value)
                          ? currentValues.filter((v) => v !== value)
                          : [...currentValues, value];
                        handleFilterChange(key, newValues);
                      },
                    }}
                    trigger={['click']}
                  >
                    <Button>
                      {key} <DownOutlined />
                    </Button>
                  </Dropdown>
                )
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: textColor }}>Только со скидкой:</Text>
                <Switch
                  checked={onlyWithDiscount}
                  onChange={setOnlyWithDiscount}
                />
              </div>
              {hasActiveFilters && (
                <Button onClick={clearFilters} type="primary" danger>
                  Очистить фильтры
                </Button>
              )}
            </Space>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin tip="Загрузка..." size="large" />
              </div>
            ) : (
              <Row gutter={[16, 16]} justify="start">
                {products.map((product) => (
                  <Col
                    key={product.id}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={4}
                    style={{ minWidth: 250 }}
                  >
                    <Card
                      hoverable
                      cover={
                        <div style={{ height: 250, position: 'relative' }}>
                          <img
                            alt={product.name}
                            src={product.image || '/placeholder.jpg'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {product.discount && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 12,
                              }}
                            >
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                      }
                      bodyStyle={{ padding: 12 }}
                    >
                      <Title
                        level={5}
                        style={{
                          fontSize: 14,
                          marginBottom: 8,
                          color: textColor,
                        }}
                      >
                        {product.name}
                      </Title>

                      <div style={{ marginBottom: 8 }}>
                        {product.rating && (
                          <Text style={{ color: '#faad14', marginRight: 8 }}>
                            ★{product.rating.toFixed(1)}
                          </Text>
                        )}
                        {product.reviews && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ({product.reviews} отзывов)
                          </Text>
                        )}
                      </div>

                      <div>
                        {product.oldPrice && (
                          <Text
                            delete
                            style={{
                              color: '#8c8c8c',
                              marginRight: 8,
                              fontSize: 12,
                            }}
                          >
                            {product.oldPrice}₽
                          </Text>
                        )}
                        <Text
                          style={{
                            color: '#cf1322',
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          {product.price}₽
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {!loading && products.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Text style={{ color: textColor, fontSize: 16 }}>
                  🧐 Товаров не найдено. Попробуйте изменить параметры
                  фильтрации
                </Text>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default ShopContent;
