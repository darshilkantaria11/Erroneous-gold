"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logoc.svg"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 1) { // Adjust this value based on when you want the navbar to move up
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`bg-c1 shadow-md text-c4 sticky z-50 transition-all duration-300 ${isScrolled ? "top-0" : "top-8 md:top-10"}`}>
            <div className="px-2 md:px-4 py-2 md:py-4 flex justify-between items-center">
                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="hover:scale-110 transform transition">Home</Link>
                    <Link href="#" className="hover:scale-110 transform transition">Shop</Link>
                    <Link href="#" className="hover:scale-110 transform transition">About Us</Link>
                    <Link href="#" className="hover:scale-110 transform transition">Contact Us</Link>
                </div>
                <div className="flex hover:scale-110 transform transition">
                    <Link href="/" className="text-lg font-bold">
                        <Image src={Logo} className=" h-12 w-12"></Image>
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex items-center bg-white border border-c4 rounded-full px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none bg-transparent text-sm w-24 md:w-44 text-c4"
                        />
                        <FiSearch className="text-gray-500 w-5 h-5" />
                    </div>
                    <div className="relative hover:scale-110 transform transition">
                        <FiShoppingCart className="w-6 h-6 text-c4" />
                        <div className="absolute -top-2 -right-2 bg-c4 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            1
                        </div>
                    </div>
                    <div className="hover:scale-110 transform transition">
                        <FiUser className="w-6 h-6 text-c4" />
                    </div>
                </div>

                {/* Hamburger Menu (Mobile) */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
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
        </nav>
    );
}
