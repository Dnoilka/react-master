import React, { useContext, useState } from 'react';
import { Layout, Menu, Input, Button } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ThemeContext } from '../Sider/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { theme } = useContext(ThemeContext);
  const [selectedKey, setSelectedKey] = useState('1');
  const [isCartHovered, setIsCartHovered] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    const item = e.key;
    const params = new URLSearchParams();

    switch (item) {
      case 'Новинки':
        params.set('sortBy', 'Новинки');
        break;
      case 'Одежда':
        params.set('category', 'Одежда');
        break;
      case 'Обувь':
        params.set('category', 'Обувь');
        break;
      case 'Аксессуары':
        params.set('category', 'Аксессуары');
        break;
      case 'SALE%':
        params.set('discount', 'true');
        break;
      default:
        break;
    }

    navigate(`/shop?${params.toString()}`);
    setSelectedKey(item);
  };

  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <Layout.Header
      style={{
        backgroundColor: theme === 'dark' ? '#001529' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '0px',
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
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          Domunuk
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          className="navbar"
          style={{
            flex: 1,
            justifyContent: 'center',
            borderBottom: 'none',
            backgroundColor: theme === 'dark' ? '#001529' : '#fff',
          }}
          onClick={handleMenuClick}
        >
          {['Новинки', 'Одежда', 'Обувь', 'Аксессуары', 'SALE%'].map((item) => (
            <Menu.Item
              key={item}
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                borderBottom: '2px solid transparent',
                color:
                  item === 'SALE%'
                    ? 'red'
                    : selectedKey === item
                    ? theme === 'dark'
                      ? '#1890ff'
                      : '#1890ff'
                    : theme === 'dark'
                    ? '#fff'
                    : '#000',
              }}
            >
              {item}
            </Menu.Item>
          ))}
        </Menu>

        <div
          className="header-right"
          style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          <Search
            placeholder="Поиск"
            style={{
              width: '350px',
              padding: '5px 15px',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
            onSearch={onSearch}
            enterButton
          />

          <Button
            type="link"
            icon={<ShoppingCartOutlined />}
            className="cart-btn"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            style={{
              fontSize: '18px',
              color: isCartHovered
                ? '#1890ff'
                : theme === 'dark'
                ? '#fff'
                : '#000',
              transition: 'color 0.3s',
            }}
          >
            Корзина
          </Button>
        </div>
      </div>
    </Layout.Header>
  );
}
