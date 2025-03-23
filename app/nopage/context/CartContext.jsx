"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
    setCart(savedCart);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const addToCart = (productId, productData) => {
    setCart(prev => ({
      ...prev,
      [productId]: {
        ...productData,
        quantity: prev[productId]?.quantity + 1 || 1
      }
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prev => {
      const updatedCart = { ...prev };
      
      if (newQuantity <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = {
          ...updatedCart[productId],
          quantity: newQuantity
        };
      }
      
      // Force immediate localStorage update
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);