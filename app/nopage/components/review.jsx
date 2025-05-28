"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserPopup from "./userpopup";


export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useState({ name: "", phone: "" });
    const [showLoginPopup, setShowLoginPopup] = useState(false); // NEW

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await fetch(`/api/getreviews?productId=${productId}`);
            const data = await res.json();
            if (res.ok) setReviews(data.reviews || []);
        };

        const verifyUser = async () => {
            const stored = localStorage.getItem("user");
            if (!stored) return;

            try {
                const parsed = JSON.parse(stored);
                const res = await fetch(`/api/verifyuser?number=${parsed.phone}`, {
                    headers: {
                        Authorization: `Bearer ${parsed.token}`,
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser({ name: userData.name, phone: userData.number });
                } else {
                    localStorage.removeItem("user");
                    setUser({ name: "", phone: "" });
                }
            } catch (err) {
                console.error("Failed to verify user", err);
                localStorage.removeItem("user");
                setUser({ name: "", phone: "" });
            }
        };

        verifyUser();
        fetchReviews();
    }, [productId]);


    const handleLoginSuccess = ({ name, phone }) => {
        const userData = { name, phone };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowLoginPopup(false);
        setShowForm(true);
    };

    const handleWriteReviewClick = () => {
        if (!user.name || !user.phone) {
            setShowLoginPopup(true);
        } else {
            setShowForm(true);
            setSubmitted(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) return alert("Please select a star rating.");
        if (!user.name || !user.phone) return alert("User not found. Please login first.");

        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
                productId,
                userName: user.name,
                userNumber: user.phone,
                rating,
                description,
            }),
        });

        let data = {};
        try {
            data = await res.json();
        } catch (err) { }

        if (res.ok) {
            setSubmitted(true);
            setShowForm(false);
            setRating(0);
            setDescription("");

            const updated = await fetch(`/api/getreviews?productId=${productId}`);
            if (updated.ok) {
                try {
                    const updatedData = await updated.json();
                    setReviews(updatedData.reviews || []);
                } catch (err) {
                    console.error("Error parsing updated reviews:", err);
                }
            }
        } else {
            alert(data.error || "Something went wrong.");
        }
    };

    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

    return (
        <div className="mt-20">
            {/* Header Section with Summary and Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Rated <span className="text-c4 text-lg font-medium">{avgRating}★</span> by{" "}
                        <span className="font-medium">{reviews.length}</span> happy customer{reviews.length !== 1 && "s"}.
                        Your feedback helps others make confident buying decisions.
                    </p>
                </div>
                <button
                    onClick={handleWriteReviewClick}
                    className="mt-4 sm:mt-0 bg-c4 text-white px-6 py-2 rounded-md font-medium hover:shadow-md transition"
                >
                    Write a Review
                </button>

            </div>
            {/* Review Form */}
            {showForm && (
                <motion.div
                    className="mt-6 bg-white p-6 rounded-xl shadow-md mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                            <p className="font-medium mb-1">🎉 Thanks for sharing your thoughts!</p>
                            <p className="text-sm">
                                Your review has been submitted and will help others make smart choices.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"
                                            } transition`}
                                        whileTap={{ scale: 1.2 }}
                                    >
                                        ★
                                    </motion.button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Write your feedback (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-c4"
                                rows={4}
                            />

                            <div className="flex gap-3">
                                <motion.button
                                    onClick={handleSubmit}
                                    className="bg-c4 text-white py-2 px-6 rounded-lg font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Submit Review
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        setShowForm(false);
                                        setRating(0);
                                        setDescription("");
                                    }}
                                    className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                            </div>

                        </>
                    )}
                </motion.div>
            )}


            {/* Reviews Grid */}
            <div className="pr-1">
                <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
                    {[...reviews]
                        .sort((a, b) => a._id.localeCompare(b._id))  // oldest first
                        .map((review) => (
                            <div
                                key={review._id}
                                className="break-inside-avoid bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto"
                            >
                                <div className="flex gap-1 text-yellow-400 text-xl mb-2">
                                    {Array.from({ length: review.rating }, (_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{review.userName}</h4>
                                <p className="text-sm text-gray-700">
                                    {review.description || "No description."}
                                </p>
                            </div>
                        ))}
                </div>
            </div>


            {showLoginPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <UserPopup
                        onClose={() => setShowLoginPopup(false)}
                        onSuccess={handleLoginSuccess}
                    />
                </div>
            )}


        </div>
    );
}
