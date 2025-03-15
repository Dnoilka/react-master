import React, { useContext, useState, useCallback } from "react"
import { Card, Button, Typography } from "antd"
import { HeartOutlined, HeartFilled } from "@ant-design/icons"
import { WishlistContext } from "../../Header/WishlistContext"
import { Link } from "react-router-dom"

const { Title, Text } = Typography

const ProductCard = React.memo(({ product, textColor, antTheme }) => {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext)
  const isInWishlist = wishlist.includes(product.id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lastZoneIndex, setLastZoneIndex] = useState(-1)
  const [showIndicators, setShowIndicators] = useState(false)

  const handleMouseMove = useCallback(
    e => {
      if (!product.images || product.images.length <= 1) return

      const rect = e.currentTarget.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const width = rect.width
      const numImages = product.images.length
      const zoneWidth = width / numImages
      const zoneIndex = Math.floor(mouseX / zoneWidth)
      const newIndex = Math.min(Math.max(zoneIndex, 0), numImages - 1)

      if (newIndex !== lastZoneIndex) {
        setCurrentImageIndex(newIndex)
        setLastZoneIndex(newIndex)
      }
    },
    [product.images, lastZoneIndex]
  )

  const handleMouseEnter = () => setShowIndicators(true)
  const handleMouseLeave = () => {
    setShowIndicators(false)
    setCurrentImageIndex(0)
    setLastZoneIndex(-1)
  }

  return (
    <Link to={`/product/${product.id}`}>
      <Card
        hoverable
        style={{
          height: "100%",
          maxWidth: "230px",
          border: `1px solid ${antTheme.token.colorBorder}`,
        }}
        cover={
          <div
            style={{
              height: 320,
              position: "relative",
              background: `url(${
                product.images && product.images[currentImageIndex]
                  ? product.images[currentImageIndex]
                  : "/placeholder.jpg"
              }) center/cover no-repeat`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showIndicators && product.images && product.images.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  right: 5,
                  width: "96%",
                  display: "flex",
                  gap: 2,
                  zIndex: 1,
                }}
              >
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: 4,
                      backgroundColor:
                        index === currentImageIndex
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.3)",
                      transition: "background-color 0.2s",
                    }}
                  />
                ))}
              </div>
            )}
            {product.discount && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {product.discount}
              </div>
            )}
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <Button
                type="text"
                icon={
                  isInWishlist ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined style={{ color: "#000" }} />
                  )
                }
                style={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  isInWishlist
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product.id)
                }}
              />
            </div>
          </div>
        }
        bodyStyle={{ padding: 16, background: antTheme.token.colorBgContainer }}
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
              <Text style={{ color: "#faad14", marginRight: 8, fontSize: 14 }}>
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
                style={{ color: "#8c8c8c", marginRight: 8, fontSize: 12 }}
              >
                {product.oldPrice.toLocaleString()}₽
              </Text>
            )}
            <Text style={{ color: "#cf1322", fontWeight: 600, fontSize: 16 }}>
              {product.price.toLocaleString()}₽
            </Text>
          </div>
        </div>
      </Card>
    </Link>
  )
})

export default ProductCard
