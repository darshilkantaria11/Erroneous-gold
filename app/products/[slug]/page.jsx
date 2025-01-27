"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const productDetails = {
  id: 1,
  name: "Oval Gemstone Signet Ring",
  price: "$40.99",
  description: "This signet's about to be your new signature. It’s an approachable power move, handcrafted in sterling silver.",
  reviews: "200k Reviews",
  image: "/product1.jpeg", // Default main image
  additionalImages: ["/product1.jpeg", "/product2.jpeg", "/product3.jpeg", "/product4.jpeg"],
};

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(productDetails.image); // State for the main image
  const [activeImageIndex, setActiveImageIndex] = useState(0); // State for the active thumbnail index
  const [activeTab, setActiveTab] = useState("description"); // Dropdown state
  const [name, setName] = useState(""); // State for the name input field

  const dropdownContent = {
    description: productDetails.description,
    details: "Handcrafted with sterling silver and oval-cut gemstones. Durable and elegant.",
    materials: "Sterling silver, oval-cut gemstone, eco-friendly packaging.",
  };

  return (
    <div className="bg-c1 rounded-xl py-10">
      <div className="container mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Image */}
          <motion.img
            src={mainImage}
            alt={productDetails.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Additional Images */}
          <div className="flex justify-between gap-2">
            {productDetails.additionalImages.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Additional View ${index + 1}`}
                className={`w-[calc(25%-0.5rem)] h-24 object-cover rounded-lg cursor-pointer shadow-md transition-transform ${
                  activeImageIndex === index
                    ? "ring-4 ring-c2 scale-105"
                    : "hover:scale-105"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setMainImage(img); // Set the clicked image as the main image
                  setActiveImageIndex(index); // Highlight the clicked thumbnail
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{productDetails.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{productDetails.reviews}</p>
          <p className="text-2xl font-semibold text-gray-700 mt-4">{productDetails.price}</p>

          {/* Dropdown Section */}
          <div className="mt-6">
            <div className="border rounded-lg">
              <div className="flex">
                {Object.keys(dropdownContent).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-4 text-sm font-medium ${
                      activeTab === tab ? "bg-c1 text-black" : "bg-white text-gray-700"
                    } rounded-t-lg focus:outline-none`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-c1 text-black rounded-b-lg">
                {dropdownContent[activeTab]}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Your Name</h3>
            <input
              type="text"
              maxLength={10}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max 10 characters"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-c4 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">Your name will be engraved on the product.</p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <motion.button
              className="flex-1 bg-c2 text-white py-3 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
            <motion.button
              className="flex-1 bg-c4 text-white py-3 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
