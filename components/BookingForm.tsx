"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";
import CalendarPicker from "./CalendarPicker";

const MENU_OPTIONS = [
  { id: "clear", label: "クリア", price: "¥6,000" },
  { id: "onecolor", label: "ワンカラー", price: "¥7,000" },
  { id: "gradient", label: "グラデーション", price: "¥7,500" },
  { id: "magnet", label: "マグネット / フラッシュ", price: "¥7,500" },
  { id: "french", label: "フレンチ", price: "¥8,000" },
  { id: "simple", label: "シンプルアート", price: "¥8,800" },
  { id: "design", label: "デザイン・アート自由", price: "¥9,800" },
  { id: "length", label: "長さ出し・補強（1本）", price: "¥500" },
  { id: "off_own_change", label: "当店つけ変えオフ", price: "無料" },
  { id: "off_own_only", label: "オフのみ（当店ネイル）", price: "¥3,800" },
  { id: "off_other_change", label: "他店つけ替えオフ", price: "¥1,500" },
  { id: "off_other_only", label: "オフのみ（他店ネイル）", price: "¥4,500" },
] as const;

// 10:00 - 18:00、30分刻み（最終 18:00）
const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 10; h <= 18; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < 18) slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
})();

function toLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMinDate() {
  return toLocalYMD(new Date());
}

function getMaxDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return toLocalYMD(d);
}

export default function BookingForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [menuId, setMenuId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/reservation/slots")
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.booked || []))
      .catch(() => setBookedSlots([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    if (!date || !time || !menuId || !name || !phone || !email) {
      setErrorMessage("日付・時間・メニュー・お名前・電話番号・メールアドレスは必須です。");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          menuId,
          menuLabel: MENU_OPTIONS.find((m) => m.id === menuId)?.label ?? menuId,
          name,
          phone,
          email,
          memo,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "送信に失敗しました。しばらくしてからお試しください。");
        return;
      }
      setStatus("success");
      setDate("");
      setTime("");
      setMenuId("");
      setName("");
      setPhone("");
      setEmail("");
      setMemo("");
      fetch("/api/reservation/slots")
        .then((r) => r.json())
        .then((data) => setBookedSlots(data.booked || []))
        .catch(() => {});
    } catch {
      setStatus("error");
      setErrorMessage("通信エラーが発生しました。");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <h3 className="text-2xl font-serif text-stone-800 mb-6 border-b border-stone-100 pb-4">
        予約フォーム
      </h3>

      {/* 日付（カレンダー） */}
      <div>
        <label className="flex items-center gap-2 text-stone-800 font-medium mb-2">
          <Calendar className="w-4 h-4 text-pink-300" />
          日付 <span className="text-pink-400">*</span>
        </label>
        <CalendarPicker
          value={date}
          onChange={(d) => {
            setDate(d);
            if (time && bookedSlots.includes(`${d}_${time}`)) setTime("");
          }}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
        />
        {date && (
          <p className="mt-2 text-sm text-stone-500">
            選択中: {date.replace(/-/g, "/")}
          </p>
        )}
        <input
          type="hidden"
          name="date"
          value={date}
          required
          readOnly
          aria-hidden
        />
      </div>

      {/* 時間 */}
      <div>
        <label className="flex items-center gap-2 text-stone-800 font-medium mb-2">
          <Clock className="w-4 h-4 text-pink-300" />
          時間 <span className="text-pink-400">*</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {TIME_SLOTS.map((slot) => {
            const key = date ? `${date}_${slot}` : "";
            const isBooked = key && bookedSlots.includes(key);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => !isBooked && setTime(slot)}
                disabled={!!isBooked}
                className={`py-2 px-3 rounded-lg text-sm border transition-colors ${
                  isBooked
                    ? "border-stone-100 bg-stone-100 text-stone-400 cursor-not-allowed line-through"
                    : time === slot
                      ? "bg-stone-800 text-white border-stone-800"
                      : "border-stone-200 text-stone-600 hover:border-pink-200 hover:text-stone-800"
                }`}
                title={isBooked ? "この枠は予約済みです" : undefined}
              >
                {slot}
              </button>
            );
          })}
        </div>
        {date && bookedSlots.some((s) => s.startsWith(`${date}_`)) && (
          <p className="mt-2 text-xs text-stone-500">※取り消し線は予約済みの枠です</p>
        )}
      </div>

      {/* メニュー */}
      <div>
        <label className="block text-stone-800 font-medium mb-2">
          メニュー <span className="text-pink-400">*</span>
        </label>
        <select
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)}
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white"
        >
          <option value="">選択してください</option>
          {MENU_OPTIONS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} {m.price}
            </option>
          ))}
        </select>
      </div>

      {/* お名前 */}
      <div>
        <label className="block text-stone-800 font-medium mb-2">
          お名前 <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="山田 花子"
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
        />
      </div>

      {/* 電話番号 */}
      <div>
        <label className="block text-stone-800 font-medium mb-2">
          電話番号 <span className="text-pink-400">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="090-1234-5678"
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label className="block text-stone-800 font-medium mb-2">
          メールアドレス <span className="text-pink-400">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
        />
      </div>

      {/* ご要望・メモ */}
      <div>
        <label className="block text-stone-800 font-medium mb-2">ご要望・メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="ご要望があればご記入ください"
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent resize-none"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errorMessage}</p>
      )}

      {status === "success" && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">
          予約リクエストを送信しました。確認のご連絡をお待ちください。
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 bg-stone-800 text-white text-center tracking-widest uppercase hover:bg-stone-700 transition-colors duration-300 rounded-lg shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "送信中..." : "予約を送信する"}
      </button>
    </motion.form>
  );
}
