"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Users, Clock, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import BadgeStatus from "./BadgeStatus";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { scheduleTypeLabels } from "@/lib/dummy-data";
import type { Reminder } from "@/lib/types";

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentStatus: boolean) => Promise<void>;
}

export default function ReminderCard({ reminder, onDelete, onToggle }: ReminderCardProps) {
  const router = useRouter();
  const r = reminder;
  const scheduleLabel = scheduleTypeLabels[r.scheduleType] || r.scheduleType;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleEditClick = () => {
    router.push(`/reminders/${r.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(r.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(r.id, r.status);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{r.title}</h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.message}</p>
          </div>
          <BadgeStatus active={r.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            {r.targetType === "number" ? (
              <User className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Users className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="truncate">{r.targetName || r.target}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {scheduleLabel} — {r.time}
            </span>
          </div>
          {r.days && r.days.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {r.days.map((day) => (
                <span
                  key={day}
                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium"
                >
                  {day}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-100">
          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-50"
            title={r.status ? "Nonaktifkan" : "Aktifkan"}
          >
            {isToggling ? (
              <span className="w-4 h-4 block border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : r.status ? (
              <ToggleRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>

          {/* Edit */}
          <button
            onClick={handleEditClick}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title={`Hapus "${r.title}"?`}
        description="Reminder ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
