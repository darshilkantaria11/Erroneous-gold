"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Products() {
    const products = [
        { id: 1, name: "Golden Elegance", price: "$49.99", priceo: "$149.99", image: "/product1.jpeg", hoverImage: "/product7.jpeg", slug: "golden-elegance" },
        { id: 2, name: "Timeless Silver", price: "$69.99", priceo: "$199.99", image: "/product2.jpeg", hoverImage: "/product8.jpeg", slug: "timeless-silver" },
        { id: 3, name: "Classic Rose Gold", price: "$89.99", priceo: "$189.99", image: "/product3.jpeg", hoverImage: "/product9.jpeg", slug: "classic-rose-gold" },
        { id: 4, name: "Vintage Charm", price: "$39.99", priceo: "$139.99", image: "/product4.jpeg", hoverImage: "/product10.jpeg", slug: "vintage-charm" },
        { id: 5, name: "Minimalist Pendant", price: "$29.99", priceo: "$129.99", image: "/product5.jpeg", hoverImage: "/product11.jpeg", slug: "minimalist-pendant" },
        { id: 6, name: "Modern Statement", price: "$59.99", priceo: "$159.99", image: "/product6.jpeg", hoverImage: "/product12.jpeg", slug: "modern-statement" },
    ];

    return (
        <div className="bg-c1 mt-2 rounded-xl min-h-screen py-10">
            <div className="container mx-auto px-6">
                {/* Heading */}
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-center mb-14 text-c4 tracking-wide"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Crafted Elegance Collection
                </motion.h1>

                {/* Product Grid */}
                <motion.div
                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="relative group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href={`/products/${product.slug}`}>
                                <div>
                                    {/* Product Images */}
                                    <div className="relative w-full h-56 overflow-hidden">
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
                                            alt={`${product.name} Hover`}
                                            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold text-c4 transition duration-300">
                                            {product.name}
                                        </h2>

                                        <div className="flex items-center space-x-2 mt-2">
                                            {/* Original Price */}
                                            <p className="text-lg text-gray-500 line-through">{product.priceo}</p>

                                            {/* Reduced Price */}
                                            <p className="text-xl text-c4 font-semibold">{product.price}</p>
                                        </div>

                                        <button className="mt-6 w-full bg-c2 text-white py-3 rounded-full hover:bg-c4 hover:shadow-lg transition-all duration-300">
                                            View Details
                                        </button>
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
