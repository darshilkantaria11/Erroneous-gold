"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import UserPopup from "./userpopup"; // Single popup component

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-c1 shadow-md text-c4 sticky z-50 transition-all duration-300 ${
        isScrolled ? "top-0" : "top-8 md:top-10"
      }`}
    >
      <div className="md:px-4 flex justify-between items-center">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:scale-110 transform transition">Home</Link>
          <Link href="#" className="hover:scale-110 transform transition">Shop</Link>
          <Link href="#" className="hover:scale-110 transform transition">About Us</Link>
          <Link href="#" className="hover:scale-110 transform transition">Contact Us</Link>
        </div>

        {/* Logo */}
        <div className="flex hover:scale-110 transform transition">
          <Link href="/" className="text-lg font-bold">
            <Image src={Logo} alt="Logo" className="h-auto w-36" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex items-center bg-white border border-c4 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent text-sm w-24 md:w-44 text-c4"
            />
            <FiSearch className="text-gray-500 w-5 h-5" />
          </div>

          {/* Cart */}
          <div className="relative hover:scale-110 transform transition">
            <FiShoppingCart className="w-6 h-6 text-c4" />
            <div className="absolute -top-2 -right-2 bg-c4 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              1
            </div>
          </div>

          {/* User Icon */}
          <div
            onClick={() => setShowUserPopup(true)}
            className="hover:scale-110 transform transition cursor-pointer relative"
          >
            <FiUser className="w-6 h-6 text-c4" />

            {/* User Dropdown (Logged In) */}
            <AnimatePresence>
              {isLoggedIn && showUserPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-8 z-50 bg-white shadow-lg rounded-md overflow-hidden"
                >
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-c4 hover:bg-c2 transition"
                    onClick={() => setShowUserPopup(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setShowUserPopup(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-c4 hover:bg-c2 transition"
                  >
                    Logout
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
        className={`md:hidden overflow-hidden bg-c2 rounded-b-xl`}
      >
        <div className="flex flex-col items-start space-y-3 px-4 py-4 bg-c1 shadow-lg">
          <Link href="#" className="w-full px-4 py-2 bg-c2 text-c4 font-medium rounded-lg transition duration-200">Home</Link>
          <Link href="#" className="w-full px-4 py-2 bg-c2 text-c4 font-medium rounded-lg transition duration-200">Shop</Link>
          <Link href="#" className="w-full px-4 py-2 bg-c2 text-c4 font-medium rounded-lg transition duration-200">About Us</Link>
          <Link href="#" className="w-full px-4 py-2 bg-c2 text-c4 font-medium rounded-lg transition duration-200">Contact Us</Link>
        </div>
      </motion.div>

      {/* UserPopup (for login or dropdown) */}
      {!isLoggedIn && showUserPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <UserPopup
            onClose={() => setShowUserPopup(false)}
            onSuccess={() => {
              setIsLoggedIn(true);
              setShowUserPopup(false);
            }}
          />
        </div>
      )}
    </nav>
  );
}
