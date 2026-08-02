"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  CalendarCheck,
  Send,
  ArrowRight,
  User,
  Users,
  Clock,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import BadgeStatus from "@/components/BadgeStatus";
import { useReminders } from "@/lib/hooks/useReminders";
import { getSentMessagesCount } from "@/app/services/reminderService";
import { scheduleTypeLabels } from "@/lib/dummy-data";

export default function DashboardPage() {
  const { reminders, loading: loadingReminders } = useReminders();
  const [sentMessages, setSentMessages] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const count = await getSentMessagesCount();
        setSentMessages(count);
      } catch (err) {
        console.error("Failed to fetch sent messages count:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const loading = loadingReminders || loadingStats;

  // Hitung stats dari data real
  const totalReminders = reminders.length;
  const activeReminders = reminders.filter((r) => r.status).length;
  
  // Perkiraan reminder hari ini (kasar: yang daily atau yg due date hari ini)
  const today = new Date();
  const dayNameId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][today.getDay()];
  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const todayReminders = reminders.filter((r) => {
    if (!r.status) return false;
    if (r.scheduleType === "daily") return true;
    if (r.scheduleType === "once" && r.date === dateStr) return true;
    if (r.scheduleType === "weekly" && r.days?.includes(dayNameId)) return true;
    if (r.scheduleType === "monthly" && r.monthDay === today.getDate()) return true;
    if (r.scheduleType === "yearly" && r.monthDay === today.getDate()) return true; // simplified
    if (r.scheduleType === "custom" && r.days?.includes(dayNameId)) return true;
    return false;
  }).length;

  // 5 reminder terbaru berdasarkan waktu dibuat (asumsi ID terurut/kita sort desc)
  const recentReminders = [...reminders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-slate-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pantau dan kelola semua reminder WhatsApp kamu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Bell}
          label="Total Reminder"
          value={totalReminders}
          color="emerald"
        />
        <StatCard
          icon={BellRing}
          label="Reminder Aktif"
          value={activeReminders}
          color="blue"
        />
        <StatCard
          icon={CalendarCheck}
          label="Reminder Hari Ini"
          value={todayReminders}
          color="amber"
        />
        <StatCard
          icon={Send}
          label="Pesan Terkirim"
          value={sentMessages}
          color="violet"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Reminder Terbaru
          </h3>
          <Link
            href="/reminders"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {recentReminders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">Belum ada reminder.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentReminders.map((r) => (
              <div
                key={r.id}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      r.targetType === "group" ? "bg-blue-50" : "bg-emerald-50"
                    }`}
                  >
                    {r.targetType === "group" ? (
                      <Users className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {r.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">
                        {scheduleTypeLabels[r.scheduleType] || r.scheduleType}
                      </span>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{r.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <BadgeStatus active={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
