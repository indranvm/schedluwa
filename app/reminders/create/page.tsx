"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReminderForm from "@/components/ReminderForm";
import { ToastContainer, useToast } from "@/components/Toast";
import { createReminder } from "@/app/services/reminderService";
import type { ReminderFormData } from "@/lib/types";

export default function CreateReminderPage() {
  const router = useRouter();
  const { toasts, toast, removeToast } = useToast();

  const handleSaveReminder = async (data: ReminderFormData) => {
    try {
      await createReminder(data);
      toast.success("Reminder berhasil disimpan!");
      setTimeout(() => {
        router.push("/reminders");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan reminder");
    }
  };

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
        <h2 className="text-xl font-bold text-slate-800">Tambah Reminder</h2>
        <p className="text-sm text-slate-500 mt-1">
          Buat reminder baru untuk dikirim otomatis via WhatsApp
        </p>
      </div>

      <ReminderForm onSubmit={handleSaveReminder} />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
