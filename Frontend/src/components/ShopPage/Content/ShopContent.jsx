import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  Layout,
  Menu,
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
  Slider,
  InputNumber,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../Sider/ThemeContext';
import { debounce } from 'lodash-es';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';

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
};

const filterLabels = {
  material: 'Материалы',
  color: 'Цвет',
  size: 'Размер',
  brand: 'Бренд',
  country: 'Страна производства',
};

const ShopContent = () => {
  const { theme } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useSearchParams();
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
    priceRange: [0, 10000],
    onlyWithDiscount: false,
    loading: false,
    error: null,
    isInitialLoad: true,
    currentPage: 1,
    totalPages: 1,
  });

  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [visiblePriceDropdown, setVisiblePriceDropdown] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState(state.priceRange);

  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const discount = searchParams.get('discount') === 'true';
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page')) || 1;

    setState((prev) => ({
      ...prev,
      selectedCategory: category ? decodeURIComponent(category) : null,
      selectedSubcategory: subcategory ? decodeURIComponent(subcategory) : null,
      onlyWithDiscount: discount,
      sort: sortBy ? decodeURIComponent(sortBy) : null,
      currentPage: page,
    }));
  }, [searchParams]);

  useEffect(() => {
    const params = {};

    if (state.selectedCategory)
      params.category = encodeURIComponent(state.selectedCategory);
    if (state.selectedSubcategory)
      params.subcategory = encodeURIComponent(state.selectedSubcategory);
    if (state.onlyWithDiscount) params.discount = 'true';
    if (state.sort) params.sortBy = encodeURIComponent(state.sort);
    params.page = state.currentPage;

    setSearchParams(params);
  }, [
    state.selectedCategory,
    state.selectedSubcategory,
    state.onlyWithDiscount,
    state.sort,
    state.currentPage,
    setSearchParams,
  ]);

  const buildQueryParams = useMemo(() => {
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

    if (
      state.priceRange.length === 2 &&
      (state.priceRange[0] > 0 || state.priceRange[1] < 10000)
    ) {
      params.append('price', `${state.priceRange[0]}-${state.priceRange[1]}`);
    }

    params.append('page', state.currentPage);
    params.append('pageSize', 20);

    return params.toString();
  }, [
    state.selectedCategory,
    state.selectedSubcategory,
    state.onlyWithDiscount,
    state.sort,
    state.filters,
    state.priceRange,
    state.currentPage,
  ]);

  const fetchProducts = useCallback(
    debounce(async (params, signal) => {
      if (state.isInitialLoad) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }
      try {
        const response = await fetch(
          `http://localhost:3000/api/products?${params}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState((prev) => ({
          ...prev,
          products: data.products,
          totalPages: data.totalPages,
          loading: false,
          error: null,
          isInitialLoad: false,
        }));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setState((prev) => ({
            ...prev,
            error: `Ошибка загрузки: ${err.message}. Попробуйте обновить страницу`,
            products: [],
            loading: false,
            isInitialLoad: false,
          }));
        }
      }
    }, 300),
    [state.isInitialLoad]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const params = buildQueryParams;
    fetchProducts(params, signal);

    return () => controller.abort();
  }, [buildQueryParams, fetchProducts]);

  const handleFilterChange = useCallback((filterType, values) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [filterType]: values },
      currentPage: 1,
    }));
  }, []);

  const handlePriceApply = () => {
    setState((prev) => ({
      ...prev,
      priceRange: tempPriceRange,
      currentPage: 1,
    }));
    setVisiblePriceDropdown(false);
  };

  const handleSortChange = (value) => {
    setState((prev) => ({ ...prev, sort: value, currentPage: 1 }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      selectedCategory: null,
      selectedSubcategory: null,
      filters: { material: [], color: [], size: [], brand: [], country: [] },
      priceRange: [0, 10000],
      onlyWithDiscount: false,
      sort: null,
      currentPage: 1,
    }));
    setVisibleDropdown(null);
    setVisiblePriceDropdown(false);
  };

  const handlePageChange = (newPage) => {
    setState((prev) => ({ ...prev, currentPage: newPage }));
  };

  const hasActiveFilters =
    Object.values(state.filters).some((v) => v.length > 0) ||
    state.priceRange[0] > 0 ||
    state.priceRange[1] < 10000 ||
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

  const priceDropdownMenu = (
    <div
      style={{
        padding: 16,
        background: antTheme.token.colorBgContainer,
        width: 300,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text style={{ color: textColor }}>Цена</Text>
        <Slider
          range
          min={0}
          max={10000}
          value={tempPriceRange}
          onChange={(value) => setTempPriceRange(value)}
        />
        <Space>
          <InputNumber
            min={0}
            max={10000}
            value={tempPriceRange[0]}
            onChange={(value) =>
              setTempPriceRange([value || 0, tempPriceRange[1]])
            }
          />
          <Text style={{ color: textColor }}>до</Text>
          <InputNumber
            min={0}
            max={10000}
            value={tempPriceRange[1]}
            onChange={(value) =>
              setTempPriceRange([tempPriceRange[0], value || 0])
            }
          />
        </Space>
        <Button
          type="primary"
          onClick={handlePriceApply}
          style={{ width: '100%' }}
        >
          Применить
        </Button>
      </Space>
    </div>
  );

  return (
    <ConfigProvider
      theme={antTheme}
      renderEmpty={() => (
        <Empty
          description="Товаров не найдено"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 60, filter: isDarkMode ? 'invert(1)' : 'none' }}
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
              style={{ color: textColor, marginBottom: 24, paddingLeft: 8 }}
            >
              Категории
            </Title>
            <Menu
              mode="inline"
              style={{ background: 'transparent', borderRight: 0 }}
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
                      currentPage: 1,
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
                          currentPage: 1,
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
                items: [
                  {
                    label: 'Подобрано для вас',
                    key: 'random',
                    style: {
                      pointerEvents: 'none',
                      padding: '8px 12px',
                      color: isDarkMode ? '#8c8c8c' : '#bfbfbf',
                    },
                    disabled: true,
                  },
                  ...filterOptions.sort.map((item) => ({
                    key: item,
                    label: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'background 0.3s',
                        }}
                        onClick={() => handleSortChange(item)}
                      >
                        <Radio
                          checked={state.sort === item}
                          style={{ pointerEvents: 'none' }}
                        />
                        <span style={{ marginLeft: 12 }}>{item}</span>
                      </div>
                    ),
                  })),
                ],
              }}
              trigger={['click']}
            >
              <Button style={{ minWidth: 120, maxWidth: 200 }}>
                {state.sort ? ` ${state.sort}` : ' Подобрано для вас'}
                <DownOutlined style={{ marginLeft: 12 }} />
              </Button>
            </Dropdown>

            {Object.entries(filterOptions.filters).map(([key, values]) => (
              <Dropdown
                key={key}
                visible={visibleDropdown === key}
                onVisibleChange={(visible) =>
                  setVisibleDropdown(visible ? key : null)
                }
                menu={{
                  items: [
                    ...values.map((value) => ({
                      key: value,
                      label: (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                          }}
                          onClick={() => {
                            const newValues = state.filters[key].includes(value)
                              ? state.filters[key].filter((v) => v !== value)
                              : [...state.filters[key], value];
                            handleFilterChange(key, newValues);
                          }}
                        >
                          <Checkbox
                            checked={state.filters[key].includes(value)}
                            style={{ pointerEvents: 'none' }}
                          />
                          <span style={{ marginLeft: 12 }}>{value}</span>
                        </div>
                      ),
                    })),
                    {
                      key: 'apply',
                      label: (
                        <Button
                          type="primary"
                          onClick={() => setVisibleDropdown(null)}
                          style={{ width: '100%', marginTop: 8 }}
                        >
                          Применить
                        </Button>
                      ),
                    },
                  ],
                }}
                trigger={['click']}
              >
                <Button style={{ minWidth: 120, maxWidth: 200 }}>
                  {filterLabels[key]}
                  {state.filters[key].length > 0 &&
                    ` (${state.filters[key].length})`}
                  <DownOutlined style={{ marginLeft: 12 }} />
                </Button>
              </Dropdown>
            ))}

            <Dropdown
              visible={visiblePriceDropdown}
              onVisibleChange={(visible) => {
                setVisiblePriceDropdown(visible);
                if (visible) setTempPriceRange(state.priceRange);
              }}
              dropdownRender={() => priceDropdownMenu}
              trigger={['click']}
            >
              <Button style={{ minWidth: 120, maxWidth: 200 }}>
                Цена
                {(state.priceRange[0] > 0 || state.priceRange[1] < 10000) &&
                  ` (${state.priceRange[0]} - ${state.priceRange[1]})`}
                <DownOutlined style={{ marginLeft: 12 }} />
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
                    currentPage: 1,
                  }))
                }
              />
            </div>

            {hasActiveFilters && (
              <Button onClick={clearFilters} danger>
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

          {state.loading && state.isInitialLoad ? (
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
            <>
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
                    <ProductCard
                      product={product}
                      textColor={textColor}
                      antTheme={antTheme}
                    />
                  </Col>
                ))}
              </Row>

              <div
                style={{
                  marginTop: 24,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Button
                  onClick={() => handlePageChange(state.currentPage - 1)}
                  disabled={state.currentPage === 1}
                >
                  Назад
                </Button>
                <span style={{ color: textColor, padding: '8px 16px' }}>
                  Страница {state.currentPage} из {state.totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(state.currentPage + 1)}
                  disabled={state.currentPage >= state.totalPages}
                >
                  Вперед
                </Button>
              </div>
            </>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ShopContent;
