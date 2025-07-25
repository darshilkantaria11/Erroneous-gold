"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation'; // Added for route detection

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

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [reviewsSummary, setReviewsSummary] = useState({});
    const limit = 12;
    const pathname = usePathname(); // Get current route path

    // Reset state when route changes (including on initial mount)
    useEffect(() => {
        const resetState = () => {
            setProducts([]);
            setPage(1);
            setHasMore(true);
            setReviewsSummary({});
        };
        resetState();
    }, [pathname]); // reset only, don't call fetch here
    useEffect(() => {
        fetchProducts(page); // fetch only when page changes
    }, [page]);

    // Fetch products when state is reset
    // useEffect(() => {
    //     if (loading) {
    //         fetchProducts();
    //     }
    // }, [loading]);

    const fetchProducts = async (currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?page=${currentPage}&limit=${limit}`, {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            const data = await res.json();

            if (data.length < limit) setHasMore(false);

            // Prevent duplicates using a Set of existing product IDs
            setProducts(prev => {
                const seen = new Set(prev.map(p => p._id));
                const filtered = data.filter(
                    p => p.category === "couplenamenecklace" && p.status === "live"
                );
                if (filtered.length < limit) setHasMore(false);
                const unique = filtered.filter(p => !seen.has(p._id));
                return [...prev, ...unique];
            });


            // Fetch review summaries
            // Fetch individual review summaries using GET (no POST)
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

            setReviewsSummary((prev) => ({ ...prev, ...reviewData }));

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
        <div className="bg-c1  py-4 mb-20">
            <div className="container mx-auto px-6">
                {products.length > 0 && (
                    <motion.h1 className="text-2xl md:text-4xl font-bold text-center mb-14 text-c4 tracking-wide"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}>
                        Couple Name Necklace
                    </motion.h1>
                )}


                <motion.div className="grid gap-6 grid-cols-2 md:grid-cols-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}>
                    {products.map((product) => {
                        const summary = reviewsSummary[product._id] || { avgRating: 0, count: 0 };
                        return (
                            <motion.div key={product._id}
                                className="overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}>
                                <Link href={`/products/${product._id}`}>
                                    <div>
                                        <div className="relative w-full md:h-72 h-52 overflow-hidden">
                                            <motion.img
                                                src={product.img1}
                                                alt={product.productName}
                                                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                initial={{ opacity: 1 }}
                                                whileHover={{ opacity: 0 }} />
                                            <motion.img
                                                src={product.img2}
                                                alt={`${product.productName} Hover`}
                                                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }} />
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
                        <button onClick={loadMore} className="bg-c4 text-white px-6 py-2 rounded-lg hover:bg-c4/90 transition-all">
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}