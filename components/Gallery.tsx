"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const galleryImages = [
  "/gallery-1.webp",
  "/gallery-2.webp",
  "/gallery-3.webp",
  "/gallery-4.webp",
  "/gallery-5.webp",
  "/gallery-6.webp",
  "/gallery-7.webp",
  "/gallery-8.webp",
];

const reviews = [
  {
    id: 1,
    name: "Y.K 様",
    text: "初めて伺いましたが、とても丁寧なカウンセリングで安心してお任せできました。仕上がりも理想通りで大満足です！",
    rating: 5,
  },
  {
    id: 2,
    name: "M.A 様",
    text: "デザインの相談に親身に乗ってくれて、イメージ通りの仕上がりに感動しました。ネイルのキープも良く、次回も楽しみにしています。",
    rating: 5,
  },
  {
    id: 3,
    name: "S.T 様",
    text: "いつもお世話になっています。季節に合わせた提案をしてくださり、毎回新しい発見があります。施術中の会話も楽しいです。",
    rating: 5,
  },
];

export default function Gallery() {
  return (
    <section className="py-24 md:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            Gallery
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mb-6" />
          <p className="text-stone-500 text-sm tracking-widest font-light">
            これまでの施術例
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-32">
          {galleryImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="aspect-square overflow-hidden group relative"
            >
              <Image
                src={src}
                alt={`Nail design ${index + 1}`}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            Reviews
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mb-6" />
          <p className="text-stone-500 text-sm tracking-widest font-light">
            お客様の声
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center"
            >
              <div className="flex gap-1 mb-6 text-pink-300">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-stone-600 font-light leading-relaxed mb-6 flex-grow">
                &quot;{review.text}&quot;
              </p>
              <p className="text-stone-800 font-serif tracking-widest text-sm">
                {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
