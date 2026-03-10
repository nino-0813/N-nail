"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin } from "lucide-react";
import BookingForm from "./BookingForm";

export default function Reservation() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            Reservation
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mb-6" />
          <p className="text-stone-500 text-sm tracking-widest font-light">
            ご予約
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-stone-50 p-8 md:p-12 rounded-3xl"
        >
          <h3 className="text-2xl font-serif text-stone-800 mb-8">
            Information
          </h3>

          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-pink-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-stone-800 font-medium mb-1">営業時間</h4>
                <p className="text-stone-600 font-light text-sm">10:00〜18:00 不定休</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-pink-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-stone-800 font-medium mb-1">アクセス</h4>
                <p className="text-stone-600 font-light text-sm">広島県福山市駅家町</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-pink-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-stone-800 font-medium mb-1">ご予約について</h4>
                <p className="text-stone-600 font-light text-sm">
                  完全予約制です。下のフォームから日時・メニューを選んでご予約ください。
                </p>
              </div>
            </div>
          </div>

          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
