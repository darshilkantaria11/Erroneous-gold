"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { loadRazorpay } from "../../lib/razorpay";
import { useRouter } from "next/navigation";

export default function PaymentStep({ userData }) {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const cartItems = Object.values(cart);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const shippingCharge = userData?.shippingCharge || 0;
    const total = subtotal + shippingCharge;

    const validateOrder = () => {
        if (shippingCharge < 0) {
          throw new Error("Invalid shipping charges. Please refresh and try again.");
        }
        if (total <= 0) {
          throw new Error("Order total cannot be zero");
        }
      };
    

      const handlePayment = async (paymentMethod) => {
        try {
          setLoading(true);
          setError("");
          validateOrder();
    
          // Create order in your database
          const orderRes = await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: total,
              items: cartItems,
              address: userData.address,
              shippingCharge,
              paymentMethod,
            }),
          });
    
          if (!orderRes.ok) throw new Error("Failed to create order");
    
            const orderData = await orderRes.json();

            if (paymentMethod === "cod") {
                clearCart();
                router.push("/thank-you");
                return;
            }

            // For Razorpay
            const razorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: total * 100,
                currency: "INR",
                name: "Your Store Name",
                description: "Order Payment",
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    await fetch("/api/orders/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    clearCart();
                    router.push("/thank-you");
                },
                prefill: {
                    name: userData.address.name,
                    email: userData.email || "customer@example.com",
                    contact: userData.phone,
                },
                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();
        } catch (error) {
            console.error("Payment Error:", error);
            setError(error.message || "Payment failed. Please try again.");
          } finally {
            setLoading(false);
          }
    };

    useEffect(() => {
        loadRazorpay();
    }, []);

    return (
        <div className="mx-auto space-y-6 px-1">
            {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        Processing payment...
                    </div>
                </div>
            )}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                <p className="text-gray-600">Choose your preferred payment method</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between mb-2">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p>₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                   <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className={shippingCharge > 0 ? "" : "text-green-600"}>
              {shippingCharge > 0 ? `₹${shippingCharge}` : "Free"}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                    <button
                        onClick={() => handlePayment("prepaid")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Pay with Razorpay
                    </button>
                    <button
                        onClick={() => handlePayment("cod")}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Cash on Delivery
                    </button>
                </div>
            </div>
        </div>
    );
}