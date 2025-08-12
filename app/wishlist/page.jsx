"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import UserPopup from "../nopage/components/userpopup";

export default function WishlistPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLogin = () => {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                setIsLoggedIn(!!parsed.phone);
                setUser(parsed);
                
                // Fetch wishlist if logged in
                if (parsed.phone) {
                    fetchWishlistProducts(parsed.phone);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
                setLoading(false);
            }
        };

        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

const fetchWishlistProducts = async (phone) => {
    try {
        setLoading(true);

        const wishlistRes = await fetch(`/api/wishlist?userPhone=${phone}`);
        if (!wishlistRes.ok) throw new Error("Failed to fetch wishlist");

        const wishlistData = await wishlistRes.json();
        const wishlistItems = wishlistData.wishlist || [];

        if (wishlistItems.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const fetchedProducts = await Promise.all(
            wishlistItems.map(async (item) => {
                const res = await fetch(`/api/products/fetch/${item.productId}`, {
                    headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                });
                if (res.ok) {
                    return await res.json();
                }
                return null;
            })
        );

        // ✅ Keep only valid, live products
        setProducts(
            fetchedProducts
                .filter(Boolean)
                .filter(product => product.status === "live")
        );

    } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
    } finally {
        setLoading(false);
    }
};



    const toggleWishlist = async (productId) => {
        if (!isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }

        try {
            // Remove from wishlist
            await fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userPhone: user.phone, 
                    productId 
                })
            });
            
            // Update UI
            setProducts(prev => prev.filter(p => p._id !== productId));
        } catch (error) {
            console.error("Wishlist update failed:", error);
        }
    };

    if (!isLoggedIn && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-c1">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                    <p className="mb-6">Please login to view your wishlist</p>
                    <button
                        onClick={() => setShowLoginPopup(true)}
                        className="bg-c4 text-white px-6 py-2 rounded-lg hover:bg-c4/90"
                    >
                        Login Now
                    </button>
                </div>
                
                {showLoginPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <UserPopup 
                            onClose={() => setShowLoginPopup(false)} 
                            onSuccess={(userData) => {
                                setIsLoggedIn(true);
                                setUser(userData);
                                setShowLoginPopup(false);
                                fetchWishlistProducts(userData.phone);
                            }} 
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-c1 py-8 min-h-screen">
            {showLoginPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <UserPopup 
                        onClose={() => setShowLoginPopup(false)} 
                        onSuccess={(userData) => {
                            setIsLoggedIn(true);
                            setUser(userData);
                            setShowLoginPopup(false);
                            fetchWishlistProducts(userData.phone);
                        }} 
                    />
                </div>
            )}

            <div className="container mx-auto px-4">
                <motion.h1 
                    className="text-3xl font-bold text-center mb-12 text-c4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Your Wishlist
                </motion.h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c4"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl mb-4">Your wishlist is empty</p>
                        <Link 
                            href="/" 
                            className="text-c4 hover:underline font-medium"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <motion.div 
                        className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product._id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow relative"
                                whileHover={{ y: -5 }}
                            >
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full backdrop-blur-sm"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-6 w-6 text-red-500 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                                        />
                                    </svg>
                                </button>

                                <Link href={`/products/${product._id}`}>
                                    <div className="relative h-60 overflow-hidden">
                                        <img
                                            src={product.img1}
                                            alt={product.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-c4 font-bold">Rs.{product.originalPrice}</span>
                                            {product.strikeoutPrice && (
                                                <span className="text-gray-400 line-through text-sm">
                                                    Rs.{product.strikeoutPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}