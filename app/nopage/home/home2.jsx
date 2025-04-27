"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
  </div>
);

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products", {
                    headers: {
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-c1 min-h-screen py-4 mb-20">
            <div className="container mx-auto px-6">
                <motion.h1
                    className="text-2xl md:text-4xl font-bold text-center mb-14 text-c4 tracking-wide"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Crafted Elegance Collection
                </motion.h1>

                <motion.div
                    className="grid gap-6 grid-cols-2 md:grid-cols-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="overflow-hidden">
                                <div className="relative w-full md:h-72 h-52 overflow-hidden">
                                    <Skeleton className="w-full h-full" />
                                </div>
                                <div className="py-4 px-1 text-start">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <div className="flex justify-start items-center space-x-2 mt-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <motion.div
                                key={product._id}
                                className="overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={`/products/${product._id}`}>
                                    <div>
                                        <div className="relative w-full md:h-72 h-52 overflow-hidden">
                                            <motion.img
                                                src={product.img1}
                                                alt={product.productName}
                                                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                initial={{ opacity: 1 }}
                                                whileHover={{ opacity: 0 }}
                                            />
                                            <motion.img
                                                src={product.img2}
                                                alt={`${product.productName} Hover`}
                                                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            />
                                        </div>
                                        <div className="py-4 px-1 text-start">
                                            <h2 className="text-xl font-semibold text-c4">{product.productName}</h2>
                                            <div className="flex justify-start items-center space-x-2 mt-2">
                                                <p className="text-sm text-gray-500 line-through">Rs.{product.strikeoutPrice}</p>
                                                <p className="text-xl text-c4 font-semibold">Rs.{product.originalPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* View More Button - Only show when not loading */}
                {!loading && (
                    <div className="flex justify-center mt-4">
                        <Link href="/shop">
                            <motion.button
                                className="px-6 py-3 text-lg font-semibold border-2 border-c4 hover:text-white hover:bg-c4 rounded-full hover:bg-c4/90 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View More
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}