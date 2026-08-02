
import type { Reminder } from "@/lib/types";

const DAY_NAMES_ID = [
  "Minggu", // 0
  "Senin",  // 1
  "Selasa", // 2
  "Rabu",   // 3
  "Kamis",  // 4
  "Jumat",  // 5
  "Sabtu",  // 6
];

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export interface CurrentTime {
  hour: number;
  minute: number;
  dayIndex: number;   // 0=Minggu, 6=Sabtu
  date: number;       // 1-31
  monthIndex: number; // 0-indexed
  year: number;
  timeStr: string;    // "HH:MM"
  dayName: string;    // "Senin", "Selasa", dst
  monthName: string;  // "Januari", dst
  dateStr: string;    // "YYYY-MM-DD"
}


export function getCurrentTimeWIB(): CurrentTime {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const hour = wib.getUTCHours();
  const minute = wib.getUTCMinutes();
  const dayIndex = wib.getUTCDay();
  const date = wib.getUTCDate();
  const monthIndex = wib.getUTCMonth();
  const year = wib.getUTCFullYear();

  return {
    hour,
    minute,
    dayIndex,
    date,
    monthIndex,
    year,
    timeStr: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    dayName: DAY_NAMES_ID[dayIndex],
    monthName: MONTH_NAMES_ID[monthIndex],
    dateStr: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
  };
}

function wasRecentlySent(lastSent: string | null, withinMinutes = 2): boolean {
  if (!lastSent) return false;
  const diff = Date.now() - new Date(lastSent).getTime();
  return diff < withinMinutes * 60 * 1000;
}

function timeStrToMinutes(timeStr: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Cek apakah waktu sekarang "cukup dekat" dengan waktu target reminder.
 *
 * Scheduler hanya jalan tiap 60 detik (lihat lib/scheduler/index.ts), jadi
 * kalau pakai exact string match ("HH:MM" === "HH:MM"), ada risiko jendela
 * 1 menit itu terlewat kalau tick scheduler jatuh sedikit setelah menit
 * target berganti. Di sini kita toleransi menit target atau 1 menit
 * sebelumnya (menit yang baru saja lewat), dan dedupe tetap dijaga lewat
 * wasRecentlySent() supaya tidak terkirim dobel.
 */
function isWithinSendWindow(nowTimeStr: string, targetTimeStr: string): boolean {
  const nowMin = timeStrToMinutes(nowTimeStr);
  const targetMin = timeStrToMinutes(targetTimeStr);
  if (nowMin === null || targetMin === null) return false;

  const diff = (nowMin - targetMin + 1440) % 1440;
  return diff === 0 || diff === 1;
}

export function shouldSendReminder(
  reminder: Reminder,
  now?: CurrentTime
): boolean {
  if (!reminder.status) return false;

  if (wasRecentlySent(reminder.lastSent, 2)) return false;

  const t = now ?? getCurrentTimeWIB();

  if (!isWithinSendWindow(t.timeStr, reminder.time)) return false;

  switch (reminder.scheduleType) {
    case "daily":
      return true;

    case "once":
      if (!reminder.date) return false;
      return reminder.date === t.dateStr;

    case "weekly":
      if (!reminder.days || reminder.days.length === 0) return false;
      return reminder.days.includes(t.dayName);

    case "monthly":
      if (!reminder.monthDay) return false;
      return reminder.monthDay === t.date;

    case "yearly":
      if (!reminder.monthDay || !reminder.monthName) return false;
      return (
        reminder.monthDay === t.date &&
        reminder.monthName === t.monthName
      );

    case "custom":
      if (!reminder.days || reminder.days.length === 0) return false;
      return reminder.days.includes(t.dayName);

    default:
      return false;
  }
}
