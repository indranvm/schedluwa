"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import Button from "@/components/Button";
import ReminderTable from "@/components/ReminderTable";
import ReminderCard from "@/components/ReminderCard";
import { ToastContainer, useToast } from "@/components/Toast";
import { useReminders } from "@/lib/hooks/useReminders";

export default function RemindersPage() {
  const { reminders, loading, error, removeReminder, toggleStatus } = useReminders();
  const { toasts, toast, removeToast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await removeReminder(id);
      toast.success("Reminder berhasil dihapus");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus reminder");
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus(id, currentStatus);
      toast.success(
        `Reminder berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Reminder</h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola semua reminder yang sudah dibuat
          </p>
        </div>
        <Link href="/reminders/create">
          <Button>
            <PlusCircle className="w-4 h-4" />
            Tambah
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Memuat reminder...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <ReminderTable
            reminders={reminders}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reminders.length === 0 ? (
              <div className="col-span-full text-center py-10 text-sm text-slate-400">
                Belum ada reminder. Klik &quot;Tambah&quot; untuk membuat yang baru.
              </div>
            ) : (
              reminders.map((r) => (
                <ReminderCard
                  key={r.id}
                  reminder={r}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
