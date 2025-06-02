"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const hasSavedAbandonedCartRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const hasUserLoggedInRef = useRef(false); // Track if user logged in

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(savedCart);
  }, []);

  // Save cart to localStorage when cart changes and handle save logic
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const user = localStorage.getItem("user");
    if (user) {
      hasUserLoggedInRef.current = true;
      handleAbandonedCartSaveLogic(cart);
    }
  }, [cart]);

  // Detect login after cart is added, then start delayed save
  useEffect(() => {
    const checkUserLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && Object.keys(cart).length && !hasUserLoggedInRef.current) {
        hasUserLoggedInRef.current = true;
        handleAbandonedCartSaveLogic(cart); // Start 15 min timer after login
      }
    };

    const handleStorageChange = () => checkUserLogin();
    const interval = setInterval(checkUserLogin, 5000);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [cart]);

  const getShippingParams = () => ({
    weight: process.env.NEXT_PUBLIC_SHIPPING_WEIGHT || 1000,
    length: process.env.NEXT_PUBLIC_SHIPPING_LENGTH || 30,
    width: process.env.NEXT_PUBLIC_SHIPPING_WIDTH || 30,
    height: process.env.NEXT_PUBLIC_SHIPPING_HEIGHT || 30,
  });

  const getTotalItems = () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (productId, productData) => {
    setCart((prev) => {
      const existing = prev[productId] || { quantity: 0 };
      const updatedCart = {
        ...prev,
        [productId]: {
          ...productData,
          quantity: existing.quantity + 1,
          weight: productData.weight,
          dimensions: productData.dimensions,
        },
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

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

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    window.removeEventListener("beforeunload", handleUnload);

    hasSavedAbandonedCartRef.current = false;
    hasUserLoggedInRef.current = false;
  };

  const handleAbandonedCartSaveLogic = (currentCart) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || !Object.keys(currentCart).length) return;

    const { name, phone } = JSON.parse(storedUser);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); // avoid duplicate

    saveTimeoutRef.current = setTimeout(() => {
      if (!hasSavedAbandonedCartRef.current) {
        saveAbandonedCart(name, phone, currentCart);
        hasSavedAbandonedCartRef.current = true;
      }
    }, 15 * 60 * 1000); // 15 min delay after login

    // Also try saving on tab close
    window.removeEventListener("beforeunload", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    function handleUnload() {
      if (!hasSavedAbandonedCartRef.current) {
        saveAbandonedCart(name, phone, currentCart);
        hasSavedAbandonedCartRef.current = true;
      }
    }
  };

  const saveAbandonedCart = async (name, phone, cartData) => {
    if (!phone || !Object.keys(cartData).length) return;

    try {
      await fetch("/api/save-abandoned-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, cart: cartData }),
      });
      console.log("✅ Abandoned cart saved");
    } catch (err) {
      console.error("❌ Failed to save abandoned cart", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getShippingParams,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
