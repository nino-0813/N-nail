"use client";

import { motion } from "motion/react";

const menuItems = [
  { title: "クリア", description: "", price: "¥6,000" },
  { title: "ワンカラー", description: "", price: "¥7,000" },
  { title: "グラデーション", description: "", price: "¥7,500" },
  { title: "マグネット / フラッシュ", description: "", price: "¥7,500" },
  { title: "フレンチ", description: "", price: "¥8,000" },
  { title: "シンプルアート", description: "", price: "¥8,800" },
  { title: "デザイン・アート自由", description: "", price: "¥9,800" },
  { title: "長さ出し・補強（1本）", description: "", price: "¥500" },
  { title: "当店つけ変えオフ", description: "当店でつけ変えする場合", price: "無料" },
  { title: "オフのみ（当店ネイル）", description: "", price: "¥3,800" },
  { title: "他店つけ替えオフ", description: "他店のネイルをお持ちの場合", price: "¥1,500" },
  { title: "オフのみ（他店ネイル）", description: "", price: "¥4,500" },
];

export default function MenuList() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            Menu
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mb-6" />
          <p className="text-stone-500 text-sm tracking-widest font-light">
            メニュー・料金
          </p>
        </div>

        <div className="space-y-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex justify-between items-baseline border-b border-stone-100 pb-8"
            >
              <div>
                <h3 className="text-lg text-stone-800 font-medium mb-1">{item.title}</h3>
                {item.description ? (
                  <p className="text-sm text-stone-500 font-light">{item.description}</p>
                ) : null}
              </div>
              <span className="text-lg font-serif text-stone-800 tracking-widest whitespace-nowrap ml-6">
                {item.price}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-stone-400 mt-12 font-light">
          ※表示価格はすべて税込です。<br />
          ※初回のお客様はオフ代無料となります。
        </p>
      </div>
    </section>
  );
}
