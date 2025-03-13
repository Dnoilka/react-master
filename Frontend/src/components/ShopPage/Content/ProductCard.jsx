import React, { useContext } from 'react';
import { Card, Button, Typography } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { WishlistContext } from '../../Header/WishlistContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const ProductCard = React.memo(({ product, textColor, antTheme }) => {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const isInWishlist = wishlist.includes(product.id);

  return (
    <Link to={`/product/${product.id}`}>
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
        bodyStyle={{ padding: 16, background: antTheme.token.colorBgContainer }}
        actions={[
          <Button
            type="text"
            icon={
              isInWishlist ? (
                <HeartFilled style={{ color: '#ff4d4f' }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={(e) => {
              e.preventDefault();
              isInWishlist
                ? removeFromWishlist(product.id)
                : addToWishlist(product.id);
            }}
          />,
        ]}
      >
        <div style={{ minHeight: 110 }}>
          <Title
            level={5}
            style={{ fontSize: 15, marginBottom: 8, color: textColor }}
            ellipsis={{ rows: 2 }}
          >
            {product.name}
          </Title>
          <div style={{ marginBottom: 12 }}>
            {product.rating && (
              <Text style={{ color: '#faad14', marginRight: 8, fontSize: 14 }}>
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
                style={{ color: '#8c8c8c', marginRight: 8, fontSize: 12 }}
              >
                {product.oldPrice.toLocaleString()}₽
              </Text>
            )}
            <Text style={{ color: '#cf1322', fontWeight: 600, fontSize: 16 }}>
              {product.price.toLocaleString()}₽
            </Text>
          </div>
        </div>
      </Card>
    </Link>
  );
});

export default ProductCard;
