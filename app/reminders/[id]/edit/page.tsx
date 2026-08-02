"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReminderForm from "@/components/ReminderForm";
import { ToastContainer, useToast } from "@/components/Toast";
import { getReminder, updateReminder } from "@/app/services/reminderService";
import type { Reminder, ReminderFormData } from "@/lib/types";

export default function EditReminderPage() {
  const params = useParams();
  const router = useRouter();
  const { toasts, toast, removeToast } = useToast();

  const id = params.id as string;

  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getReminder(id);
        if (!data) {
          setNotFound(true);
        } else {
          setReminder(data);
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat reminder");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (data: ReminderFormData) => {
    try {
      await updateReminder(id, data);
      toast.success("Reminder berhasil diperbarui!");
      setTimeout(() => {
        router.push("/reminders");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui reminder");
    }
  };

  // Map Reminder ke ReminderFormData untuk pre-fill form
  const editData: ReminderFormData | undefined = reminder
    ? {
        title: reminder.title,
        message: reminder.message,
        targetType: reminder.targetType,
        target: reminder.target,
        targetName: reminder.targetName,
        scheduleType: reminder.scheduleType,
        time: reminder.time,
        date: reminder.date || "",
        days: reminder.days || [],
        monthDay: reminder.monthDay ?? "",
        monthName: reminder.monthName || "",
        status: reminder.status,
      }
    : undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/reminders"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <h2 className="text-xl font-bold text-slate-800">Edit Reminder</h2>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui detail reminder yang sudah ada
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Memuat data reminder...</p>
          </div>
        </div>
      ) : notFound ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-sm text-slate-500">Reminder tidak ditemukan.</p>
          <Link
            href="/reminders"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </div>
      ) : (
        <ReminderForm editData={editData} onSubmit={handleUpdate} />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
