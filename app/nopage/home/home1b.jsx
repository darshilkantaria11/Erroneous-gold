'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TopCategories() {
  const allCategories = [
    {
      name: 'Single Name Necklaces',
      image: 'https://raw.githubusercontent.com/erroneousgold/images/refs/heads/main/autum%20rose%201.webp',
      slug: 'single-name-necklaces',
      apiCategory: 'singlenamenecklace',
    },
    {
      name: 'Rakhi',
      image: 'https://raw.githubusercontent.com/erroneousgold/images/refs/heads/main/OM%20Name%20Rakhi%2001.webp',
      slug: 'rakhi',
      apiCategory: 'rakhi',
    },
    {
      name: 'Couple Name Necklaces',
      image: 'https://raw.githubusercontent.com/erroneousgold/images/refs/heads/main/autum%20rose%201.webp',
      slug: 'couple-name-necklaces',
      apiCategory: 'couplenamenecklace',
    },
    {
      name: 'Keychains',
      image: 'https://raw.githubusercontent.com/erroneousgold/images/refs/heads/main/OM%20Name%20Rakhi%2001.webp',
      slug: 'keychains',
      apiCategory: 'keychain',
    },
     {
      name: 'Car Charam',
      image: 'https://raw.githubusercontent.com/erroneousgold/images/refs/heads/main/carcharm.webp',
      slug: 'carcharam',
      apiCategory: 'carcharam',
    },
  ]

  const [visibleCategories, setVisibleCategories] = useState([])

  useEffect(() => {
    const fetchLiveCategories = async () => {
      const key = process.env.NEXT_PUBLIC_API_KEY // optional: remove if not needed on frontend
      const promises = allCategories.map(async (cat) => {
        const res = await fetch(`/api/products?category=${cat.apiCategory}&limit=1`, {
          headers: {
            'x-api-key': key || '', // if required
          },
        })
        const data = await res.json()
        return data.length > 0 ? cat : null
      })

      const results = await Promise.all(promises)
      setVisibleCategories(results.filter(Boolean))
    }

    fetchLiveCategories()
  }, [])

  return (
    <section className="py-10 px-4 md:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 tracking-wide">
        TOP CATEGORIES
      </h2>

      <div
        className={`gap-8 ${visibleCategories.length < 4
            ? 'flex flex-wrap justify-center'
            : 'grid grid-cols-2 md:grid-cols-4 justify-items-center'
          }`}
      >

        {visibleCategories.map((category, index) => (
          <motion.div
            key={category.slug}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/${category.slug}`}>
              <div className="w-40 h-40 lg:w-64 lg:h-64 rounded-full border border-gray-200 overflow-hidden mx-auto shadow-md cursor-pointer">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>
              <p className="mt-4 text-sm md:text-base font-medium tracking-widest text-gray-800 uppercase">
                {category.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
