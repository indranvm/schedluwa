import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { sendWhatsAppMessage } from "@/lib/whatsapp/sender";
import { shouldSendReminder, getCurrentTimeWIB } from "./checker";
import type { Reminder } from "@/lib/types";

export async function runScheduler(): Promise<{
  checked: number;
  sent: number;
  failed: number;
}> {
  const t = getCurrentTimeWIB();
  console.log(`[Scheduler] Running at ${t.timeStr} WIB (${t.dateStr})`);

  let checked = 0;
  let sent = 0;
  let failed = 0;

  try {
    const usersSnap = await adminDb.collection("users").listDocuments();

    for (const userRef of usersSnap) {
      const uid = userRef.id;
      const remindersSnap = await adminDb
        .collection("users")
        .doc(uid)
        .collection("reminders")
        .where("status", "==", true)
        .get();

      for (const reminderDoc of remindersSnap.docs) {
        const raw = reminderDoc.data();

        const reminder: Reminder = {
          id: reminderDoc.id,
          title: raw.title || "",
          message: raw.message || "",
          targetType: raw.targetType || "number",
          target: raw.target || "",
          targetName: raw.targetName || "",
          scheduleType: raw.scheduleType || "once",
          time: raw.time || "",
          date: raw.date || null,
          days: raw.days || null,
          monthDay: raw.monthDay ?? null,
          monthName: raw.monthName || null,
          status: raw.status ?? true,
          lastSent: raw.lastSent?.toDate?.()?.toISOString() ?? null,
          createdAt: raw.createdAt?.toDate?.()?.toISOString() ?? "",
        };

        checked++;

        if (!shouldSendReminder(reminder, t)) continue;

        console.log(
          `[Scheduler] → Sending "${reminder.title}" to ${reminder.target} (uid: ${uid})`
        );

        const messageToSend = raw.previewMessage || reminder.message;

        const result = await sendWhatsAppMessage(
          reminder.target,
          reminder.targetType,
          messageToSend
        );

        const reminderRef = adminDb
          .collection("users")
          .doc(uid)
          .collection("reminders")
          .doc(reminderDoc.id);

        const logRef = adminDb
          .collection("users")
          .doc(uid)
          .collection("reminder_logs");

        if (result.success) {
          sent++;
          console.log(`[Scheduler] ✓ Sent "${reminder.title}" (msgId: ${result.messageId})`);

          const updateData: Record<string, any> = {
            lastSent: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          };

          if (reminder.scheduleType === "once") {
            updateData.status = false;
            console.log(`[Scheduler] Reminder "${reminder.title}" dinonaktifkan (once)`);
          }

          await reminderRef.update(updateData);

          await logRef.add({
            reminderId: reminderDoc.id,
            reminderTitle: reminder.title,
            userId: uid,
            target: reminder.target,
            targetName: reminder.targetName,
            message: messageToSend,
            status: "sent",
            messageId: result.messageId || null,
            sentAt: FieldValue.serverTimestamp(),
          });
        } else {
          failed++;
          console.error(
            `[Scheduler] ✗ Failed "${reminder.title}": ${result.error}`
          );

          await logRef.add({
            reminderId: reminderDoc.id,
            reminderTitle: reminder.title,
            userId: uid,
            target: reminder.target,
            targetName: reminder.targetName,
            message: messageToSend,
            status: "failed",
            errorMsg: result.error || "Unknown error",
            sentAt: FieldValue.serverTimestamp(),
          });
        }
      }
    }
  } catch (error: any) {
    console.error("[Scheduler] Critical error:", error.message || error);
  }

  console.log(
    `[Scheduler] Done — Checked: ${checked}, Sent: ${sent}, Failed: ${failed}`
  );

  return { checked, sent, failed };
}

export function startScheduler(): ReturnType<typeof setInterval> {
  if (globalThis.__schedulerIntervalId) {
    console.log("[Scheduler] Already running, skipping start.");
    return globalThis.__schedulerIntervalId;
  }

  console.log("[Scheduler] Starting — interval: 60s");

  setTimeout(() => {
    runScheduler().catch(console.error);
  }, 10_000);
  const intervalId = setInterval(() => {
    runScheduler().catch(console.error);
  }, 60_000);

  globalThis.__schedulerIntervalId = intervalId;
  return intervalId;
}
