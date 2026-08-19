"use client";

import { useEffect, useState } from "react";
import { ContentItem } from "./ContentModal";
import { supabase } from "../../lib/supabase";

type CalendarProps = {
  contents: ContentItem[];
};

const platformColors = {
  tiktok: "bg-black text-white",
  instagram: "bg-red-500 text-white",
  facebook: "bg-sky-500 text-white",
  all: "bg-green-500 text-white",
};

const statusNames = {
  editing: "กำลังตัดต่อ",
  published: "ออนแอร์แล้ว",
  not_cut: "ยังไม่ได้ตัด",
  cannot_publish: "ไม่สามารถออนแอร์ได้",
};

export default function Calendar({
  contents,
}: CalendarProps) {

  // ข้อมูลที่แสดงบน Calendar
  const [items, setItems] =
    useState<ContentItem[]>(contents);

  // เดือนปัจจุบัน
  const [currentDate, setCurrentDate] =
    useState(new Date(2026, 7, 1));

  // กำลังบันทึก
  const [saving, setSaving] =
    useState<number | null>(null);

  // ถ้า page ส่งข้อมูลใหม่มา
  useEffect(() => {
    setItems(contents);
  }, [contents]);

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const monthName =
    currentDate.toLocaleDateString(
      "th-TH",
      {
        month: "long",
      }
    );

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  // -----------------------------
  // เปลี่ยนเดือน
  // -----------------------------

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToday = () => {
    setCurrentDate(
      new Date()
    );
  };

  // -----------------------------
  // วันที่
  // -----------------------------

  const getDateString = (
    day: number
  ) => {

    const m =
      String(month + 1)
        .padStart(2, "0");

    const d =
      String(day)
        .padStart(2, "0");

    return `${year}-${m}-${d}`;
  };

  const getEventsForDay = (
    day: number
  ) => {

    const date =
      getDateString(day);

    return items.filter(
      (item) =>
        item.date === date
    );
  };

  // -----------------------------
  // เปลี่ยนสถานะ
  // -----------------------------

  const changeStatus = async (
    id: number,
    status: ContentItem["status"]
  ) => {

    try {

      setSaving(id);

      const { error } =
        await supabase
          .from("contents")
          .update({
            status,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id);

      if (error) {
        alert(
          "บันทึกสถานะไม่สำเร็จ\n" +
          error.message
        );
        return;
      }

      // เปลี่ยนหน้าจอทันที
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "เกิดข้อผิดพลาด"
      );

    } finally {

      setSaving(null);

    }
  };

  // -----------------------------
  // แก้ไข Content
  // -----------------------------

  const editContent = async (
    content: ContentItem
  ) => {

    // 1. ชื่อ
    const title =
      window.prompt(
        "ชื่อคอนเทนต์",
        content.title
      );

    if (title === null) {
      return;
    }

    // 2. วันออนแอร์
    const publishDate =
      window.prompt(
        "วันออนแอร์\nตัวอย่าง: 2026-08-25",
        content.date
      );

    if (publishDate === null) {
      return;
    }

    // 3. เวลา
    const publishTime =
      window.prompt(
        "เวลาออนแอร์\nตัวอย่าง: 21:00",
        content.time
      );

    if (publishTime === null) {
      return;
    }

    // 4. สถานะ
    const statusInput =
      window.prompt(
        "สถานะ\n\n" +
        "1 = ยังไม่ได้ตัด\n" +
        "2 = กำลังตัดต่อ\n" +
        "3 = ออนแอร์แล้ว\n" +
        "4 = ไม่สามารถออนแอร์ได้\n\n" +
        "กรอกเลข 1-4",
        content.status === "not_cut"
          ? "1"
          : content.status === "editing"
          ? "2"
          : content.status === "published"
          ? "3"
          : "4"
      );

    if (statusInput === null) {
      return;
    }

    let newStatus:
      ContentItem["status"];

    if (statusInput === "1") {
      newStatus = "not_cut";
    } else if (statusInput === "2") {
      newStatus = "editing";
    } else if (statusInput === "3") {
      newStatus = "published";
    } else if (statusInput === "4") {
      newStatus =
        "cannot_publish";
    } else {
      alert(
        "กรุณาใส่เลข 1-4"
      );
      return;
    }

    // 5. รายละเอียด
    const description =
      window.prompt(
        "รายละเอียด",
        content.description
      );

    if (description === null) {
      return;
    }

    try {

      setSaving(content.id);

      // -----------------------------
      // บันทึก Supabase
      // -----------------------------

      const { error } =
        await supabase
          .from("contents")
          .update({

            title:
              title.trim(),

            status:
              newStatus,

            publish_date:
              publishDate,

            publish_time:
              publishTime,

            description:
              description,

            updated_at:
              new Date().toISOString(),

          })
          .eq(
            "id",
            content.id
          );

      if (error) {

        console.error(
          error
        );

        alert(
          "แก้ไขไม่สำเร็จ\n\n" +
          error.message
        );

        return;
      }

      // -----------------------------
      // อัปเดตหน้าจอ
      // -----------------------------

      setItems((current) =>
        current.map(
          (item) =>
            item.id ===
            content.id
              ? {
                  ...item,

                  title:
                    title.trim(),

                  date:
                    publishDate,

                  time:
                    publishTime,

                  status:
                    newStatus,

                  description:
                    description,
                }
              : item
        )
      );

      alert(
        "แก้ไขข้อมูลเรียบร้อยแล้ว"
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "เกิดข้อผิดพลาดในการบันทึก"
      );

    } finally {

      setSaving(null);

    }
  };

  // -----------------------------
  // สร้างช่อง Calendar
  // -----------------------------

  const calendarCells = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendarCells.push(
      <div
        key={`empty-${i}`}
        className="min-h-[130px] border-b border-r bg-gray-50"
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

    const today =
      new Date();

    const isToday =
      today.getFullYear() ===
        year &&
      today.getMonth() ===
        month &&
      today.getDate() ===
        day;

    calendarCells.push(

      <div
        key={day}
        className={`min-h-[130px] border-b border-r bg-white p-2 ${
          isToday
            ? "bg-blue-50"
            : ""
        }`}
      >

        {/* วันที่ */}

        <div
          className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
            isToday
              ? "bg-blue-600 text-white"
              : "text-gray-700"
          }`}
        >
          {day}
        </div>

        {/* Content */}

        <div className="space-y-1">

          {dayEvents.map(
            (content) => (

              <div
                key={content.id}
                className={`rounded-md p-2 text-xs shadow-sm ${
                  platformColors[
                    content.platform
                  ]
                }`}
              >

                {/* เวลา */}

                <div className="font-semibold">
                  {content.time}
                </div>

                {/* ชื่อ */}

                <div className="mt-1 line-clamp-2 font-medium">
                  {content.title}
                </div>

                {/* สถานะ */}

                <select
                  value={
                    content.status
                  }
                  disabled={
                    saving ===
                    content.id
                  }
                  onChange={(e) =>
                    changeStatus(
                      content.id,
                      e.target
                        .value as ContentItem["status"]
                    )
                  }
                  className="mt-2 w-full rounded border border-white/30 bg-white/20 px-1 py-1 text-[10px] text-inherit outline-none"
                >

                  <option
                    value="not_cut"
                    className="text-black"
                  >
                    ยังไม่ได้ตัด
                  </option>

                  <option
                    value="editing"
                    className="text-black"
                  >
                    กำลังตัดต่อ
                  </option>

                  <option
                    value="published"
                    className="text-black"
                  >
                    ออนแอร์แล้ว
                  </option>

                  <option
                    value="cannot_publish"
                    className="text-black"
                  >
                    ไม่สามารถออนแอร์ได้
                  </option>

                </select>

                {/* ปุ่มแก้ไข */}

                <button
                  onClick={() =>
                    editContent(
                      content
                    )
                  }
                  disabled={
                    saving ===
                    content.id
                  }
                  className="mt-2 w-full rounded bg-white/20 px-2 py-1 text-[10px] hover:bg-white/30 disabled:opacity-50"
                >
                  ✏️ แก้ไขข้อมูล
                </button>

              </div>

            )
          )}

        </div>

      </div>

    );

  }

  // -----------------------------
  // Render
  // -----------------------------

  return (

    <div className="w-full">

      {/* Header */}

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <button
            onClick={
              previousMonth
            }
            className="rounded-lg border bg-white px-3 py-2 hover:bg-gray-100"
          >
            ←
          </button>

          <button
            onClick={
              nextMonth
            }
            className="rounded-lg border bg-white px-3 py-2 hover:bg-gray-100"
          >
            →
          </button>

          <button
            onClick={
              goToday
            }
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            วันนี้
          </button>

        </div>

        <h2 className="text-xl font-bold text-gray-900">
          {monthName}{" "}
          {year + 543}
        </h2>

        <div className="w-[150px]" />

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

      <div className="grid grid-cols-7 overflow-hidden rounded-t-xl border-l border-t">

        {[
          "อาทิตย์",
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัสบดี",
          "ศุกร์",
          "เสาร์",
        ].map(
          (day) => (

            <div
              key={day}
              className="border-b border-r bg-gray-100 py-3 text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>

          )
        )}

      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 overflow-hidden rounded-b-xl border-l">
        {calendarCells}
      </div>

    </div>

  );
}