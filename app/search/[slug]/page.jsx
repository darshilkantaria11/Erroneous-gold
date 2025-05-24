"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function SlugPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsSummary, setReviewsSummary] = useState({});
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const keyword = slug.replace(/-/g, " ");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`, {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });
        if (!res.ok) return setNotFoundFlag(true);

        const data = await res.json();
        if (!data.length) return setNotFoundFlag(true);
        setProducts(data);

        const summaries = await Promise.all(
          data.map(async (prod) => {
            try {
              const res = await fetch(`/api/getreviews?productId=${prod._id}`);
              const reviewData = await res.json();
              const reviews = reviewData.reviews || [];
              const avgRating = reviews.length > 0
                ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
                : 0;
              return {
                productId: prod._id,
                summary: { avgRating: avgRating.toFixed(1), count: reviews.length },
              };
            } catch {
              return { productId: prod._id, summary: { avgRating: 0, count: 0 } };
            }
          })
        );

        const summaryMap = {};
        summaries.forEach(({ productId, summary }) => {
          summaryMap[productId] = summary;
        });
        setReviewsSummary(summaryMap);
      } catch (error) {
        console.error(error);
        setNotFoundFlag(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (notFoundFlag) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl mb-4 text-c4">🔍</div>
      <h2 className="text-2xl md:text-3xl font-semibold text-c4 mb-2">No matching products found</h2>
      <p className="text-gray-500 max-w-md mb-6">
        We couldn't find anything for "<span className="font-medium text-c4">{slug.replace(/-/g, " ")}</span>".
        <br /> Try searching with different keywords or explore our popular collections.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-c4  text-white rounded-full text-sm font-medium transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}


  return (
    <div className="bg-c1 min-h-screen py-4 mb-20">
      <div className="container mx-auto px-6">
        <motion.h1
          className="text-2xl md:text-4xl font-bold text-center mb-14 text-c4 tracking-wide"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Search results for “{slug.replace(/-/g, " ")}”
        </motion.h1>

        <motion.div
          className="grid gap-6 grid-cols-2 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            [...Array(8)].map((_, i) => (
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
            ))
          ) : (
            products.map((product) => {
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
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
