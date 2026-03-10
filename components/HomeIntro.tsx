"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    title: "About",
    description: "オーナーとサロンの想い",
    href: "/about",
  },
  {
    title: "Gallery & Reviews",
    description: "施術例とお客様の声",
    href: "/gallery",
  },
  {
    title: "Reservation",
    description: "メニュー・ご予約",
    href: "/reservation",
  },
];

export default function HomeIntro() {
  return (
    <section className="bg-white">
      {/* Concept */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-12 h-px bg-pink-300 mx-auto mb-8" />
          <p className="text-stone-600 leading-relaxed font-light text-base md:text-lg">
            落ち着いたプライベート空間で、
            <br className="hidden sm:block" />
            あなただけの特別な時間をお過ごしください。
          </p>
          <p className="text-stone-500 text-sm mt-6 tracking-widest font-light">
            完全予約制
          </p>
        </motion.div>
      </div>

      {/* Links to pages */}
      <div className="border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {sections.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group block p-8 md:p-10 rounded-2xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-100 hover:border-pink-100 transition-all duration-300"
                >
                  <h3 className="text-2xl md:text-3xl font-serif text-stone-800 tracking-[0.2em] mb-3 group-hover:text-stone-700">
                    {item.title}
                  </h3>
                  <p className="text-stone-500 text-sm font-light mb-5 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-stone-600 font-light tracking-wider group-hover:text-pink-400 transition-colors">
                    詳しく見る
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-stone-50 py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-stone-600 font-light mb-8 tracking-wider">
              ご予約はこちらから
            </p>
            <Link
              href="/reservation"
              className="inline-block px-10 py-4 border-2 border-stone-800 text-stone-800 font-serif tracking-widest uppercase hover:bg-stone-800 hover:text-white transition-all duration-300"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
