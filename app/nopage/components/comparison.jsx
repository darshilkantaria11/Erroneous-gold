"use client";

import { Check, X } from "lucide-react";

export default function ComparisonTable() {
  const features = [
    "Faster Shipping",
    "Great Customer Support",
    "Easy Refund Policy",
    "High Quality Material",
    "Long Lasting Jewellery",
    "Affordable Prices",
    "Trendiest Designs",
    "Celebrity Verified",
  ];

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="max-w-3xl w-full border-4 border-c4 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 bg-green-100 text-c4 font-bold text-center">
          <div className="py-4 border-r border-c4"> </div>
          <div className="py-4 border-r border-c4">Erroneous Gold</div>
          <div className="py-4">OTHERS</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-c4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 items-center text-center text-sm sm:text-base"
            >
              {/* Feature */}
              <div className="py-4 px-2 border-r border-c4 font-medium text-gray-800">
                {feature}
              </div>

              {/* Salty - always check */}
              <div className="py-4 border-r border-c4 text-c4 flex justify-center">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>

              {/* Others - always X */}
              <div className="py-4 text-red-600 flex justify-center">
                <X className="h-6 w-6 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
