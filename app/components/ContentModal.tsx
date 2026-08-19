"use client";

import { FormEvent, useState } from "react";

export type ContentItem = {
  id: number;
  title: string;
  date: string;
  platform: "tiktok" | "instagram" | "facebook" | "all";
  status:
    | "editing"
    | "published"
    | "not_cut"
    | "cannot_publish";
  time: string;
  shootDate: string;
  description: string;
};

type ContentModalProps = {
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  initialContent?: ContentItem | null;
};

export default function ContentModal({
  onClose,
  onSave,
  initialContent = null,
}: ContentModalProps) {
  const isEditing = !!initialContent;

  const [title, setTitle] = useState(
    initialContent?.title || ""
  );

  const [platform, setPlatform] =
    useState<ContentItem["platform"]>(
      initialContent?.platform || "tiktok"
    );

  const [status, setStatus] =
    useState<ContentItem["status"]>(
      initialContent?.status || "not_cut"
    );

  const [shootDate, setShootDate] = useState(
    initialContent?.shootDate || ""
  );

  const [publishDate, setPublishDate] = useState(
    initialContent?.date || ""
  );

  const [publishTime, setPublishTime] = useState(
    initialContent?.time || "21:00"
  );

  const [description, setDescription] = useState(
    initialContent?.description || ""
  );

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
      id: initialContent?.id || Date.now(),
      title: title.trim(),
      date: publishDate,
      platform,
      status,
      time: publishTime,
      shootDate,
      description,
    };

    onSave(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing
                ? "แก้ไขคอนเทนต์"
                : "เพิ่มคอนเทนต์"}
            </h2>

            <p className="text-sm text-gray-500">
              {isEditing
                ? "แก้ไขข้อมูลและสถานะคอนเทนต์"
                : "เพิ่มงานลงในปฏิทิน"}
            </p>
          </div>

          <button
            type="button"
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

          {/* Title */}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
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

          {/* Publish Date */}
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

          {/* Publish Time */}
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

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              รายละเอียด
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="รายละเอียดเพิ่มเติมของคอนเทนต์"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          {/* Buttons */}
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
              {isEditing
                ? "บันทึกการแก้ไข"
                : "บันทึกคอนเทนต์"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}