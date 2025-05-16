"use client";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-c3/2 text-black pt-16 border-t-2">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* About Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-2xl font-semibold">About Us</h2>
                    <p className="text-gray-800">
                        At Erroneous gold, we turn your stories into timeless pieces. Every necklace is uniquely crafted to celebrate love, memories, and individuality.
                    </p>
                    <p className="text-sm text-gray-600">&quot;Wear your story, close to your heart.&quot;</p>
                </motion.div>

                {/* Navigation Links */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold">Quick Links</h2>
                    <ul className="space-y-2">
                        {["Home", "Shop", "Customize", "FAQs", "Contact Us"].map((link) => (
                            <li key={link}>
                                <a
                                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                                    className="text-black hover:text-c4 transition-all"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Newsletter Section */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold">Stay Inspired</h2>
                    <p className="text-gray-800">
                        Subscribe to our newsletter for exclusive designs, special offers, and heartfelt inspiration.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch w-full max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 text-gray-800 bg-c1/2 rounded-t-lg sm:rounded-l-lg  focus:outline-none text-sm sm:text-base"
                        />
                        <motion.button
                            className="w-full sm:w-auto px-6 py-3 bg-c4 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-b-none font-medium transition-all text-sm sm:text-base"
                            whileTap={{ scale: 0.95 }}
                        >
                            Subscribe
                        </motion.button>
                    </div>

                    <div className="flex space-x-4 mt-6">
                        {[FaFacebookF, FaTwitter, FaInstagram, FaPinterest].map((Icon, index) => (
                            <motion.a
                                key={index}
                                href="#"
                                className="text-white p-3 rounded-full bg-c4 hover:bg-c1 hover:text-c4 transition-all"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Icon />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Divider */}
            <div className="border-t pb-8 bg-c2 rounded-b-xl border-gray-300 mt-10 pt-6 text-center">
                <div>
                    
                    <p className="text-sm text-gray-600">© 2025 ERRONEOUS GOLD PRIVATE LIMITED. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
