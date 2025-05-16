"use client"

import { useEffect } from "react";

export default function PaymentStep({ userData }) {
  const openRazorpay = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 99900, // in paise
      currency: "INR",
      name: "Your Store",
      description: "Thank you for your purchase!",
      prefill: {
        name: userData.address?.name,
        contact: userData.phone,
      },
      handler: function (response) {
        alert("Payment Successful!");
      },
      theme: {
        color: "#7B3AED",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Secure Payment</h2>
      <p className="text-sm text-gray-600 mb-4">
        You're just one step away from placing your order. Use Razorpay to pay securely with UPI, Card, Netbanking.
      </p>
      <button
        onClick={openRazorpay}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all"
      >
        Pay ₹999 Now
      </button>
    </div>
  );
}
