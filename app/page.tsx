"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Platform =
  | "tiktok"
  | "instagram"
  | "facebook"
  | "all";

type Status =
  | "editing"
  | "published"
  | "not_cut"
  | "cannot_publish";

type ContentItem = {
  id: number;
  title: string;
  date: string;
  platform: Platform;
  status: Status;
  time: string;
  shootDate: string;
  description: string;
};

const platformColors = {
  tiktok: "bg-black text-white",
  instagram: "bg-red-500 text-white",
  facebook: "bg-sky-500 text-white",
  all: "bg-green-500 text-white",
};

const platformNames = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  all: "ทุกแพลตฟอร์ม",
};

const statusNames = {
  editing: "กำลังตัดต่อ",
  published: "ออนแอร์แล้ว",
  not_cut: "ยังไม่ได้ตัด",
  cannot_publish: "ไม่สามารถออนแอร์ได้",
};

const statusColors = {
  editing: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  not_cut: "bg-red-100 text-red-700",
  cannot_publish: "bg-gray-100 text-gray-700",
};

export default function Home() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] =
    useState<ContentItem | null>(null);

  // =========================
  // โหลดข้อมูลจาก Supabase
  // =========================

  const loadContents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .order("publish_date", {
        ascending: true,
      })
      .order("publish_time", {
        ascending: true,
      });

    if (error) {
      console.error("LOAD ERROR:", error);
      alert(
        `โหลดข้อมูลไม่สำเร็จ\n\n${error.message}`
      );
      setLoading(false);
      return;
    }

    const formatted: ContentItem[] = (data || []).map(
      (item: any) => ({
        id: item.id,
        title: item.title || "",
        date: item.publish_date || "",
        platform: item.platform || "tiktok",
        status: item.status || "not_cut",
        time: item.publish_time
          ? String(item.publish_time).slice(0, 5)
          : "21:00",
        shootDate: item.shoot_date || "",
        description: item.description || "",
      })
    );

    setContents(formatted);
    setLoading(false);
  };

  useEffect(() => {
    loadContents();
  }, []);

  // =========================
  // เปิดเพิ่ม
  // =========================

  const openAdd = () => {
    setEditingContent(null);
    setShowModal(true);
  };

  // =========================
  // เปิดแก้ไข
  // =========================

  const openEdit = (content: ContentItem) => {
    setEditingContent(content);
    setShowModal(true);
  };

  // =========================
  // ปิด Modal
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingContent(null);
  };

  // =========================
  // เพิ่ม / แก้ไขข้อมูล
  // =========================

  const handleSave = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const title =
      String(form.get("title") || "").trim();

    const platform =
      String(form.get("platform") || "tiktok") as Platform;

    const status =
      String(form.get("status") || "not_cut") as Status;

    const shootDate =
      String(form.get("shootDate") || "");

    const publishDate =
      String(form.get("publishDate") || "");

    const publishTime =
      String(form.get("publishTime") || "21:00");

    const description =
      String(form.get("description") || "").trim();

    if (!title) {
      alert("กรุณาใส่ชื่อคอนเทนต์");
      return;
    }

    if (!publishDate) {
      alert("กรุณาเลือกวันออนแอร์");
      return;
    }

    // =========================
    // แก้ไข
    // =========================

    if (editingContent) {
      const { error } = await supabase
        .from("contents")
        .update({
          title,
          platform,
          status,
          shoot_date:
            shootDate || null,
          publish_date: publishDate,
          publish_time:
            publishTime || null,
          description:
            description || null,
        })
        .eq("id", editingContent.id);

      if (error) {
        console.error(
          "UPDATE ERROR:",
          error
        );

        alert(
          `แก้ไขข้อมูลไม่สำเร็จ\n\n${error.message}`
        );

        return;
      }

      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
    }

    // =========================
    // เพิ่มใหม่
    // =========================

    else {
      const { error } = await supabase
        .from("contents")
        .insert({
          title,
          platform,
          status,
          shoot_date:
            shootDate || null,
          publish_date: publishDate,
          publish_time:
            publishTime || null,
          description:
            description || null,
        });

      if (error) {
        console.error(
          "INSERT ERROR:",
          error
        );

        alert(
          `เพิ่มข้อมูลไม่สำเร็จ\n\n${error.message}`
        );

        return;
      }

      alert("เพิ่มคอนเทนต์เรียบร้อยแล้ว");
    }

    closeModal();

    await loadContents();
  };

  // =========================
  // เปลี่ยนสถานะ
  // =========================

  const handleStatusChange = async (
    id: number,
    status: Status
  ) => {
    const { error } = await supabase
      .from("contents")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        `เปลี่ยนสถานะไม่สำเร็จ\n\n${error.message}`
      );

      return;
    }

    setContents((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  // =========================
  // ลบข้อมูล
  // =========================

  const handleDelete = async (
    id: number
  ) => {
    const target = contents.find(
      (item) => item.id === id
    );

    if (!target) {
      alert("ไม่พบข้อมูลที่ต้องการลบ");
      return;
    }

    const confirmed = window.confirm(
      `ต้องการลบ "${target.title}" ใช่หรือไม่?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("contents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        `ลบข้อมูลไม่สำเร็จ\n\n${error.message}`
      );

      return;
    }

    setContents((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    alert("ลบคอนเทนต์เรียบร้อยแล้ว");
  };

  // =========================
  // Calendar
  // =========================

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

  const getDateString = (
    day: number
  ) => {
    const m = String(
      month + 1
    ).padStart(2, "0");

    const d = String(day).padStart(
      2,
      "0"
    );

    return `${year}-${m}-${d}`;
  };

  const getEventsForDay = (
    day: number
  ) => {
    const date =
      getDateString(day);

    return contents.filter(
      (item) =>
        item.date === date
    );
  };

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

  const total =
    contents.length;

  const editing =
    contents.filter(
      (item) =>
        item.status === "editing"
    ).length;

  const published =
    contents.filter(
      (item) =>
        item.status === "published"
    ).length;

  const notCut =
    contents.filter(
      (item) =>
        item.status === "not_cut"
    ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Content Calendar
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              ปฏิทินวางแผนและจัดการคอนเทนต์
            </p>
          </div>

          <button
            onClick={openAdd}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            + เพิ่มคอนเทนต์
          </button>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              คอนเทนต์ทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-bold">
              {total}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-yellow-600">
              กำลังตัดต่อ
            </p>

            <p className="mt-2 text-3xl font-bold">
              {editing}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-green-600">
              ออนแอร์แล้ว
            </p>

            <p className="mt-2 text-3xl font-bold">
              {published}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-red-600">
              ยังไม่ได้ตัด
            </p>

            <p className="mt-2 text-3xl font-bold">
              {notCut}
            </p>
          </div>

        </div>

        {/* ================= CALENDAR ================= */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          {/* Calendar Header */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">

              <button
                onClick={previousMonth}
                className="rounded-lg border px-3 py-2 hover:bg-gray-100"
              >
                ←
              </button>

              <button
                onClick={nextMonth}
                className="rounded-lg border px-3 py-2 hover:bg-gray-100"
              >
                →
              </button>

              <button
                onClick={goToday}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                วันนี้
              </button>

            </div>

            <h2 className="text-center text-xl font-bold">
              {monthName}{" "}
              {year + 543}
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

          {/* Days */}

          <div className="grid grid-cols-1 overflow-hidden rounded-b-xl border-l sm:grid-cols-7">

            {Array.from({
              length: firstDay,
            }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="hidden min-h-0 border-b border-r bg-gray-50 sm:block sm:min-h-[150px]"
              />
            ))}

            {Array.from({
              length: daysInMonth,
            }).map((_, index) => {

              const day =
                index + 1;

              const events =
                getEventsForDay(
                  day
                );

              const today =
                new Date();

              const isToday =
                today.getFullYear() ===
                  year &&
                today.getMonth() ===
                  month &&
                today.getDate() ===
                  day;

              return (
                <div
                  key={day}
                  className={`min-h-0 min-w-0 border-b border-r p-2 sm:min-h-[150px] ${
                    isToday
                      ? "bg-blue-50"
                      : "bg-white"
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

                    {events.map(
                      (content) => (
                        <div
                          key={
                            content.id
                          }
                          className={`min-w-0 overflow-hidden rounded-md p-2 text-xs shadow-sm ${
                            platformColors[
                              content.platform
                            ]
                          }`}
                        >

                          {/* เวลา */}

                          <div className="break-words font-semibold">
                            {content.time}
                          </div>

                          {/* ชื่อ */}

                          <div className="mt-1 break-words font-semibold">
                            {content.title}
                          </div>

                          {/* Status */}

                          <select
                            value={
                              content.status
                            }
                            onChange={(
                              e
                            ) =>
                              handleStatusChange(
                                content.id,
                                e.target
                                  .value as Status
                              )
                            }
                            className="mt-2 min-w-0 w-full cursor-pointer truncate rounded border border-white/30 bg-white/20 px-1 py-1 text-[10px] font-medium text-white outline-none"
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

                          {/* Buttons */}

                          <div className="mt-2 flex flex-wrap items-stretch gap-1">

                            <button
                              onClick={() =>
                                openEdit(
                                  content
                                )
                              }
                              className="min-w-0 flex-1 whitespace-normal break-words rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-black hover:bg-white"
                            >
                              ✏️ แก้ไข
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  content.id
                                )
                              }
                              className="shrink-0 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-red-700"
                            >
                              🗑️
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-xl font-bold">
                  {editingContent
                    ? "แก้ไขคอนเทนต์"
                    : "เพิ่มคอนเทนต์"}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingContent
                    ? "แก้ไขข้อมูลคอนเทนต์ทั้งหมด"
                    : "เพิ่มงานลงในปฏิทิน"}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-full px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSave}
              className="space-y-4 p-6"
            >

              {/* ชื่อ */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  ชื่อคอนเทนต์
                </label>

                <input
                  name="title"
                  defaultValue={
                    editingContent?.title ||
                    ""
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
                  placeholder="เช่น รีวิวสาหร่ายรสวาซาบิ"
                />

              </div>

              {/* Platform */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  แพลตฟอร์ม
                </label>

                <select
                  name="platform"
                  defaultValue={
                    editingContent?.platform ||
                    "tiktok"
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >

                  <option value="tiktok">
                    TikTok
                  </option>

                  <option value="instagram">
                    Instagram
                  </option>

                  <option value="facebook">
                    Facebook
                  </option>

                  <option value="all">
                    ทุกแพลตฟอร์ม
                  </option>

                </select>

              </div>

              {/* Status */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  สถานะ
                </label>

                <select
                  name="status"
                  defaultValue={
                    editingContent?.status ||
                    "not_cut"
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >

                  <option value="not_cut">
                    ยังไม่ได้ตัด
                  </option>

                  <option value="editing">
                    กำลังตัดต่อ
                  </option>

                  <option value="published">
                    ออนแอร์แล้ว
                  </option>

                  <option value="cannot_publish">
                    ไม่สามารถออนแอร์ได้
                  </option>

                </select>

              </div>

              {/* Shoot Date */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  วันถ่ายทำ
                </label>

                <input
                  type="date"
                  name="shootDate"
                  defaultValue={
                    editingContent?.shootDate ||
                    ""
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>

              {/* Publish Date */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  วันออนแอร์
                </label>

                <input
                  type="date"
                  name="publishDate"
                  defaultValue={
                    editingContent?.date ||
                    ""
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>

              {/* Publish Time */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  เวลาออนแอร์
                </label>

                <input
                  type="time"
                  name="publishTime"
                  defaultValue={
                    editingContent?.time ||
                    "21:00"
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-1 block text-sm font-medium">
                  รายละเอียด
                </label>

                <textarea
                  name="description"
                  defaultValue={
                    editingContent?.description ||
                    ""
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border px-3 py-2"
                  placeholder="รายละเอียดเพิ่มเติมของคอนเทนต์"
                />

              </div>

              {/* Buttons */}

              <div className="flex justify-between border-t pt-4">

                <div>

                  {editingContent && (
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();

                        handleDelete(
                          editingContent.id
                        );
                      }}
                      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      🗑️ ลบคอนเทนต์
                    </button>
                  )}

                </div>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    {editingContent
                      ? "บันทึกการแก้ไข"
                      : "บันทึกคอนเทนต์"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="fixed bottom-5 right-5 rounded-lg bg-black px-4 py-3 text-sm text-white shadow-lg">
          กำลังโหลดข้อมูล...
        </div>
      )}

    </main>
  );
}