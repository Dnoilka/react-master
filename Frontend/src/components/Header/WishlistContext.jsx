import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { useUser } from '../Sider/UserContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('/api/wishlist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Ошибка загрузки вишлиста');
          return res.json();
        })
        .then((data) => setWishlist(data))
        .catch((err) => {
          console.error('Ошибка:', err);
          message.error('Не удалось загрузить вишлист');
        });
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    if (!user) {
      message.error('Пожалуйста, войдите в систему');
      return;
    }
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      setWishlist((prev) => [...prev, productId]);
      message.success('Добавлено в вишлист');
    } catch (err) {
      console.error('Ошибка:', err);
      message.error('Не удалось добавить в вишлист');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      setWishlist((prev) => prev.filter((id) => id !== productId));
      message.success('Удалено из вишлиста');
    } catch (err) {
      console.error('Ошибка:', err);
      message.error('Не удалось удалить из вишлиста');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
