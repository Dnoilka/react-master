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
  Empty,
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

const filterOptions = {
  sort: ['Новинки', 'Сначала дороже', 'Сначала дешевле', 'По величине скидки'],
  filters: {
    material: ['Хлопок', 'Шерсть', 'Кожа', 'Синтетика'],
    color: ['Красный', 'Синий', 'Зеленый', 'Черный', 'Белый'],
    size: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    brand: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Gucci'],
    country: ['Италия', 'Китай', 'Россия', 'Турция'],
  },
  priceRanges: ['До 1000 ₽', '1000-3000 ₽', '3000-5000 ₽', 'Больше 5000 ₽'],
};

const filterLabels = {
  material: 'Материалы',
  color: 'Цвет',
  size: 'Размер',
  brand: 'Бренд',
  country: 'Страна производства',
  price: 'Цена',
};

const ShopContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#12172a' : '#f0f0f0';

  const [state, setState] = useState({
    products: [],
    selectedCategory: null,
    selectedSubcategory: null,
    filters: {
      material: [],
      color: [],
      size: [],
      brand: [],
      country: [],
    },
    sort: null,
    priceRange: [],
    onlyWithDiscount: false,
    loading: false,
    error: null,
  });

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (state.selectedCategory) {
      params.append('category', state.selectedCategory);
    }

    if (state.selectedSubcategory) {
      params.append('subcategory', state.selectedSubcategory);
    }

    if (state.onlyWithDiscount) {
      params.append('discount', 'true');
    }

    if (state.sort) {
      params.append('sortBy', state.sort);
    }

    Object.entries(state.filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(key, values.join(','));
      }
    });

    state.priceRange.forEach((range) => {
      switch (range) {
        case 'До 1000 ₽':
          params.append('price', '0-1000');
          break;
        case '1000-3000 ₽':
          params.append('price', '1000-3000');
          break;
        case '3000-5000 ₽':
          params.append('price', '3000-5000');
          break;
        case 'Больше 5000 ₽':
          params.append('price', '5000-');
          break;
        default:
          break;
      }
    });

    return params.toString();
  }, [state]);

  const fetchProducts = useCallback(
    debounce(async (params) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch(
          `http://localhost:80/api/products?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState((prev) => ({ ...prev, products: data }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message || 'Не удалось загрузить товары',
          products: [],
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }, 300),
    []
  );

  useEffect(() => {
    const params = buildQueryParams();
    fetchProducts(params);
  }, [buildQueryParams, fetchProducts]);

  const handleFilterChange = (filterType, values) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [filterType]: values },
    }));
  };

  const handlePriceChange = (values) => {
    setState((prev) => ({ ...prev, priceRange: values }));
  };

  const handleSortChange = (value) => {
    setState((prev) => ({ ...prev, sort: value }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      selectedCategory: null,
      selectedSubcategory: null,
      filters: {
        material: [],
        color: [],
        size: [],
        brand: [],
        country: [],
      },
      priceRange: [],
      onlyWithDiscount: false,
      sort: null,
    }));
  };

  const hasActiveFilters =
    Object.values(state.filters).some((v) => v.length > 0) ||
    state.priceRange.length > 0 ||
    state.onlyWithDiscount ||
    state.selectedCategory ||
    state.selectedSubcategory;

  const antTheme = {
    token: {
      colorBgContainer: isDarkMode ? '#1c2233' : '#fff',
      colorText: textColor,
      colorBorder: isDarkMode ? '#2d3746' : '#d9d9d9',
      colorPrimary: '#1890ff',
    },
    components: {
      Card: {
        colorBgContainer: isDarkMode ? '#1c2233' : '#fff',
        colorBorderSecondary: isDarkMode ? '#2d3746' : '#f0f0f0',
      },
      Dropdown: {
        colorBgElevated: isDarkMode ? '#1c2233' : '#fff',
        colorText: textColor,
      },
      Menu: {
        itemBg: isDarkMode ? '#1c2233' : '#fff',
        itemHoverBg: isDarkMode ? '#2d3746' : '#fafafa',
      },
    },
  };

  return (
    <ConfigProvider
      theme={antTheme}
      renderEmpty={() => (
        <Empty
          description="Товаров не найдено"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{
            height: 60,
            filter: isDarkMode ? 'invert(1)' : 'none',
          }}
        />
      )}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor }}>
        <Sider
          width={280}
          style={{
            backgroundColor: antTheme.token.colorBgContainer,
            borderRight: `1px solid ${antTheme.token.colorBorder}`,
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div style={{ padding: '24px 16px' }}>
            <Title
              level={4}
              style={{
                color: textColor,
                marginBottom: 24,
                paddingLeft: 8,
              }}
            >
              Категории
            </Title>
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                borderRight: 0,
              }}
              selectedKeys={[state.selectedCategory, state.selectedSubcategory]}
            >
              {categories.map((category) => (
                <Menu.SubMenu
                  key={category.title}
                  title={
                    <span
                      style={{
                        color:
                          state.selectedCategory === category.title
                            ? antTheme.token.colorPrimary
                            : textColor,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {category.title}
                    </span>
                  }
                  onTitleClick={() =>
                    setState((prev) => ({
                      ...prev,
                      selectedCategory:
                        prev.selectedCategory === category.title
                          ? null
                          : category.title,
                      selectedSubcategory: null,
                    }))
                  }
                >
                  {category.subcategories.map((sub) => (
                    <Menu.Item
                      key={sub}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          selectedSubcategory:
                            prev.selectedSubcategory === sub ? null : sub,
                        }))
                      }
                      style={{
                        background:
                          state.selectedSubcategory === sub
                            ? '#e6f7ff20'
                            : 'transparent',
                        color:
                          state.selectedSubcategory === sub
                            ? antTheme.token.colorPrimary
                            : textColor,
                        fontSize: 14,
                        margin: 4,
                        borderRadius: 6,
                      }}
                    >
                      {sub}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ))}
            </Menu>
          </div>
        </Sider>

        <Content style={{ padding: 24, backgroundColor }}>
          <Space wrap size="middle" style={{ marginBottom: 24, width: '100%' }}>
            <Dropdown
              menu={{
                items: filterOptions.sort.map((item) => ({
                  key: item,
                  label: (
                    <Radio
                      checked={state.sort === item}
                      onChange={() => handleSortChange(item)}
                      style={{ color: textColor }}
                    >
                      {item}
                    </Radio>
                  ),
                })),
              }}
              trigger={['click']}
            >
              <Button style={{ minWidth: 120 }}>
                Сортировка <DownOutlined />
              </Button>
            </Dropdown>

            {Object.entries(filterOptions.filters).map(([key, values]) => (
              <Dropdown
                key={key}
                menu={{
                  items: values.map((value) => ({
                    key: value,
                    label: (
                      <Checkbox
                        checked={state.filters[key].includes(value)}
                        onChange={(e) => {
                          const newValues = e.target.checked
                            ? [...state.filters[key], value]
                            : state.filters[key].filter((v) => v !== value);
                          handleFilterChange(key, newValues);
                        }}
                        style={{ color: textColor }}
                      >
                        {value}
                      </Checkbox>
                    ),
                  })),
                  style: { maxHeight: 300, overflowY: 'auto' },
                }}
                trigger={['click']}
              >
                <Button style={{ minWidth: 140 }}>
                  {filterLabels[key]} <DownOutlined />
                </Button>
              </Dropdown>
            ))}

            <Dropdown
              menu={{
                items: filterOptions.priceRanges.map((range) => ({
                  key: range,
                  label: (
                    <Checkbox
                      checked={state.priceRange.includes(range)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...state.priceRange, range]
                          : state.priceRange.filter((r) => r !== range);
                        handlePriceChange(newValues);
                      }}
                      style={{ color: textColor }}
                    >
                      {range}
                    </Checkbox>
                  ),
                })),
              }}
              trigger={['click']}
            >
              <Button style={{ minWidth: 120 }}>
                {filterLabels.price} <DownOutlined />
              </Button>
            </Dropdown>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 6,
                background: antTheme.token.colorBgContainer,
              }}
            >
              <Text style={{ color: textColor }}>Со скидкой:</Text>
              <Switch
                checked={state.onlyWithDiscount}
                onChange={(checked) =>
                  setState((prev) => ({
                    ...prev,
                    onlyWithDiscount: checked,
                  }))
                }
              />
            </div>

            {hasActiveFilters && (
              <Button onClick={clearFilters} danger style={{ marginLeft: 12 }}>
                Сбросить всё
              </Button>
            )}
          </Space>

          {state.error && (
            <Alert
              type="error"
              message="Ошибка загрузки"
              description={state.error}
              showIcon
              closable
              style={{
                marginBottom: 24,
                border: `1px solid ${isDarkMode ? '#2a1215' : '#ffccc7'}`,
              }}
            />
          )}

          {state.loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: 80,
                background: antTheme.token.colorBgContainer,
                borderRadius: 8,
              }}
            >
              <Spin
                size="large"
                tip="Загрузка товаров..."
                style={{ color: textColor }}
              />
            </div>
          ) : (
            <Row gutter={[24, 24]} justify="start">
              {state.products.map((product) => (
                <Col
                  key={product.id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={4}
                  xxl={3}
                >
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      border: `1px solid ${antTheme.token.colorBorder}`,
                    }}
                    cover={
                      <div
                        style={{
                          height: 320,
                          position: 'relative',
                          background: `url(${
                            product.image || '/placeholder.jpg'
                          }) center/cover no-repeat`,
                        }}
                      >
                        {product.discount && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: '#ff4d4f',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            {product.discount}
                          </div>
                        )}
                      </div>
                    }
                    bodyStyle={{
                      padding: 16,
                      background: antTheme.token.colorBgContainer,
                    }}
                  >
                    <div style={{ minHeight: 110 }}>
                      <Title
                        level={5}
                        style={{
                          fontSize: 15,
                          marginBottom: 8,
                          color: textColor,
                        }}
                        ellipsis={{ rows: 2 }}
                      >
                        {product.name}
                      </Title>

                      <div style={{ marginBottom: 12 }}>
                        {product.rating && (
                          <Text
                            style={{
                              color: '#faad14',
                              marginRight: 8,
                              fontSize: 14,
                            }}
                          >
                            ★{product.rating.toFixed(1)}
                          </Text>
                        )}
                        {product.reviews > 0 && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ({product.reviews} отзывов)
                          </Text>
                        )}
                      </div>

                      <div>
                        {product.oldPrice > 0 && (
                          <Text
                            delete
                            style={{
                              color: '#8c8c8c',
                              marginRight: 8,
                              fontSize: 12,
                            }}
                          >
                            {product.oldPrice.toLocaleString()}₽
                          </Text>
                        )}
                        <Text
                          style={{
                            color: '#cf1322',
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          {product.price.toLocaleString()}₽
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ShopContent;
