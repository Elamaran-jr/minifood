import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const API_URL = 'http://localhost:3000';

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchCartCount = async () => {
    const currentToken = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');
    
    if (!currentToken || currentRole !== 'USER') {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      // Amazon style usually shows total quantity of items
      const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token, role]);

  const updateCartCount = (count) => {
    setCartCount(prev => prev + count);
  };

  const resetCartCount = () => {
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, fetchCartCount, resetCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
