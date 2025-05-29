"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { loadRazorpay } from "../../lib/razorpay";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentStep({ userData }) {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = userData?.shippingCharge || 0;
  const total = subtotal;
  const online = total - 100;
  const [loadingText, setLoadingText] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const validateOrder = () => {
    if (shippingCharge < 0) throw new Error("Invalid shipping charge. Please refresh.");
    if (total <= 0) throw new Error("Order total cannot be zero.");
  };

  const handlePayment = async (paymentMethod) => {
    try {
      setLoadingText(paymentMethod === "cod" ? "Placing order..." : "Processing payment...");
      setLoading(true);
      setError("");
      validateOrder();

      const orderRes = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            name: item.name || "", // if engraved
          })),
          address: userData.address,
          shippingCharge,
          paymentMethod,
        }),

      });

      if (!orderRes.ok) throw new Error("Failed to create order.");
      const orderData = await orderRes.json();

      if (paymentMethod === "cod") {
        // Store the order
        await fetch("/api/placeorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY // or a hardcoded value for testing
          },
          body: JSON.stringify({
            number: userData.phone,
            name: userData.name,
            address: userData.address,
            items: cartItems,
            method: "COD",
            total,
          }),
        });

        router.push("/thank-you");
        clearCart();
        return;
      }


      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: total * 100,
        currency: "INR",
        name: "Erroneous Gold",
        description: "Order Payment",
        image: "/logo.png",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          const orderData = {
            number: userData.phone,
            name: userData.name,
            address: userData.address,
            items: cartItems,
            method: "prepaid",
            total,
          };

          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderData }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await fetch("/api/placeorder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY
              },
              body: JSON.stringify(orderData),
            });

            clearCart();
            router.push("/thank-you");
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userData.name,
          contact: userData.phone,
        },
        theme: { color: "#1b4638" },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.log("Payment Error:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRazorpay();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 text-sm">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow text-center text-base font-medium text-gray-800 animate-pulse">
            {loadingText}
          </div>
        </div>
      )}


      {/* Order Summary */}
      <div className="bg-white rounded shadow space-y-3 p-1">
        <h2 className="text-base font-semibold border-b pb-2">Order Summary</h2>
        <div className="space-y-2 max-h-56 overflow-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-2">
              {/* Product Image */}
              <div className="w-20 h-20 shrink-0 overflow-hidden rounded border bg-white">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between text-sm w-full">
                <p className="font-medium text-gray-900">{item.productName}</p>
                {item.name && (
                  <p className="text-xs text-gray-500">Engraved Name: {item.name}</p>
                )}
                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                <div className="flex items-center gap-2">
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  )}
                  <span className="font-semibold text-gray-800">₹{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="flex items-center gap-2">
              <span className="text-green-600 ">Free</span>
              <span className="line-through text-gray-400">₹{shippingCharge || 99}</span>
            </span>

          </div>
          <div className="flex justify-between font-semibold text-base text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded shadow p-1 space-y-4">
        <h2 className="text-base font-semibold border-b pb-2">Payment Options</h2>
        <p className="text-xs font-medium text-gray-600">
          Extra Discounts + Free Gifts on Prepaid Orders
        </p>

        {[
          { label: "Pay via UPI", desc: "GPay, PhonePe, Paytm" },
          { label: "Debit/Credit Cards", desc: "Visa, MasterCard, Rupay" },
          { label: "Wallets", desc: "PhonePe, Amazon, Mobikwik" },
          { label: "Netbanking", desc: "SBI, HDFC, ICICI, Axis" },
        ].map((method, index) => (
          <button
            key={index}
            onClick={() => handlePayment("prepaid")}
            className="relative w-full flex justify-between items-center bg-c1 text-black py-3 px-2 rounded transition text-sm"
          >
            <div className="absolute -top-2 left-2 bg-c4 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Free Gift + ₹100 Off
            </div>
            <div className="text-left mt-1">
              <p className="font-bold">{method.label}</p>
              <p className="text-xs">{method.desc}</p>
            </div>
            <div className="text-left mt-1">
              <div className="text-right  line-through opacity-60 text-xs ml-1">₹{total}</div>
              <div className="text-right  text-base">₹{total - 100}</div>
            </div>
          </button>
        ))}

        {/* COD */}
        <button
          onClick={() => handlePayment("cod")}
          className="w-full flex justify-between items-center bg-black text-white py-3 px-3 rounded text-sm"
        >
          <div className="text-left">
            <p className="font-bold">Cash on Delivery</p>
            <p className="text-xs text-gray-300">We Recommend Prepaid for Fast Shipping</p>
          </div>
          <div className="text-right  text-base">₹{total}</div>
        </button>

        <div className="text-xs text-gray-600 pt-4 border-t mt-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <p className="font-medium">100% Secure & Encrypted Payments</p>
          </div>
          <p className="text-gray-500">
            Need help?{" "}
            <Link href="/contact-us" className="text-c4 font-medium underline hover:text-c4/80">
              Contact our support team
            </Link>
          </p>
        </div>

      </div>
    </div >
  );
}
