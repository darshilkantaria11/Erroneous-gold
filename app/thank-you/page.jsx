"use client";
import { useEffect } from "react";
import Head from "next/head";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
    useEffect(() => {
        // Animation for each letter
        const letters = document.querySelectorAll(".thank-you-letter");
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add("animate-bounce");
                setTimeout(() => letter.classList.remove("animate-bounce"), 1000);
            }, index * 100);
        });

        // Bounce animation for icon
        const icon = document.querySelector(".check-icon");
        if (icon) {
            icon.classList.add("animate-bounce");
            setTimeout(() => icon.classList.remove("animate-bounce"), 1500);
        }
    }, []);

    return (
        <div className="min-h-screen bg-back flex flex-col items-center justify-center p-4">
            <Head>
                <title>Thank You for Your Order</title>
                <meta name="description" content="Your personalized necklace order has been placed successfully" />
            </Head>

            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
                {/* Icon */}
                <div className="check-icon text-c4 w-16 h-16 mx-auto mb-6">
                    <CheckCircle className="w-full h-full" />
                </div>

                {/* Animated Thank You Text */}
                <h1 className="text-4xl md:text-6xl font-bold text-c4 mb-4 flex justify-center flex-wrap">
                    {"Thank You".split("").map((letter, index) => (
                        <span
                            key={index}
                            className="thank-you-letter inline-block opacity-0"
                            style={{ animation: `fadeIn 0.3s forwards ${index * 0.1}s` }}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </span>
                    ))}
                </h1>

                <h2 className="text-xl md:text-2xl text-gray-600 mb-8">for placing your order!</h2>

                {/* Order Confirmation Message */}
                <p className="text-gray-600 mb-10">
                    Your order has been received and is being processed. You can check updates anytime from the{" "}
                    <Link href="/my-orders" className="text-c4 hover:underline font-medium">
                        My Orders
                    </Link>{" "}
                    page.
                </p>


                {/* What Happens Next */}
                <div className="bg-green-50 rounded-lg p-4 mb-10 text-left">
                    <h3 className="font-semibold text-c4 mb-2">What happens next?</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Your personalized necklace is being handcrafted with care</li>
                        <li>Once ready, it will be securely packed and handed over for shipping</li>
                        <li>You’ll receive a tracking link as soon as it’s dispatched</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/my-orders"
                        className="bg-c4  text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                        View Your Orders
                    </Link>
                    <Link
                        href="/"
                        className="bg-white hover:bg-gray-100 text-c4 font-medium py-3 px-6 border border-gray-300 rounded-lg transition duration-300"
                    >
                        Explore More Products
                    </Link>
                </div>
            </div>

            {/* Help Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>
                    Need help?{" "}
                    <a href="/contact-us" className="text-c4 hover:underline">
                        Contact our support team
                    </a>
                </p>
            </div>

            {/* Global CSS for fade-in */}
            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
