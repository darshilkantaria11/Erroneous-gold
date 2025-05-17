"use client"
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

  const getShippingParams = () => {
    return {
      weight: process.env.NEXT_PUBLIC_SHIPPING_WEIGHT || 1000,
      length: process.env.NEXT_PUBLIC_SHIPPING_LENGTH || 30,
      width: process.env.NEXT_PUBLIC_SHIPPING_WIDTH || 30,
      height: process.env.NEXT_PUBLIC_SHIPPING_HEIGHT || 30
    };
  };

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
      const existing = prev[productId] || { quantity: 0 };
      
      const updatedCart = {
        ...prev,
        [productId]: {
          ...productData,
          quantity: existing.quantity + 1,
          weight: productData.weight,
          dimensions: productData.dimensions
        }
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart));
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

  // Clear cart
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart"); // Remove cart from localStorage
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getTotalItems, getTotalPrice, getShippingParams }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
