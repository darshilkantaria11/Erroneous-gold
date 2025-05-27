'use client';
import Image from 'next/image';
import { FaGem, FaHandsHelping, FaAward, FaHeart } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white mb-10">
      {/* Hero Section */}
      <section className="relative h-96 bg-c4">
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-6">Crafting Stories in Gold</h1>
            <p className="text-xl">Where Personalization Meets Timeless Elegance</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/logo.svg"
                alt="Our Workshop"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Golden Journey</h2>
              <p className="text-gray-600 mb-4">
                Founded in the heart of India, Erroneous Gold Private Limited began as a 
                passionate endeavor to transform personalized jewelry into wearable art. 
                What started as a small artisan workshop has blossomed into a trusted name 
                in customized name necklaces, serving thousands of customers nationwide.
              </p>
              <p className="text-gray-600">
                Every piece we create carries the weight of tradition and the spark of 
                modern craftsmanship. We believe that jewelry should be as unique as the 
                story it represents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Golden Promise</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaGem className="w-12 h-12 mb-4 text-c4" />,
                title: "Premium Quality",
                text: "14K & 18K gold options with certified materials"
              },
              {
                icon: <FaHandsHelping className="w-12 h-12 mb-4 text-c4" />,
                title: "Custom Craftsmanship",
                text: "Handcrafted precision for perfect personalization"
              },
              {
                icon: <FaAward className="w-12 h-12 mb-4 text-c4" />,
                title: "Lifetime Care",
                text: "Free cleaning and maintenance services"
              },
              {
                icon: <FaHeart className="w-12 h-12 mb-4 text-c4" />,
                title: "Ethical Practices",
                text: "Responsibly sourced materials and fair trade"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 hover:bg-amber-50 rounded-xl transition-all">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meticulous Artistry</h2>
              <p className="text-gray-600 mb-4">
                Each personalized necklace undergoes 14 precise stages of creation:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Design Consultation', '3D Modeling', 'Gold Casting', 'Laser Engraving',
                  'Stone Setting', 'Polishing', 'Quality Check', 'Personalized Packaging'].map((step, index) => (
                  <div key={index} className="flex items-center bg-white p-3 rounded-lg">
                    <div className="w-8 h-8 bg-c4 text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
              <Image
                src="/logo.svg"
                alt="Crafting Process"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA Section */}
      <section className="py-16 bg-c4 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Your Story, Our Passion</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            With a team of master jewelers and client specialists, we&apos;re dedicated to 
            transforming your meaningful moments into eternal golden keepsakes.
          </p>
          <div className="flex justify-center space-x-6">
            <button className="bg-white text-c4 px-8 py-3 rounded-full font-semibold hover:bg-amber-100 transition-colors">
              Explore Collections
            </button>
            <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-c4 transition-colors">
              Meet Our Artisans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}