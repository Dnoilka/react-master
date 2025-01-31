import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Button } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ThemeContext } from '../Sider/ThemeContext';

const { Search } = Input;

const menuItems = [
  { key: 'new', label: 'Новинки', sort: 'Новинки' },
  { key: 'clothes', label: 'Одежда', category: 'Одежда' },
  { key: 'shoes', label: 'Обувь', category: 'Обувь' },
  { key: 'accessories', label: 'Аксессуары', category: 'Аксессуары' },
  { key: 'sale', label: 'SALE%', discount: 'true' },
];

export default function Header() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartHovered, setIsCartHovered] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const currentCategory = queryParams.get('category');
  const currentSort = queryParams.get('sort');
  const currentDiscount = queryParams.get('discount');

  const handleMenuClick = (item) => {
    const params = new URLSearchParams();

    if (item.key === 'sale') {
      params.set('discount', 'true');
    } else if (item.sort) {
      params.set('sort', item.sort);
    } else if (item.category) {
      params.set('category', item.category);
    }

    navigate(`/shop?${params.toString()}`);
  };

  const onSearch = (value) => {
    navigate(`/shop?search=${encodeURIComponent(value)}`);
  };

  const getSelectedKeys = () => {
    if (currentDiscount) return ['sale'];
    if (currentSort) return [currentSort];
    if (currentCategory) return [currentCategory];
    return [];
  };

  return (
    <Layout.Header
      style={{
        backgroundColor: theme === 'dark' ? '#001529' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '0px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <div
          className="logo"
          style={{
            fontFamily: 'Miss Stanfort',
            fontSize: '50px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Domunuk
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderBottom: 'none',
            backgroundColor: 'transparent',
          }}
          onClick={handleMenuClick}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                borderBottom: '2px solid transparent',
                color:
                  item.key === 'sale'
                    ? 'red'
                    : getSelectedKeys().includes(item.key)
                    ? '#1890ff'
                    : 'inherit',
              }}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        <div
          className="header-right"
          style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          <Search
            placeholder="Поиск"
            style={{ width: '350px' }}
            onSearch={onSearch}
            enterButton
          />

          <Button
            type="link"
            icon={<ShoppingCartOutlined />}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            style={{
              fontSize: '18px',
              color: isCartHovered
                ? '#1890ff'
                : theme === 'dark'
                ? '#fff'
                : '#000',
            }}
            onClick={() => navigate('/')} //Позже сделать редирект на страницу корзины
          >
            Корзина
          </Button>
        </div>
      </div>
    </Layout.Header>
  );
}
