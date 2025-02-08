import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Badge, Dropdown, Spin } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { ThemeContext } from '../Sider/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import api from './api';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { cartCount, cartItems } = useContext(CartContext);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Получение категорий из API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Обновление выбранных ключей меню при изменении местоположения
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const sortBy = params.get('sortBy');

    if (category) {
      setSelectedKeys([category]);
    } else if (sortBy) {
      setSelectedKeys([sortBy]);
    } else {
      setSelectedKeys([]);
    }
  }, [location]);

  // Обработчик поиска
  const handleSearch = (value) => {
    navigate(`/shop?search=${encodeURIComponent(value)}`);
    setSearchQuery('');
  };

  // Меню категорий
  const categoryMenu = (
    <Menu>
      {categories.map((category) => (
        <Menu.Item
          key={category.id}
          onClick={() => navigate(`/shop?category=${category.slug}`)}
        >
          {category.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Логотип */}
        <div
          style={{
            fontSize: '50px',
            fontFamily: 'Miss Stanfort',
            color: theme === 'dark' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Domunuk
        </div>

        <div style={{ flex: 1, margin: '0 48px' }}>
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            style={{
              backgroundColor: 'transparent',
              borderBottom: 'none',
              justifyContent: 'center',
            }}
          >
            <Menu.Item
              key="new"
              onClick={() => navigate('/shop?sort=new')}
              style={{ fontWeight: 600 }}
            >
              Новинки
            </Menu.Item>

            <Dropdown overlay={categoryMenu} trigger={['hover']}>
              <Menu.Item key="categories" style={{ fontWeight: 600 }}>
                Категории <DownOutlined />
              </Menu.Item>
            </Dropdown>

            <Menu.Item
              key="sale"
              onClick={() => navigate('/shop?sale=true')}
              style={{ color: '#ff4d4f', fontWeight: 600 }}
            >
              SALE
            </Menu.Item>
          </Menu>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Search
            placeholder="Поиск товаров..."
            enterButton={<SearchOutlined />}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            style={{ maxWidth: '400px' }}
          />

          <Badge
            count={cartCount}
            size="small"
            offset={[-10, 10]}
            style={{
              backgroundColor: '#1890ff',
              boxShadow: `0 0 0 2px ${theme === 'dark' ? '#1a1a1a' : '#fff'}`,
            }}
          >
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
              onClick={() => navigate('/cart')}
              style={{
                position: 'relative',
                color: theme === 'dark' ? '#fff' : '#000',
              }}
            />
          </Badge>
        </div>
      </div>

      {!loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '12px',
            paddingBottom: '12px',
          }}
        >
          {categories.slice(0, 5).map((category) => (
            <Button
              key={category.id}
              type="link"
              onClick={() => navigate(`/shop?category=${category.slug}`)}
              style={{
                color: theme === 'dark' ? '#fff' : '#000',
                fontWeight: 500,
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {loading && <Spin style={{ display: 'block', margin: '12px auto' }} />}
    </AntHeader>
  );
};

export default Header;
