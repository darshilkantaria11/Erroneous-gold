"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const { slug } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(""); // Main image state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/fetch/${slug}`, {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
        setMainImage(data.img1 || "/placeholder.jpg"); // Use main image or fallback
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  const additionalImages = [product.img1, product.img2, product.img3, product.img4].filter(Boolean); // Remove empty values

  const dropdownContent = {
    description: product.description || "No description available.",
    materials: product.material || "Materials information not provided.",
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
            alt={product.productName}
            className="w-full h-96 object-cover rounded-lg shadow-md"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Additional Images */}
          {additionalImages.length > 1 && (
            <div className="flex justify-between gap-2">
              {additionalImages.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt={`View ${index + 1}`}
                  className={`w-[calc(25%-0.5rem)] h-24 object-cover rounded-lg cursor-pointer shadow-md transition-transform ${
                    activeImageIndex === index ? "ring-4 ring-c4 scale-105" : "hover:scale-105"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setMainImage(img);
                    setActiveImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{product.productName}</h1>
          <div className="flex flex-row mt-2">
          <p className="text-sm text-gray-500 line-through mt-2 mr-2">Rs. {product.strikeoutPrice}</p>
          <p className="text-2xl font-semibold text-gray-700 ">Rs. {product.originalPrice}</p>
          </div>

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
              className="flex-1 bg-c2 text-black py-3 rounded-lg font-medium transition-all"
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
