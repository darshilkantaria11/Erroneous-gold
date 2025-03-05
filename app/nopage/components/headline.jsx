"use client";
import { useState } from "react";

export default function ScrollingOffer() {
    const [isHovered, setIsHovered] = useState(false);

    const offers = [
        "🔥 Limited Time Offer: Get 50% Off on All Products! 🔥",
        "🚀 Free Shipping on Orders Over Rs.400! 🚀",
        "🎁 Buy 1 Get 1 Free – This Week Only! 🎁",
    ];

    return (
        <div 
            className="w-full bg-c4 text-c1 py-2 overflow-hidden z-50 shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full flex">
                <div
                    className={`flex whitespace-nowrap animate-scroll ${isHovered ? "paused" : ""}`}
                >
                    {[...Array(1)].map((_, index) => (
                        <div key={index} className="flex min-w-full">
                            {offers.map((offer, i) => (
                                <p key={i} className="text-xs sm:text-sm md:text-base font-semibold px-4 sm:px-8">
                                    {offer}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
