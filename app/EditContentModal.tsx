"use client";

import { FormEvent, useState } from "react";
import type { ContentItem } from "./components/ContentModal";

type EditContentModalProps = {
  content: ContentItem;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
};

export default function EditContentModal({
  content,
  onClose,
  onSave,
}: EditContentModalProps) {
  const [title, setTitle] = useState(content.title);
  const [platform, setPlatform] =
    useState<ContentItem["platform"]>(content.platform);

  const [status, setStatus] =
    useState<ContentItem["status"]>(content.status);

  const [responsible, setResponsible] =
    useState<ContentItem["responsible"]>(content.responsible || "");

  const [shootDate, setShootDate] =
    useState(content.shootDate);

  const [publishDate, setPublishDate] =
    useState(content.date);

  const [publishTime, setPublishTime] =
    useState(content.time);

  const [description, setDescription] =
    useState(content.description);

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

    const updatedContent: ContentItem = {
      ...content,
      title: title.trim(),
      platform,
      status,
      responsible,
      shootDate,
      date: publishDate,
      time: publishTime,
      description,
    };

    onSave(updatedContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              แก้ไขคอนเทนต์
            </h2>

            <p className="text-sm text-gray-500">
              แก้ไขข้อมูลของคอนเทนต์
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] space-y-4 overflow-y-auto p-6"
        >

          {/* ชื่อคอนเทนต์ */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ชื่อคอนเทนต์
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          {/* แพลตฟอร์ม */}
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
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="all">ทุกแพลตฟอร์ม</option>
            </select>
          </div>

          {/* สถานะ */}
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

          {/* ผู้รับผิดชอบ */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ผู้รับผิดชอบ
            </label>

            <select
              value={responsible}
              onChange={(e) =>
                setResponsible(
                  e.target.value as ContentItem["responsible"]
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">เลือกผู้รับผิดชอบ</option>
              <option value="ภูมิ">ภูมิ</option>
              <option value="จอม">จอม</option>
            </select>
          </div>

          {/* วันถ่ายทำ */}
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
              บันทึกการแก้ไข
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}