"use client";

import Image from "next/image";

export default function FullWidthImage() {
  return (
    <>
    <div className="w-full">
      <Image
        src="/Trust_Badge.webp" // replace with your image path
        alt="Chain Image"
        width={1920}
        height={600}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
        <div className="w-full">
      <Image
        src="/feature.webp" // replace with your image path
        alt="Chain Image"
        width={1920}
        height={600}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
    </>
  );
}
