import React, { useContext, useState } from 'react';
import { Layout, Menu, Input, Button, Badge } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { ThemeContext } from '../Sider/ThemeContext';
import { WishlistContext } from './WishlistContext';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import LogoBlack from '../../../assets/images/LogoBlack.png';
import LogoWhite from '../../../assets/images/LogoWhite.png';

export default function Header() {
  const { theme } = useContext(ThemeContext);
  const { wishlist } = useContext(WishlistContext);
  const { cartCount } = useContext(CartContext);
  const [selectedKey, setSelectedKey] = useState('1');
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    const item = e.key;
    const params = new URLSearchParams();
    const mappings = {
      Новинки: { sortBy: 'Новинки' },
      Одежда: { category: 'Одежда' },
      Обувь: { category: 'Обувь' },
      Аксессуары: { category: 'Аксессуары' },
      'SALE%': { discount: 'true' },
    };
    if (mappings[item]) {
      Object.entries(mappings[item]).forEach(([key, value]) =>
        params.set(key, encodeURIComponent(value))
      );
    }
    navigate(`/shop?${params.toString()}`);
    setSelectedKey(item);
  };

  const { Search } = Input;
  const onSearch = (value) =>
    navigate(`/shop?search=${encodeURIComponent(value)}`);

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: theme === 'dark' ? '#001529' : '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
        height: 80,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            flexShrink: 0,
            height: '80px',
          }}
          onClick={() => navigate('/')}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src={theme === 'dark' ? LogoWhite : LogoBlack}
            alt="Senator Logo"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            minWidth: 600,
            justifyContent: 'center',
            margin: '0 32px',
            fontSize: '1rem',
            fontWeight: 500,
            userSelect: 'none',
          }}
          onClick={handleMenuClick}
          theme={theme}
        >
          {['Новинки', 'Одежда', 'Обувь', 'Аксессуары', 'SALE%'].map((item) => (
            <Menu.Item
              key={item}
              style={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                margin: '0 8px',
                color:
                  item === 'SALE%'
                    ? '#e74c3c'
                    : theme === 'dark'
                    ? 'rgba(255,255,255,0.85)'
                    : '#2d3436',
                transition: 'all 0.3s ease',
                ...(selectedKey === item && {
                  borderBottomColor: theme === 'dark' ? '#1890ff' : '#2d3436',
                  color: theme === 'dark' ? '#1890ff' : '#2d3436',
                }),
              }}
            >
              {item}
            </Menu.Item>
          ))}
        </Menu>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexShrink: 0,
          }}
        >
          <Search
            placeholder="Поиск товаров..."
            enterButton={
              <Button
                type="primary"
                style={{
                  backgroundColor: theme === 'dark' ? '#1890ff' : '#2d3436',
                  borderColor: theme === 'dark' ? '#1890ff' : '#2d3436',
                }}
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            onSearch={onSearch}
            style={{
              maxWidth: 400,
              borderRadius: 5,
              overflow: 'hidden',
            }}
            allowClear
          />

          <Badge count={wishlist.length} offset={[-8, 8]} color="#ff4d4f">
            <Button
              type="text"
              icon={<HeartOutlined style={{ fontSize: 24 }} />}
              style={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                color: isWishlistHovered
                  ? theme === 'dark'
                    ? '#40a9ff'
                    : '#1890ff'
                  : theme === 'dark'
                  ? '#ffffff'
                  : '#2d3436',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={() => setIsWishlistHovered(true)}
              onMouseLeave={() => setIsWishlistHovered(false)}
              onClick={() => navigate('/wishlist')}
            >
              <span style={{ marginLeft: 8 }}>Вишлист</span>
            </Button>
          </Badge>

          <Badge count={cartCount} offset={[-8, 8]} color="#e74c3c">
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              style={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                color: isCartHovered
                  ? theme === 'dark'
                    ? '#40a9ff'
                    : '#1890ff'
                  : theme === 'dark'
                  ? '#ffffff'
                  : '#2d3436',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
              onClick={() => navigate('/cart')}
            >
              <span style={{ marginLeft: 8 }}>Корзина</span>
            </Button>
          </Badge>
        </div>
      </div>
    </Layout.Header>
  );
}
