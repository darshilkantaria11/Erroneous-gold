"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(savedCart);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Get total items count
  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Add to cart
  const addToCart = (productId, productData) => {
    setCart((prev) => {
      const updatedCart = {
        ...prev,
        [productId]: {
          ...productData,
          quantity: (prev[productId]?.quantity || 0) + 1,
        },
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Ensure immediate sync
      return updatedCart;
    });
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    setCart((prev) => {
      const updatedCart = { ...prev };

      if (newQuantity <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = {
          ...updatedCart[productId],
          quantity: newQuantity,
        };
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
