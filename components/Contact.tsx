"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Instagram, MapPin } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "送信に失敗しました。しばらくしてからお試しください。");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("通信エラーが発生しました。");
    }
  }

  return (
    <section id="inquiry" className="py-24 md:py-32 bg-stone-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-widest mb-4">
            Contact
          </h2>
          <div className="w-12 h-px bg-pink-300 mx-auto mb-6" />
          <p className="text-stone-500 text-sm tracking-widest font-light">
            お問い合わせ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100"
          >
            <h3 className="text-2xl font-serif text-stone-800 mb-8 border-b border-stone-100 pb-4">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                  お名前 <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-300"
                  placeholder="山田 花子"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                  メールアドレス <span className="text-pink-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-300"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  お問い合わせ内容 <span className="text-pink-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="ご質問やご要望をご記入ください。"
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errorMessage}</p>
              )}
              {status === "success" && (
                <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">
                  お問い合わせを送信しました。ありがとうございます。
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-stone-800 text-white text-center tracking-widest uppercase hover:bg-stone-700 transition-colors duration-300 rounded-lg shadow-md hover:shadow-lg mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "送信中..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-serif text-stone-800 mb-8 border-b border-stone-200 pb-4">
                Get in Touch
              </h3>

              <div className="space-y-8 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-400">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 font-light mb-1">InstagramのDMはこちら</p>
                    <a href="https://www.instagram.com/chii.nino3/" target="_blank" rel="noopener noreferrer" className="text-lg font-serif text-stone-800 tracking-wider hover:text-pink-400 transition-colors">Instagram @chii.nino3</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-64 bg-stone-200 rounded-3xl overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps?q=34.5490909,133.3258955&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="最寄駅：駅家駅"
                className="absolute inset-0 w-full h-full"
              />
              <a
                href="https://www.google.com/maps/place/%E9%A7%85%E5%AE%B6%E9%A7%85/@34.5490168,133.3232373,17z/data=!4m10!1m2!2m1!1z6aeF5a62!3m6!1s0x355119e098bcbc15:0x6889e99f83341bb4!8m2!3d34.5490909!4d133.3258955!15sCgbpp4XlrraSAQ10cmFpbl9zdGF0aW9u4AEA!16s%2Fg%2F1tht9yy4?authuser=0&entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white/95 hover:bg-white shadow-lg px-4 py-2 rounded-full text-stone-800 font-serif tracking-widest text-xs flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                Google マップで開く（最寄駅：駅家駅）
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
