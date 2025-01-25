"use client";
import { useState } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-c1 shadow-md text-c4  rounded-xl my-2 ">
            <div className=" px-4 py-4 flex justify-between items-center ">
                {/* Logo */}
               

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6 ">
                    <Link href="#" className="hover:text-c3">
                        Home
                    </Link>
                    <Link href="#" className="hover:underline">
                        Shop
                    </Link>
                    <Link href="#" className="hover:underline">
                        About Us
                    </Link>
                    <Link href="#" className="hover:underline">
                        Contact Us
                    </Link>
                    
                </div>
                <div className="flex ">
                <Link href="/" className="text-lg font-bold">
                    <span className="text-3xl text-c4">Gold</span>
                </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-4 ">
                    <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none bg-transparent text-sm w-24"
                        />
                        <FiSearch className="text-gray-500 w-5 h-5" />
                    </div>
                    <div className="relative">
                        <FiShoppingCart className="w-6 h-6 text-c4" />
                        <div className="absolute -top-2 -right-2 bg-c4 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            1
                        </div>
                    </div>
                    <FiUser className="w-6 h-6 text-c4" />
                </div>

                {/* Hamburger Menu (Mobile) */}
                <button
                    className="md:hidden text-2xl"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: isOpen ? "auto" : 0 }}
                className={`md:hidden overflow-hidden bg-c2`}
            >
                <div className="flex flex-col items-start space-y-4 px-4 py-4">
                    <Link href="#" className="hover:underline">
                        Home
                    </Link>
                    <Link href="#" className="hover:underline">
                        Shop
                    </Link>
                    <Link href="#" className="hover:underline">
                        About Us
                    </Link>
                    <Link href="#" className="hover:underline">
                        Pages
                    </Link>
                </div>
            </motion.div>
        </nav>
    );
}
