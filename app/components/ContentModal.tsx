"use client";

import { FormEvent, useEffect, useState } from "react";

export type ContentItem = {
  id: number;
  title: string;
  date: string;
  platform: "tiktok" | "instagram" | "facebook" | "all";
  status:
    | "editing"
    | "published"
    | "not_cut"
    | "waiting"
    | "cannot_publish";
  time: string;
  shootDate: string;
  description: string;

  responsible: "ภูมิ" | "จอม" | "";
};

type ContentModalProps = {
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  initialContent?: ContentItem | null;
};

export default function ContentModal({
  onClose,
  onSave,
  initialContent,
}: ContentModalProps) {
  const isEdit = !!initialContent;

  const [title, setTitle] = useState("");

  const [platform, setPlatform] =
    useState<ContentItem["platform"]>("tiktok");

  const [status, setStatus] =
    useState<ContentItem["status"]>("not_cut");

  const [responsible, setResponsible] =
    useState<ContentItem["responsible"]>("");

  const [shootDate, setShootDate] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("21:00");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialContent) {
      setTitle(initialContent.title);
      setPlatform(initialContent.platform);
      setStatus(initialContent.status);

      setResponsible(initialContent.responsible || "");

      setShootDate(initialContent.shootDate || "");
      setPublishDate(initialContent.date);
      setPublishTime(initialContent.time || "21:00");
      setDescription(initialContent.description || "");
    } else {
      setTitle("");
      setPlatform("tiktok");
      setStatus("not_cut");
      setResponsible("");
      setShootDate("");
      setPublishDate("");
      setPublishTime("21:00");
      setDescription("");
    }
  }, [initialContent]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("กรุณาใส่ชื่อคอนเทนต์");
      return;
    }

    if (!publishDate) {
      alert("กรุณาเลือกวันออนแอร์");
      return;
    }

    const content: ContentItem = {
      id: initialContent?.id ?? 0,
      title: title.trim(),
      date: publishDate,
      platform,
      status,
      time: publishTime,
      shootDate,
      description,
      responsible,
    };

    onSave(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "แก้ไขคอนเทนต์" : "เพิ่มคอนเทนต์"}
            </h2>

            <p className="text-sm text-gray-500">
              {isEdit
                ? "แก้ไขข้อมูลคอนเทนต์ทั้งหมด"
                : "เพิ่มงานลงในปฏิทิน"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >

          {/* ชื่อ */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ชื่อคอนเทนต์
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="เช่น รีวิวสาหร่ายรสวาซาบิ"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              แพลตฟอร์ม
            </label>

            <select
              value={platform}
              onChange={(e) =>
                setPlatform(
                  e.target.value as ContentItem["platform"]
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
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

          {/* ผู้รับผิดชอบ */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ผู้รับผิดชอบ
            </label>

            <select
              value={responsible || ""}
              onChange={(e) =>
                setResponsible(
                  e.target.value as ContentItem["responsible"]
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">
                เลือกผู้รับผิดชอบ
              </option>

              <option value="ภูมิ">
                ภูมิ
              </option>

              <option value="จอม">
                จอม
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              สถานะ
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as ContentItem["status"]
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="not_cut">
                ยังไม่ได้ตัด
              </option>

              <option value="editing">
                กำลังตัดต่อ
              </option>

              <option value="waiting">
                รอออนแอร์
              </option>

              <option value="published">
                ออนแอร์แล้ว
              </option>

              <option value="cannot_publish">
                ไม่สามารถออนแอร์ได้
              </option>
            </select>
          </div>

          {/* วันถ่าย */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              วันถ่ายทำ
            </label>

            <input
              type="date"
              value={shootDate}
              onChange={(e) =>
                setShootDate(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* วันออนแอร์ */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              วันออนแอร์
            </label>

            <input
              type="date"
              value={publishDate}
              onChange={(e) =>
                setPublishDate(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* เวลา */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              เวลาออนแอร์
            </label>

            <input
              type="time"
              value={publishTime}
              onChange={(e) =>
                setPublishTime(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              รายละเอียด
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="รายละเอียดเพิ่มเติม"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-end gap-3 border-t pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {isEdit
                ? "บันทึกการแก้ไข"
                : "บันทึกคอนเทนต์"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}