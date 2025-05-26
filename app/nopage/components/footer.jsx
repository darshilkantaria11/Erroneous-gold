"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";

export default function Footer() {
    return (
      
        <footer className="bg-c3/2 text-black pt-16 border-t-2 mt-10">
            <div className="container mx-auto  grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
                {/* Logo + Description */}
                <motion.div
                    className="lg:col-span-2 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image src="/logo.svg" alt="Erroneous Gold Logo" className="w-36" width={100} height={70}/>
                    <p className="text-gray-800 ml-4">
                        At Erroneous Gold, we turn your stories into timeless pieces. Every necklace is uniquely crafted to celebrate love, memories, and individuality.
                    </p>
                    <p className="text-sm text-gray-600 ml-4">"Wear your story, close to your heart."</p>
                </motion.div>

                {/* Policy Links */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold">Policy</h2>
                    <ul className="space-y-2">
                        {[
                            "Privacy Policy",
                            "Terms and Conditions",
                            "Cancellation and Refund",
                            "Shipping and Delivery",
                            "Contact Us",
                        ].map((link) => (
                            <li key={link}>
                                <Link
                                    href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                                    className="text-black hover:text-c4 transition-all"
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold">Quick Links</h2>
                    <ul className="space-y-2">
                        {["Home", "Shop", "Customize", "FAQs"].map((link) => (
                            <li key={link}>
                                <Link
                                    href={`/${link.toLowerCase()}`}
                                    className="text-black hover:text-c4 transition-all"
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Contact Info + Social */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold">Contact</h2>
                    <p className="text-gray-800 text-sm leading-relaxed">
                        St-4, pl.no.19b2, atikaindustry, Rajkot, Gujarat, India, 360002.<br />
                        <a
                            href="https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20your%20jewelry%20collection."
                            className="text-c4 hover:underline block"
                        >
                            📞 +91 98765 43210
                        </a>
                        <a
                            href="mailto:info@erroneousgold.com"
                            className="text-c4 hover:underline block"
                        >
                            ✉️ info@erroneousgold.com
                        </a>
                    </p>

                    <div className="flex space-x-4">
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
                <p className="text-sm text-gray-600">
                    © 2025 ERRONEOUS GOLD PRIVATE LIMITED. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
