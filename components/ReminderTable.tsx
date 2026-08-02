"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Users, Clock, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import BadgeStatus from "./BadgeStatus";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { scheduleTypeLabels } from "@/lib/dummy-data";
import type { Reminder } from "@/lib/types";

interface ReminderTableProps {
  reminders: Reminder[];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentStatus: boolean) => Promise<void>;
}

function getScheduleLabel(reminder: Reminder): string {
  const label = scheduleTypeLabels[reminder.scheduleType] || reminder.scheduleType;
  if (reminder.scheduleType === "weekly" && reminder.days) {
    return `${label} (${reminder.days.join(", ")})`;
  }
  if (reminder.scheduleType === "monthly" && reminder.monthDay) {
    return `${label} (Tgl ${reminder.monthDay})`;
  }
  if (reminder.scheduleType === "yearly" && reminder.monthName) {
    return `${label} (${reminder.monthDay} ${reminder.monthName})`;
  }
  if (reminder.scheduleType === "custom" && reminder.days) {
    return `${label} (${reminder.days.join(", ")})`;
  }
  if (reminder.scheduleType === "once" && reminder.date) {
    return `${label} (${reminder.date})`;
  }
  return label;
}

export default function ReminderTable({ reminders, onDelete, onToggle }: ReminderTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    router.push(`/reminders/${id}/edit`);
  };

  const handleDeleteClick = (reminder: Reminder) => {
    setDeleteTarget(reminder);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget.id);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await onToggle(id, currentStatus);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reminder
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jadwal
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jam
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reminders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                    Belum ada reminder. Klik &quot;Tambah&quot; untuk membuat yang baru.
                  </td>
                </tr>
              ) : (
                reminders.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">{r.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[220px]">
                        {r.message}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {r.targetType === "number" ? (
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <div>
                          <p className="text-sm text-slate-700">{r.targetName}</p>
                          <p className="text-xs text-slate-400">
                            {r.targetType === "number" ? "Nomor" : "Grup"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">{getScheduleLabel(r)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm text-slate-700">{r.time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <BadgeStatus active={r.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggle(r.id, r.status)}
                          disabled={togglingId === r.id}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-50"
                          title={r.status ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {togglingId === r.id ? (
                            <span className="w-4 h-4 block border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : r.status ? (
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(r.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(r)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={`Hapus "${deleteTarget?.title}"?`}
        description="Reminder ini akan dihapus permanen dari Firestore. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
