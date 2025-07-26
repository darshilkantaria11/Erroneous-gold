'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparks((prevSparks) => [
        ...prevSparks,
        { id: Math.random(), x: Math.random() * 100, y: Math.random() * 100 },
      ]);
      setTimeout(() => {
        setSparks((prevSparks) => prevSparks.slice(1));
      }, 2000);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-[45vh] lg:h-[60vh] bg-[#F8F5E9] text-[#1B4638] overflow-hidden bg-cover bg-center">

      {/* Floating Sparkles */}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute w-2 h-2 bg-c4 rounded-full shadow-lg"
          style={{ top: `${spark.y}%`, left: `${spark.x}%` }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 2 }}
        />
      ))}

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center mb-6"
      >
        <div className="mb-4 flex flex-col md:flex-row">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-8xl font-extrabold text-[#1B4638]"
          >
            WRITE IT.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-5xl md:text-8xl font-extrabold text-[#1B4638] px-2"
          >
            WEAR IT.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-5xl md:text-8xl font-extrabold text-red-800"
          >
            LOVE IT.
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-sm md:text-xl text-gray-600 px-6"
        >
          <span className='text-c4 font-bold'>Erroneous Gold – Crafting Personalized Elegance </span>. Every piece tells a story, turning your name into a timeless treasure. Wear your identity with pride, designed with precision, passion, and a touch of luxury.
        </motion.p>
      </motion.div>

      {/* 🚀 Buttons with Delay */}
      {/* <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="relative z-10 flex  md:mt-6  flex-row "
      >
       
        <Link href="/shop">
          <motion.div
            className="px-8 py-4 bg-c4 text-c1 text-lg font-bold rounded-full   transition duration-100 m-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.div>
        </Link>

       
        <Link href="/about-us">
          <motion.div

            className="px-8 py-4 border-2 border-c4 text-lg font-bold rounded-full  text-c4   transition duration-100 m-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.div>
        </Link>
      </motion.div> */}


    </div>
  );
}
