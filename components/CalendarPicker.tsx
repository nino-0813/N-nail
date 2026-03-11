"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** ローカル日付で YYYY-MM-DD を返す（UTC にするとタイムゾーンで日付がずれるため） */
function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return toYMD(a) === toYMD(b);
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
};

export default function CalendarPicker({ value, onChange, minDate, maxDate }: Props) {
  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(new Date(minDate)) : today;
  const max = maxDate ? startOfDay(new Date(maxDate)) : (() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 3);
    return d;
  })();

  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value + "T12:00:00");
    return new Date(today);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // カレンダー表示用: その月の1日が何曜日か、月末日
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 前月の末尾（空白埋め用）
  const prevMonthLast = new Date(year, month, 0);
  const prevDays = prevMonthLast.getDate();
  const leadingBlanks = startWeekday;

  const days: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) {
    const d = prevDays - leadingBlanks + 1 + i;
    days.push(new Date(year, month - 1, d));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  const trailingCount = 42 - days.length;
  for (let i = 0; i < trailingCount; i++) {
    days.push(new Date(year, month + 1, i + 1));
  }

  const selectedDate = value ? new Date(value + "T12:00:00") : null;

  const goPrev = () => setViewDate(new Date(year, month - 1));
  const goNext = () => setViewDate(new Date(year, month + 1));
  const canGoPrev = month > today.getMonth() || year > today.getFullYear();
  const canGoNext = month < max.getMonth() || year < max.getFullYear();

  const handleSelect = (d: Date) => {
    const dayStart = startOfDay(d);
    if (isBefore(dayStart, min) || isAfter(dayStart, max)) return;
    onChange(toYMD(d));
  };

  return (
    <div className="inline-block bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* 年月ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="前月"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-stone-800 font-serif text-lg tracking-wide tabular-nums">
          {year}年 {month + 1}月
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="翌月"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 曜日行 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-xs py-2 font-medium tabular-nums ${
              i === 0 ? "text-rose-400/90" : i === 6 ? "text-sky-500/80" : "text-stone-500"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const dayStart = startOfDay(d);
          const isCurrentMonth = d.getMonth() === month;
          const isSelectable = !isBefore(dayStart, min) && !isAfter(dayStart, max);
          const isSelected = selectedDate && isSameDay(d, selectedDate);
          const isToday = isSameDay(d, today);
          const isSun = d.getDay() === 0;
          const isSat = d.getDay() === 6;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(d)}
              disabled={!isSelectable}
              className={`
                w-10 h-10 rounded-xl text-sm font-medium tabular-nums transition-all duration-200
                ${!isCurrentMonth ? "text-stone-300" : isSun ? "text-rose-400/90" : isSat ? "text-sky-500/80" : "text-stone-700"}
                ${!isSelectable ? "opacity-35 cursor-not-allowed" : "hover:bg-pink-50 active:scale-95"}
                ${isSelected ? "bg-pink-500 text-white hover:bg-pink-600 shadow-sm" : ""}
                ${isToday && !isSelected ? "ring-2 ring-pink-200 ring-offset-2 ring-offset-white" : ""}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
