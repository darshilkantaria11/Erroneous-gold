"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ScrollingOffer() {
    const [isHovered, setIsHovered] = useState(false);

    const offers = [
        "🔥 Limited Time Offer: Get 50% Off on All Products! 🔥",
        "🚀 Free Shipping on Orders Over $100! 🚀",
        "🎁 Buy 1 Get 1 Free – This Week Only! 🎁",
       
    ];

    return (
        <div className="fixed top-0 left-0 w-full bg-c4 text-c1 py-2 overflow-hidden z-50 shadow-md">
            <motion.div
                className="flex whitespace-nowrap"
                initial={{ x: "100%" }}
                animate={isHovered ? {} : { x: ["100%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="flex min-w-full">
                        {offers.map((offer, i) => (
                            <p key={i} className="text-xs sm:text-sm md:text-base font-semibold px-4 sm:px-8">
                                {offer}
                            </p>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
