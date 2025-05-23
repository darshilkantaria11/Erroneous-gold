// components/TrustSection.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function TrustSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How long does customization take?",
      answer: "We handcraft your name necklace immediately after ordering, typically within 24 hours. This ensures quick shipping without compromising quality."
    },
    {
      question: "What materials do you use?",
      answer: "Our necklaces are crafted from premium surgical-grade stainless steel with 18k gold/silver plating. Hypoallergenic and tarnish-resistant for lifelong wear."
    },
    {
      question: "Can I get a resized if needed?",
      answer: "Yes! We offer one-time free resizing within 6 months of purchase. Your perfect fit is our priority."
    }
  ];

  return (
    <section className="bg-c1 py-16 px-4 lg:px-10">
      <div className="container mx-auto space-y-16">
        {/* Trust Badges */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { icon: '🔒', title: "Secure Lifetime Warranty", text: "Free repairs & replacements forever" },
            { icon: '✨', title: "Luxury Packaging", text: "Velvet box + ready-to-gift wrapping" },
            { icon: '🚚', title: "24h Express Shipping", text: "Delivered in 3-5 days worldwide" },
            { icon: '❤️', title: "Ethical Craftsmanship", text: "Conflict-free materials, fair wages" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <div className="min-w-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-c4 p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Why We're Different
              </h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4">Feature</th>
                  <th className="p-4">LuxeName</th>
                  <th className="p-4">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Material", "Surgical Steel + 18K Gold", "Plated Alloy"],
                  ["Customization", "Unlimited Characters", "15 Char Limit"],
                  ["Shipping", "Free Worldwide", "$9.99+"],
                  ["Price", "₹2,490", "₹1,790-₹3,990"],
                  ["Warranty", "Lifetime Coverage", "6 Months"],
                ].map(([feature, us, others], i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-4 font-medium">{feature}</td>
                    <td className="p-4 text-center text-c4 font-bold">✓ {us}</td>
                    <td className="p-4 text-center text-red-500">✗ {others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Your Questions, Answered
          </h2>
          
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span className="text-2xl ml-4">{openFaq === i ? '-' : '+'}</span>
              </button>
              
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: openFaq === i ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-c4 rounded-xl p-8 text-center text-white space-y-6"
        >
          <h2 className="text-3xl font-bold">Crafted with Love, Worn with Pride</h2>
          <p className="text-xl">
            Join 92,000+ Customers Who Found Their Perfect Personalized Jewelry
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-c4 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Create Yours Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}