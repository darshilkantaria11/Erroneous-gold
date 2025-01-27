"use client";
import { motion } from "framer-motion";

export default function Products() {
  const products = [
    { id: 1, name: "Golden Elegance", price: "$49.99", image: "/product1.jpeg" },
    { id: 2, name: "Timeless Silver", price: "$69.99", image: "/product2.jpeg" },
    { id: 3, name: "Classic Rose Gold", price: "$89.99", image: "/product3.jpeg" },
    { id: 4, name: "Vintage Charm", price: "$39.99", image: "/product1.jpeg" },
    { id: 5, name: "Minimalist Pendant", price: "$29.99", image: "/product2.jpeg" },
    { id: 6, name: "Modern Statement", price: "$59.99", image: "/product3.jpeg" },
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
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover transition-opacity duration-300"
              />
              
              {/* Product Details */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-c4  transition duration-300">
                  {product.name}
                </h2>
                <p className="text-lg text-gray-500 mt-2">{product.price}</p>
                <button className="mt-6 w-full bg-c2 text-white py-3 rounded-xl hover:bg-c3 hover:shadow-lg transition-all duration-300">
                  Add to Cart
                </button>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 z-[-1] bg-c4 opacity-0  transition-opacity duration-500 rounded-2xl"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
