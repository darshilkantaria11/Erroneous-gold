"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import ReviewForm from "../components/review";
import TrustSection from "../components/trustsection";
import Checkout from "../../nopage/checkout/checkout";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/outline";
import Comparison from "../components/comparison"
import Trust from "../components/trust"
import Trust2 from "../components/trust2"
import { useRouter } from "next/navigation";


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
  const [name1, setName1] = useState(""); // First name for couple necklaces
  const [name2, setName2] = useState(""); // Second name for couple necklaces
  const [quantity, setQuantity] = useState(0);
  const [nameError, setNameError] = useState("");
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);
  const [chainError, setChainError] = useState("");
  const [previewImg, setPreviewImg] = useState(null);


  const router = useRouter();


  // All hooks must be at the top without any conditional returns
  useEffect(() => {
    const cartItem = cart[slug];
    if (cartItem) {
      setQuantity(cartItem.quantity);

      // Handle couple necklace name splitting
      if (cartItem.name && cartItem.name.includes(" ")) {
        const names = cartItem.name.split(" ");
        setName1(names[0] || "");
        setName2(names[1] || "");
      } else {
        setName(cartItem.name || "");
      }
    } else {
      setQuantity(0);
      setName("");
      setName1("");
      setName2("");
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

  // useEffect(() => {
  //   if (product && (product.category === "singlenamenecklace" || product.category === "couplenamenecklace")) {
  //     setSelectedChain(product.chain1 || "");
  //   }
  // }, [product]);

  // Place conditional returns AFTER all hooks
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  const additionalImages = product ? [product.img1, product.img2, product.img3, product.img4].filter(Boolean) : [];

  const dropdownContent = product ? {
    description: product.description || "No description available.",
    materials: product.material || "Materials information not provided.",
  } : {};

  const handleAddToCart = () => {
    let fullName = "";
    if (
      (product?.category === "singlenamenecklace" || product?.category === "couplenamenecklace") &&
      selectedChain === null
    ) {
      setChainError("Please choose a chain type before proceeding.");
      return;
    } else {
      setChainError("");
    }

    if (product?.category === "couplenamenecklace") {
      if (!name1.trim() || !name2.trim()) {
        setNameError("Please enter both names before adding to cart.");
        return;
      }
      fullName = `${name1} ${name2}`;
    } else if (product?.category === "carcharam") {
      fullName = ""; // ✅ No name needed
    } else {
      if (!name.trim()) {
        setNameError("Please enter a name before adding to cart.");
        return;
      }
      fullName = name;
    }

    if (fullName.length > 21) {
      setNameError("Total name length must be 10 characters or less.");
      return;
    }

    addToCart(slug, {
      id: slug,
      name: fullName,
      productName: product.productName,
      quantity: 1,
      price: product.originalPrice,
      image: product.img1,
      selectedChain: [product.chain1, product.chain2, product.chain3].filter(Boolean)[selectedChain]
    });
  };


  const handleAddToBuy = () => {
    let fullName = "";

    if (
      (product?.category === "singlenamenecklace" || product?.category === "couplenamenecklace") &&
      selectedChain === null
    ) {
      setChainError("Please choose a chain type before proceeding.");
      return;
    } else {
      setChainError("");
    }

    if (product?.category === "couplenamenecklace") {
      if (!name1.trim() || !name2.trim()) {
        setNameError("Please enter both names before adding to cart.");
        return;
      }
      fullName = `${name1} ${name2}`;
    } else if (product?.category === "carcharam") {
      fullName = ""; // ✅ No name needed
    } else {
      if (!name.trim()) {
        setNameError("Please enter a name before adding to cart.");
        return;
      }
      fullName = name;
    }

    if (fullName.length > 21) {
      setNameError("Total name length must be 10 characters or less.");
      return;
    }

    const cartItem = cart[slug];
    if (!cartItem) {
      addToCart(slug, {
        id: slug,
        name: fullName,
        productName: product.productName,
        quantity: 1,
        price: product.originalPrice,
        image: product.img1,
        selectedChain: [product.chain1, product.chain2, product.chain3].filter(Boolean)[selectedChain]

      });
    }

    setShowCheckoutPopup(true);
  };

  const increaseQuantity = () => updateQuantity(slug, (cart[slug]?.quantity || 0) + 1);
  const decreaseQuantity = () => updateQuantity(slug, (cart[slug]?.quantity || 0) - 1);

  return (
    <>
      <div className="bg-c1 rounded-xl py-10 relative ">
        {/* 🔙 Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute z-50 top-8 left-8 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-medium px-3 py-2 rounded-full shadow-md transition-all"
        >
          ←
        </button>

        <div className="container mx-auto px-4 lg:px-10 flex flex-col lg:flex-row justify-between">
          {/* Product Images */}
          <div className="space-y-4 lg:w-2/5">
            {loading ? (
              <Skeleton className="w-full h-96 rounded-lg" />
            ) : (
              <div
                className="relative w-full aspect-[4/4] overflow-hidden rounded-lg shadow-md bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${mainImage})` }}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.pageX - left) / width) * 100;
                  const y = ((e.pageY - top) / height) * 100;
                  e.currentTarget.style.backgroundPosition = `${x}% ${y}%`;
                  e.currentTarget.style.backgroundSize = "200%";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = "center";
                  e.currentTarget.style.backgroundSize = "cover";
                }}
              >
                <img
                  src={mainImage}
                  alt={product?.productName}
                  className="w-full h-full object-cover opacity-0"
                />
              </div>


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
          <div className="bg-white rounded-lg p-6 shadow-lg lg:w-3/5 lg:ml-8 mt-4 lg:mt-0 ">
            <div className="relative"> {/* Make the parent relative */}
              {/* Share Button */}
              <motion.button
                onClick={async () => {
                  const shareData = {
                    title: product.productName,
                    text: `Check out this product: ${product.productName}`,
                    url: window.location.href,
                  };

                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      console.error("Share cancelled", err);
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    } catch (err) {
                      console.error("Failed to copy link:", err);
                    }
                  }
                }}
                className="absolute top-0 right-0 flex items-center gap-2 bg-c1 text-black px-3 py-3 rounded-full font-medium shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShareIcon className="h-5 w-5" />

              </motion.button>

              {/* Your existing product image or details here */}
            </div>

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
                  {product.category === "couplenamenecklace" ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 ml-1">
                        Enter Names <span className="font-normal text-xs">(Max 5 characters each)</span>
                      </h3>
                      <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                          <input
                            type="text"
                            maxLength={10}
                            value={name1}
                            onChange={(e) => {
                              setName1(e.target.value);
                              setNameError("");
                            }}
                            placeholder="First Name"
                            className={`w-full px-4 py-3 text-xl border rounded-lg focus:ring-2 focus:ring-c4 focus:outline-none 
                              leading-relaxed tracking-wide overflow-visible 
                              ${nameError ? "border-red-500" : ""} ${product.fontName || ""}`}
                          />
                        </div>
                        <div className="w-1/2">
                          <input
                            type="text"
                            maxLength={10}
                            value={name2}
                            onChange={(e) => {
                              setName2(e.target.value);
                              setNameError("");
                            }}
                            placeholder="Second Name"
                            className={`w-full px-4 py-3 text-xl border rounded-lg focus:ring-2 focus:ring-c4 focus:outline-none 
                              leading-relaxed tracking-wide overflow-visible 
                              ${nameError ? "border-red-500" : ""} ${product.fontName || ""}`}
                          />
                        </div>
                      </div>
                      {nameError && <p className="text-red-500 text-sm mt-1 ml-1">{nameError}</p>}
                      <p className="text-sm text-gray-500 ml-1 mb-1">
                        Names will be combined with a space and engraved on the product.
                      </p>
                    </>
                  ) : product.category === "carcharam" || product.category === "keychain" ? null : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 ml-1">
                        Enter Your Name <span className="font-normal text-xs">(Max 10 characters)</span>
                      </h3>
                      <input
                        type="text"
                        maxLength={10}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameError("");
                        }}
                        className={`w-full px-4 py-3 text-xl border rounded-lg focus:ring-2 focus:ring-c4 focus:outline-none 
                          leading-relaxed tracking-wide overflow-visible 
                          ${nameError ? "border-red-500" : ""} ${product.fontName || ""}`}
                      />
                      {nameError && <p className="text-red-500 text-sm mt-1 ml-1">{nameError}</p>}
                      <p className="text-sm text-gray-500 ml-1 mb-1">
                        Your name will be engraved on the product.
                      </p>
                    </>
                  )}
                </div>
                {(product?.category === "singlenamenecklace" || product?.category === "couplenamenecklace") && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Chain Type</h3>
                    <div className="flex gap-6">
                      {[product.chain1, product.chain2, product.chain3]
                        .filter(Boolean)
                        .map((chainImg, idx) => {
                          const chainNames = ["Box Chain", "Jalebi Chain", "Mangalsutra Chain"];
                          return (
                            <div key={idx} className="relative text-center">
                              <label className="cursor-pointer block">
                                <input
                                  type="checkbox"
                                  checked={selectedChain === idx}
                                  onChange={() =>
                                    setSelectedChain(selectedChain === idx ? null : idx)
                                  }
                                  className="hidden"
                                />
                                <img
                                  src={chainImg}
                                  alt={chainNames[idx]}
                                  className={`w-24 h-20 object-cover rounded-md border-2 
                  ${selectedChain === idx ? "border-c4 border-8" : "border-transparent"} 
                  hover:scale-105 transition-transform`}
                                />
                              </label>

                              {/* 👁 Eye Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewImg(chainImg)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                              >
                                👁
                              </button>

                              {/* ✅ Chain Name */}
                              <p className="mt-2 text-sm font-medium text-gray-700">
                                {chainNames[idx]}
                              </p>
                            </div>
                          );
                        })}
                    </div>

                    {chainError && <p className="text-red-500 text-sm mt-2">{chainError}</p>}
                  </div>



                )}

                {previewImg && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative">
                      <img
                        src={previewImg}
                        alt="Preview"
                        className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewImg(null)}
                        className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}




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
                      disabled={
                        product?.category !== "carcharam" &&
                        !name.trim() &&
                        (!name1.trim() || !name2.trim())
                      }
                    >
                      Buy now
                    </motion.button>

                  </div>

                </div>
                <div className="mt-6">
                  <div className="border rounded-lg">
                    <div className="flex">
                      {Object.keys(dropdownContent).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === tab ? "bg-c1 text-black" : "bg-c4 text-white"
                            }  focus:outline-none`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-c1 text-black rounded-b-lg">{dropdownContent[activeTab]}</div>
                  </div>
                </div>
                <Trust />
                {(product?.category === "singlenamenecklace" || product?.category === "couplenamenecklace") && (
                  <>

                    <Trust2 />
                  </>
                )}


              </motion.div>
            )}
          </div>
        </div>
        <Comparison />

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
            <Checkout />
          </div>
        </div>
      )}

    </>
  );
}