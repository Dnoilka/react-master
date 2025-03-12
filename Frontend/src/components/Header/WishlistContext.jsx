import React, { createContext, useState, useEffect } from 'react';
import { useUser } from '../Sider/UserContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => setWishlist(data))
        .catch((err) => console.error(err));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    if (!user) {
      alert('Пожалуйста, войдите в систему');
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
      if (response.ok) {
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
