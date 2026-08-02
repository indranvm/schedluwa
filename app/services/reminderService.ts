import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { ReminderFormData, Reminder } from "@/lib/types";

export type { ReminderFormData as ReminderPayload };

function extractVariables(content: string): string[] {
  const matches = content.matchAll(/{{\s*(.*?)\s*}}/g);
  return [
    ...new Set(
      [...matches].map((m) => m[1].trim())
    ),
  ];
}

function renderTemplate(
  content: string,
  variables: Record<string, string>
): string {
  return content.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
    return variables[key.trim()] || "";
  });
}

function mapDocToReminder(id: string, data: any): Reminder {
  return {
    id,
    title: data.title || "",
    message: data.message || "",
    targetType: data.targetType || "number",
    target: data.target || "",
    targetName: data.targetName || "",
    scheduleType: data.scheduleType || "once",
    time: data.time || "",
    date: data.date || null,
    days: data.days || null,
    monthDay: data.monthDay ?? null,
    monthName: data.monthName || null,
    status: data.status ?? true,
    lastSent: data.lastSent || null,
    createdAt: data.createdAt?.toDate
      ? data.createdAt.toDate().toISOString()
      : data.createdAt || new Date().toISOString(),
  };
}

export async function createReminder(data: ReminderFormData) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");

  const detectedVariables = extractVariables(data.message);
  const variables: Record<string, string> = {};
  detectedVariables.forEach((key) => {
    variables[key] = data.variables?.[key] || "";
  });

  const previewMessage = renderTemplate(data.message, variables);

  const docRef = await addDoc(
    collection(db, "users", uid, "reminders"),
    {
      title: data.title,
      message: data.message,
      variables,
      previewMessage,
      targetType: data.targetType,
      target: data.target,
      targetName: data.targetName || "",
      scheduleType: data.scheduleType,
      time: data.time,
      date: data.date || null,
      days: data.days || [],
      monthDay: data.monthDay ? Number(data.monthDay) : null,
      monthName: data.monthName || null,
      status: data.status,
      lastSent: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return { id: docRef.id, ...data };
}

export async function getReminders(): Promise<Reminder[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");

  const snap = await getDocs(
    collection(db, "users", uid, "reminders")
  );

  return snap.docs.map((item) => mapDocToReminder(item.id, item.data()));
}

export async function getReminder(id: string): Promise<Reminder | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");
  if (!id) throw new Error("ID reminder tidak ada");

  const snap = await getDoc(doc(db, "users", uid, "reminders", id));
  if (!snap.exists()) return null;

  return mapDocToReminder(snap.id, snap.data());
}

export async function updateReminder(
  id: string,
  data: Partial<ReminderFormData>
) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");
  if (!id) throw new Error("ID reminder tidak ada");

  let payload: any = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.message) {
    const detectedVariables = extractVariables(data.message);
    const variables: Record<string, string> = {};
    detectedVariables.forEach((key) => {
      variables[key] = data.variables?.[key] || "";
    });
    payload.variables = variables;
    payload.previewMessage = renderTemplate(data.message, variables);
  }

  if (data.monthDay) {
    payload.monthDay = Number(data.monthDay);
  }

  await updateDoc(
    doc(db, "users", uid, "reminders", id),
    payload
  );

  return { id, ...payload };
}

export async function deleteReminder(id: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");
  if (!id) throw new Error("ID reminder tidak ada");

  await deleteDoc(doc(db, "users", uid, "reminders", id));
  return true;
}

export async function toggleReminderStatus(id: string, currentStatus: boolean) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User belum login");

  await updateDoc(
    doc(db, "users", uid, "reminders", id),
    {
      status: !currentStatus,
      updatedAt: serverTimestamp(),
    }
  );

  return { id, status: !currentStatus };
}

export function parseReminderMessage(
  message: string,
  variables: Record<string, string>
) {
  return renderTemplate(message, variables);
}

export async function getSentMessagesCount(): Promise<number> {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  
  try {
    const { getCountFromServer, query, where, collection } = await import("firebase/firestore");
    const q = query(
      collection(db, "users", uid, "reminder_logs"),
      where("status", "==", "sent")
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (err) {
    // Kueri gagal jika aturan Firestore (Security Rules) belum mengizinkan read pada subkoleksi reminder_logs
    return 0;
  }
}