"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Products() {
    const products = [
        { id: 1, name: "Golden Elegance", price: "Rs.49.99", priceo: "Rs.149.99", image: "/product1.jpeg", hoverImage: "/product7.jpeg", slug: "golden-elegance" },
        { id: 2, name: "Timeless Silver", price: "Rs.69.99", priceo: "Rs.199.99", image: "/product12.jpeg", hoverImage: "/product8.jpeg", slug: "timeless-silver" },
        { id: 3, name: "Classic Rose Gold", price: "Rs.89.99", priceo: "Rs.189.99", image: "/product3.jpeg", hoverImage: "/product9.jpeg", slug: "classic-rose-gold" },
        { id: 4, name: "Vintage Charm", price: "Rs.39.99", priceo: "Rs.139.99", image: "/product4.jpeg", hoverImage: "/product10.jpeg", slug: "vintage-charm" },
        { id: 5, name: "Minimalist Pendant", price: "Rs.29.99", priceo: "Rs.129.99", image: "/product5.jpeg", hoverImage: "/product11.jpeg", slug: "minimalist-pendant" },
        { id: 6, name: "Modern Statement", price: "Rs.59.99", priceo: "Rs.159.99", image: "/product6.jpeg", hoverImage: "/product2.jpeg", slug: "modern-statement" },
    ];

    return (
        <div className="bg-c1 min-h-screen py-4">
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
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href={`/products/Rs.{product.slug}`}>
                                <div>
                                    {/* Product Image */}
                                    <div className="relative w-full md:h-72 h-52 overflow-hidden">
                                        {/* Main Image */}
                                        <motion.img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                            initial={{ opacity: 1 }}
                                            whileHover={{ opacity: 0 }}
                                        />
                                        {/* Hover Image */}
                                        <motion.img
                                            src={product.hoverImage}
                                            alt={`Rs.{product.name} Hover`}
                                            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="py-4 px-1 text-start">
                                        <h2 className="text-lg font-semibold text-c4">
                                            {product.name}
                                        </h2>
                                        <div className="flex justify-start items-center space-x-2 mt-2">
                                            <p className="text-sm text-gray-500 line-through">{product.priceo}</p>
                                            <p className="text-lg text-c4 font-semibold">{product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
