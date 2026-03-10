"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function About() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            About Owner
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-t-full relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=1000"
                alt="Owner portrait"
                width={1000}
                height={1333}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-pink-200 rounded-t-full z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-serif text-stone-800 mb-6">
              Miyu Tanaka
            </h3>
            <p className="text-stone-500 text-sm tracking-widest mb-8 uppercase">
              Owner Nailist
            </p>

            <div className="space-y-6 text-stone-600 leading-relaxed font-light">
              <p>
                「指先が綺麗になると、心まで少し明るくなる。」<br />
                そんな小さな魔法を信じて、N nailをオープンしました。
              </p>
              <p>
                都内有名サロンで10年間経験を積み、数多くのお客様の指先を彩ってきました。
                お一人おひとりのライフスタイルや爪の悩みに寄り添い、
                シンプルでありながらも、どこか洗練された「あなただけのデザイン」をご提案します。
              </p>
              <p>
                白を基調とした落ち着いたプライベート空間で、
                日常の喧騒を忘れ、ゆったりとした時間をお過ごしください。
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-100">
              <h4 className="text-sm font-serif text-stone-800 tracking-widest mb-4">
                Qualifications
              </h4>
              <ul className="text-sm text-stone-500 space-y-2 font-light">
                <li>JNECネイリスト技能検定1級</li>
                <li>JNAジェルネイル技能検定上級</li>
                <li>ネイルサロン衛生管理士</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
