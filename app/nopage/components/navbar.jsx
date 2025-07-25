"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import UserPopup from "./userpopup";
import Searchbar from "./searchbar"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "" });

  const userRef = useRef(null);

  const checkUserLogin = async () => {
    const stored = localStorage.getItem("user");

    if (!stored) return;

    const parsed = JSON.parse(stored);
    const { phone, token } = parsed;

    if (!phone || !token) return;

    try {
      const res = await fetch(`/api/verifyuser?number=${phone}&token=${token}`);
      if (!res.ok) throw new Error("Invalid user");

      const data = await res.json();

      const verifiedUser = {
        name: data.user.name,
        phone: data.user.number,
        token,
        addresses: data.user.addresses || [],
      };

      // Update localStorage in case any field changed
      // localStorage.setItem("user", JSON.stringify(verifiedUser));

      setUser({ name: verifiedUser.name, phone: verifiedUser.phone });
      setIsLoggedIn(true);
    } catch (err) {
      console.warn("Verification failed:", err);
      localStorage.removeItem("user");
      setUser({ name: "", phone: "" });
      setIsLoggedIn(false);
    }
  };



  useEffect(() => {
    checkUserLogin();

    const handleScroll = () => setIsScrolled(window.scrollY > 1);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserClick = () => {
    checkUserLogin();
    setShowUserPopup((prev) => !prev);
  };

  const handleLoginSuccess = ({ name, phone }) => {
    const userData = { name, phone };
    // localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowUserPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({ name: "", phone: "" });
    setShowUserPopup(false);
  };

  return (
    <nav
      className={`bg-c1 shadow-md text-c4 sticky z-50 transition-all duration-300 ${isScrolled ? "top-0" : "top-0 md:top-0"
        }`}
    >
      <div className="md:px-4 pr-2 flex justify-between items-center">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:scale-110 transform transition">
            Home
          </Link>
          {/* <Link href="/shop" className="hover:scale-110 transform transition">
            Shop
          </Link> */}
          <Link href="/about-us" className="hover:scale-110 transform transition">
            About Us
          </Link>
          <Link href="/contact-us" className="hover:scale-110 transform transition">
            Contact Us
          </Link>
        </div>

        {/* Logo */}
        <div className="flex hover:scale-110 transform transition">
          <Link href="/" className="text-lg font-bold">
            <Image src={Logo} alt="Logo" className="h-auto lg:w-36 w-32" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative flex items-center">
            <Searchbar />
          </div>

          {/* Cart */}
          {/* <div className="relative hover:scale-110 transform transition">
            <FiShoppingCart className="w-6 h-6 text-c4" />
            <div className="absolute -top-2 -right-2 bg-c4 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              1
            </div>
          </div> */}

          {/* User Icon + Dropdown */}
          <div
            ref={userRef}
            onClick={handleUserClick}
            className="hover:scale-110 transform transition cursor-pointer relative"
          >
            <FiUser className="w-6 h-6 text-c4" />
            <AnimatePresence>
              {isLoggedIn && showUserPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-10 z-50 w-48 bg-white shadow-xl rounded-md overflow-hidden border border-gray-200"
                >
                  <div className="px-4 py-3 text-sm font-semibold text-c4 border-b-2 border-c4">
                    👋 Hi, {user.name}
                  </div>
                  <Link
                    href="/my-orders"
                    className="block px-4 py-3 text-sm text-c4 hover:bg-gray-100 transition"
                    onClick={() => setShowUserPopup(false)}
                  >
                    🧾 My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition"
                  >
                    🚪 Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Links */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden bg-c2 rounded-b-xl"
      >
        <div className="flex flex-col items-start space-y-3 px-4 py-4 bg-c1 shadow-lg">
          {["Home", "About Us", "Contact Us"].map((label) => (
            <Link
              key={label}
              href="#"
              className="w-full px-4 py-2 bg-c2 text-c4 font-medium  transition duration-200 border-b border-c4"
            >
              {label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Login Popup */}
      {!isLoggedIn && showUserPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <UserPopup
            onClose={() => setShowUserPopup(false)}
            onSuccess={handleLoginSuccess}
          />
        </div>
      )}
    </nav>
  );
}
