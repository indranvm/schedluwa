"use client";

import { dayOptions } from "@/lib/dummy-data";
import type { ScheduleType, ReminderFormData } from "@/lib/types";

interface ScheduleFieldsProps {
  scheduleType: ScheduleType;
  formData: ReminderFormData;
  onChange: (data: Partial<ReminderFormData>) => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

export default function ScheduleFields({
  scheduleType,
  formData,
  onChange,
}: ScheduleFieldsProps) {
  const handleChange = (field: keyof ReminderFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const handleDayToggle = (day: string) => {
    const currentDays = formData.days || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    onChange({ ...formData, days: updated });
  };

  const dayButton = (day: string) => (
    <button
      key={day}
      type="button"
      onClick={() => handleDayToggle(day)}
      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
        (formData.days || []).includes(day)
          ? "bg-emerald-600 text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {day}
    </button>
  );

  if (scheduleType === "once") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tanggal
          </label>
          <input
            type="date"
            value={formData.date || ""}
            onChange={(e) => handleChange("date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Jam
          </label>
          <input
            type="time"
            value={formData.time || ""}
            onChange={(e) => handleChange("time", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  if (scheduleType === "daily") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Jam Pengiriman
        </label>
        <input
          type="time"
          value={formData.time || ""}
          onChange={(e) => handleChange("time", e.target.value)}
          className={`${inputClass} max-w-xs`}
        />
      </div>
    );
  }

  if (scheduleType === "weekly" || scheduleType === "custom") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pilih Hari
          </label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map(dayButton)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Jam Pengiriman
          </label>
          <input
            type="time"
            value={formData.time || ""}
            onChange={(e) => handleChange("time", e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
        </div>
      </div>
    );
  }

  if (scheduleType === "monthly") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tanggal dalam Bulan
          </label>
          <select
            value={formData.monthDay || ""}
            onChange={(e) => handleChange("monthDay", e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih tanggal</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Jam Pengiriman
          </label>
          <input
            type="time"
            value={formData.time || ""}
            onChange={(e) => handleChange("time", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  if (scheduleType === "yearly") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tanggal
          </label>
          <select
            value={formData.monthDay || ""}
            onChange={(e) => handleChange("monthDay", e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih tanggal</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bulan
          </label>
          <select
            value={formData.monthName || ""}
            onChange={(e) => handleChange("monthName", e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih bulan</option>
            {[
              "Januari", "Februari", "Maret", "April", "Mei", "Juni",
              "Juli", "Agustus", "September", "Oktober", "November", "Desember",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Jam Pengiriman
          </label>
          <input
            type="time"
            value={formData.time || ""}
            onChange={(e) => handleChange("time", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  return null;
}
