"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getReminders,
  deleteReminder,
  toggleReminderStatus,
} from "@/app/services/reminderService";
import type { Reminder } from "@/lib/types";

export interface UseRemindersReturn {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  toggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
}

export function useReminders(): UseRemindersReturn {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat reminder");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeReminder = useCallback(async (id: string) => {
    await deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleStatus = useCallback(
    async (id: string, currentStatus: boolean) => {
      await toggleReminderStatus(id, currentStatus);
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: !currentStatus } : r))
      );
    },
    []
  );

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { reminders, loading, error, fetchReminders, removeReminder, toggleStatus };
}
