"use client";

import { useState } from "react";
import { ContentItem } from "./ContentModal";

type CalendarProps = {
  contents: ContentItem[];

  onStatusChange: (
    id: number,
    status: ContentItem["status"]
  ) => void;

  onEdit: (content: ContentItem) => void;

  onDelete: (id: number) => void;
};

const platformColors = {
  tiktok: "bg-black text-white",
  instagram: "bg-red-500 text-white",
  facebook: "bg-sky-500 text-white",
  all: "bg-green-500 text-white",
};

const statusNames = {
  editing: "กำลังตัดต่อ",
  waiting: "รอออนแอร์",
  published: "ออนแอร์แล้ว",
  not_cut: "ยังไม่ได้ตัด",
  cannot_publish: "ไม่สามารถออนแอร์ได้",
};

const statusColors = {
  editing: "bg-yellow-500",
  waiting: "bg-orange-500",
  published: "bg-green-500",
  not_cut: "bg-red-500",
  cannot_publish: "bg-gray-500",
};

export default function Calendar({
  contents,
  onStatusChange,
  onEdit,
  onDelete,
}: CalendarProps) {
  const [currentDate, setCurrentDate] =
  useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName =
    currentDate.toLocaleDateString("th-TH", {
      month: "long",
    });

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const getDateString = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");

    return `${year}-${m}-${d}`;
  };

  const getEventsForDay = (day: number) => {
    const date = getDateString(day);

    return contents.filter(
      (content) => content.date === date
    );
  };

  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(
      <div
        key={`empty-${i}`}
        className="hidden min-h-0 border-b border-r bg-gray-50 sm:block sm:min-h-[150px]"
      />
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const dayEvents =
      getEventsForDay(day);

    const today = new Date();

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    calendarCells.push(
      <div
        key={day}
        className={`min-h-0 min-w-0 border-b border-r bg-white p-2 sm:min-h-[150px] ${
          isToday ? "bg-blue-50" : ""
        }`}
      >

        <div
          className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
            isToday
              ? "bg-blue-600 text-white"
              : "text-gray-700"
          }`}
        >
          {day}
        </div>

        <div className="space-y-2">

          {dayEvents.map((content) => (

            <div
              key={content.id}
              className={`min-w-0 overflow-hidden rounded-md p-2 text-xs shadow-sm ${
                platformColors[
                  content.platform
                ]
              }`}
            >

              <div className="break-words font-semibold">
                {content.time}
              </div>

              <div className="mt-1 break-words font-medium">
                {content.title}
              </div>

              {content.responsible && (
                <div className="mt-1 break-words text-[11px]">
                  👤 {content.responsible}
                </div>
              )}

              {/* สถานะ */}
              <select
                value={content.status}
                onChange={(e) =>
                  onStatusChange(
                    content.id,
                    e.target.value as ContentItem["status"]
                  )
                }
                className={`mt-2 min-w-0 w-full cursor-pointer truncate rounded border border-white/30 px-1 py-1 text-[10px] text-white outline-none ${statusColors[content.status]}`}
              >
                <option
                  value="not_cut"
                  className="text-black"
                >
                  {statusNames.not_cut}
                </option>

                <option
                  value="editing"
                  className="text-black"
                >
                  {statusNames.editing}
                </option>

                <option
                  value="waiting"
                  className="text-black"
                >
                  {statusNames.waiting}
                </option>

                <option
                  value="published"
                  className="text-black"
                >
                  {statusNames.published}
                </option>

                <option
                  value="cannot_publish"
                  className="text-black"
                >
                  {statusNames.cannot_publish}
                </option>
              </select>

              {/* ปุ่มแก้ไข / ลบ */}
              <div className="mt-2 flex flex-wrap items-stretch gap-1">

                <button
                  onClick={() =>
                    onEdit(content)
                  }
                  className="min-w-0 flex-1 whitespace-normal break-words rounded bg-white/20 px-2 py-1 text-[10px] hover:bg-white/30"
                >
                  ✏️ แก้ไข
                </button>

                <button
                  onClick={() =>
                    onDelete(content.id)
                  }
                  className="shrink-0 rounded bg-red-500/80 px-2 py-1 text-[10px] hover:bg-red-600"
                >
                  🗑️
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">

          <button
            onClick={previousMonth}
            className="rounded-lg border bg-white px-3 py-2 hover:bg-gray-100"
          >
            ←
          </button>

          <button
            onClick={nextMonth}
            className="rounded-lg border bg-white px-3 py-2 hover:bg-gray-100"
          >
            →
          </button>

          <button
            onClick={goToday}
            className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            วันนี้
          </button>

        </div>

        <h2 className="text-center text-xl font-bold">
          {monthName} {year + 543}
        </h2>

        <div className="hidden w-[150px] sm:block" />

      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">

        <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
          TikTok
        </span>

        <span className="rounded-full bg-red-500 px-3 py-1 text-xs text-white">
          Instagram
        </span>

        <span className="rounded-full bg-sky-500 px-3 py-1 text-xs text-white">
          Facebook
        </span>

        <span className="rounded-full bg-green-500 px-3 py-1 text-xs text-white">
          ทุกแพลตฟอร์ม
        </span>

      </div>

      {/* Week */}
      <div className="hidden grid-cols-7 overflow-hidden rounded-t-xl border-l border-t sm:grid">

        {[
          "อาทิตย์",
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัสบดี",
          "ศุกร์",
          "เสาร์",
        ].map((day) => (
          <div
            key={day}
            className="border-b border-r bg-gray-100 py-3 text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}

      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 overflow-hidden rounded-b-xl border-l sm:grid-cols-7">
        {calendarCells}
      </div>

    </div>
  );
}