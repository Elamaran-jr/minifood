import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [toastKey, setToastKey] = useState(0);
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

  const showCartToast = (msg) => {
    setToastMsg(msg);
    setToastKey(Date.now());
    // Auto-clear after 3 seconds
    setTimeout(() => setToastMsg(''), 3010);
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, updateCartCount, fetchCartCount, resetCartCount, 
      toastMsg, toastKey, showCartToast 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
