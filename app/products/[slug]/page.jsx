"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../nopage/context/CartContext";
import ReviewForm from "../../nopage/components/review"; // adjust the path based on your project structure
import TrustSection from "../../nopage/components/trustsection";
import Checkout from "../../nopage/checkout/checkout"
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
  </div>
);

export default function ProductDetail() {
  const { slug } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [nameError, setNameError] = useState("");
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

  useEffect(() => {
    const cartItem = cart[slug];
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setName(cartItem.name || "");
    } else {
      setQuantity(0);
      setName("");
    }
  }, [cart, slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/fetch/${slug}`, {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
        setMainImage(data.img1 || "/placeholder.jpg");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  const additionalImages = product ? [product.img1, product.img2, product.img3, product.img4].filter(Boolean) : [];

  const dropdownContent = product ? {
    description: product.description || "No description available.",
    materials: product.material || "Materials information not provided.",
  } : {};

  const handleAddToCart = () => {
    if (!name.trim()) {
      setNameError("Please enter a name before adding to cart.");
      return;
    }


    // Add the productName to the cart data
    addToCart(slug, {
      id: slug,
      name,
      productName: product.productName, // Add the productName here
      quantity: 1,
      price: product.originalPrice,
      image: product.img1
    });
  };
  const handleAddToBuy = () => {
    if (!name.trim()) {
      setNameError("Please enter a name before adding to cart.");
      return;
    }

    const cartItem = cart[slug];

    if (!cartItem) {
      // Add the product only if it's not already in the cart
      addToCart(slug, {
        id: slug,
        name,
        productName: product.productName,
        quantity: 1,
        price: product.originalPrice,
        image: product.img1
      });
    }

    // Always show checkout popup (regardless of cart state)
    setShowCheckoutPopup(true);
  };



  const increaseQuantity = () => updateQuantity(slug, (cart[slug]?.quantity || 0) + 1);
  const decreaseQuantity = () => updateQuantity(slug, (cart[slug]?.quantity || 0) - 1);

  return (
    <>
      <div className="bg-c1 rounded-xl py-10">
        <div className="container mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            {loading ? (
              <Skeleton className="w-full h-96 rounded-lg" />
            ) : (
              <motion.img
                src={mainImage}
                alt={product.productName}
                className="w-full h-[65vh] object-fit rounded-lg shadow-md"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}

            {loading ? (
              <div className="flex justify-between gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-[calc(25%-0.5rem)] h-24 rounded-lg" />
                ))}
              </div>
            ) : (
              additionalImages.length > 1 && (
                <div className="flex justify-between gap-2">
                  {additionalImages.map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt={`View ${index + 1}`}
                      className={`w-[calc(25%-0.5rem)] h-24 object-cover rounded-lg cursor-pointer shadow-md transition-transform ${activeImageIndex === index ? "ring-4 ring-c4 scale-105" : "hover:scale-105"
                        }`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setMainImage(img);
                        setActiveImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {loading ? (
              <>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <div className="flex gap-4 mb-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>

                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                  <Skeleton className="h-32 w-full" />
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl font-bold text-gray-800">{product.productName}</h1>
                <div className="flex flex-row mt-2">
                  <p className="text-sm text-gray-500 line-through mt-2 mr-2">Rs. {product.strikeoutPrice}</p>
                  <p className="text-2xl font-semibold text-gray-700">Rs. {product.originalPrice}</p>
                </div>

                <div className="mt-6">
                  <div className="border rounded-lg">
                    <div className="flex">
                      {Object.keys(dropdownContent).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === tab ? "bg-c1 text-black" : "bg-white text-gray-700"
                            } rounded-t-lg focus:outline-none`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-c1 text-black rounded-b-lg">{dropdownContent[activeTab]}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 ml-1">
                    Enter Your Name <span className="font-normal text-xs">(Max 10 character)</span>
                  </h3>
                  <input
                    type="text"
                    maxLength={10}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={`w-full px-4 py-5 text-xl border rounded-lg focus:ring-2 focus:ring-c4 focus:outline-none 
    leading-relaxed tracking-wide overflow-visible 
    ${nameError ? "border-red-500" : ""} 
    ${product.fontName || ""}`}
                  />

                  {nameError && <p className="text-red-500 text-sm mt-1 ml-1">{nameError}</p>}
                  <p className="text-sm text-gray-500 ml-1 mb-1">
                    Your name will be engraved on the product.
                  </p>
                </div>

                <div className="mt-8 flex w-full flex-row gap-4">
                  <div className="w-1/2">
                    {quantity > 0 ? (
                      <div className="flex items-center bg-c2 w-full justify-around rounded-lg">
                        <motion.button
                          onClick={decreaseQuantity}
                          className="px-4 py-3 bg-c2 text-black rounded-lg font-medium"
                        >
                          -
                        </motion.button>
                        <p className="font-semibold">{quantity}</p>
                        <motion.button
                          onClick={increaseQuantity}
                          className="px-4 py-3 bg-c2 text-black rounded-lg font-medium"
                        >
                          +
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={handleAddToCart}
                        className="w-full flex-1 bg-c2 text-black py-3 rounded-lg font-medium transition-all text-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                  <div className="w-1/2">
                    <motion.button
                      onClick={handleAddToBuy}
                      className="flex-1 w-full bg-c4 text-white py-3 rounded-lg font-medium transition-all text-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Buy now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* <TrustSection/> */}


        <div className="mt-12 container mx-auto px-4 lg:px-10">
          <ReviewForm productId={slug} />
        </div>

      </div>
      {showCheckoutPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2">
          <div className="bg-white w-full max-w-xl md:rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto md:w-[90%] sm:max-w-md sm:mx-auto sm:my-8 sm:p-6 sm:rounded-lg shadow-xl">
            <button
              onClick={() => setShowCheckoutPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold ">Checkout</h2>
            {/* You can replace this with actual CheckoutForm component */}
            <Checkout />
            {/* <p className="text-sm text-gray-600">Checkout form or payment options will go here...</p> */}
          </div>
        </div>
      )}
    </>
  );
}