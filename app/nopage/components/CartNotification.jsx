"use client";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useRouter, usePathname } from "next/navigation";

export default function CartNotification() {
  const { cart, getTotalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const totalItems = getTotalItems();

  // Hide notification on /cart page
  if (totalItems === 0 || pathname === "/cart") return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 h-[10vh] bg-c4 text-white flex items-center justify-between px-8 z-50"
    >
      <p className="text-lg">
        {totalItems} item{totalItems !== 1 && 's'} added
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-c4 px-6 py-2 rounded-lg font-medium"
        onClick={() => router.push('/cart')}
      >
        View Cart
      </motion.button>
    </motion.div>
  );
}
