"use client";
import { useEffect, useState,  useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
    </div>
);

function StarRating({ rating }) {
    const safeRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex text-yellow-400 text-sm md:text-base">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
            {halfStar && <span>☆</span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
        </div>
    );
}

export default function Products({ category, title }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [reviewsSummary, setReviewsSummary] = useState({});
    const limit = 20;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const filterRef = useRef(null);

     useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedProducts = useMemo(() => {
    if (!selectedFilter) return products;
    
    return [...products].sort((a, b) => {
      switch (selectedFilter) {
        case "price_low_high":
          return a.originalPrice - b.originalPrice;
        case "price_high_low":
          return b.originalPrice - a.originalPrice;
        case "alphabetical":
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });
  }, [products, selectedFilter]);

    // Reset state when category changes
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setReviewsSummary({});
        setLoading(true);
    }, [category]);

    useEffect(() => {
        if (category) {
            fetchProducts();
        }
    }, [page, category]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(
                `/api/products?page=${page}&limit=${limit}&category=${category}`,
                { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } }
            );
            const data = await res.json();

            if (data.length < limit) setHasMore(false);

            setProducts(prev => {
                const seen = new Set(prev.map(p => p._id));
                const unique = data.filter(p => !seen.has(p._id));
                return [...prev, ...unique];
            });

            // Fetch review summaries
            const reviewData = {};
            await Promise.all(
                data.map(async (product) => {
                    try {
                        const res = await fetch(`/api/getreviews?productId=${product._id}`);
                        const json = await res.json();
                        const reviews = json.reviews || [];
                        const avgRating =
                            reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                            (reviews.length || 1);
                        reviewData[product._id] = {
                            avgRating: Number(avgRating.toFixed(1)),
                            count: reviews.length,
                        };
                    } catch (err) {
                        console.error("Failed to load reviews for product:", product._id);
                    }
                })
            );
            setReviewsSummary(prev => ({ ...prev, ...reviewData }));
        } catch (e) {
            console.log("Error loading products:", e);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="bg-c1 py-4 mb-20">
            <div className="container mx-auto px-6">
               <div className="flex justify-between items-center mb-8">
          {products.length > 0 && title && (
            <motion.h1 
              className="text-2xl md:text-4xl font-bold text-c4 tracking-wide"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {title}
            </motion.h1>
          )}
          
          {(products.length > 0 || loading) && (
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-white text-c4 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <span>Filter</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setSelectedFilter("price_low_high");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${
                      selectedFilter === "price_low_high" ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    {selectedFilter === "price_low_high" && (
                      <svg className="w-4 h-4 mr-2 text-c4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("price_high_low");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${
                      selectedFilter === "price_high_low" ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    {selectedFilter === "price_high_low" && (
                      <svg className="w-4 h-4 mr-2 text-c4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("alphabetical");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${
                      selectedFilter === "alphabetical" ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    {selectedFilter === "alphabetical" && (
                      <svg className="w-4 h-4 mr-2 text-c4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    Alphabetical Order
                  </button>
                  {selectedFilter && (
                    <button
                      onClick={() => {
                        setSelectedFilter(null);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Filter
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

                <motion.div
                    className="grid gap-6 grid-cols-2 md:grid-cols-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {sortedProducts.map((product) => {
                        const summary = reviewsSummary[product._id] || { avgRating: 0, count: 0 };
                        return (
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
                                            <h2 className="text-sm lg:text-lg font-semibold text-c4">{product.productName}</h2>
                                            <div className="flex justify-start items-center space-x-2 ">
                                                <p className="text-xs lg:text-sm text-gray-400 line-through">Rs.{product.strikeoutPrice}</p>
                                                <p className="text-md lg:text-xl text-c4 font-semibold">Rs.{product.originalPrice}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 ">
                                                <StarRating rating={summary.avgRating} />
                                                <span className="text-sm text-gray-600">({summary.count})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                    {loading && [...Array(4)].map((_, i) => (
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
                    ))}
                </motion.div>
                {hasMore && !loading && (
                    <div className="text-center mt-8">
                        <button
                            onClick={loadMore}
                            className="bg-c4 text-white px-6 py-2 rounded-lg hover:bg-c4/90 transition-all"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}