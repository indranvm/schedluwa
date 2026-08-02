/**
 * Next.js Instrumentation Hook
 * Dijalankan SEKALI saat server pertama kali start.
 * Digunakan untuk init scheduler.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Hanya jalankan di runtime Node.js (bukan Edge runtime)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  console.log("[Instrumentation] Server starting — initializing services...");

  // Cek konfigurasi WA API
  const waApiUrl = process.env.WA_API_URL;
  const waApiToken = process.env.WA_API_TOKEN;

  if (waApiUrl && waApiToken) {
    console.log("[Instrumentation] WA API configured ✓");
  } else {
    console.warn(
      "[Instrumentation] WA_API_URL atau WA_API_TOKEN belum diset. Pengiriman pesan tidak akan berfungsi."
    );
  }

  // Di Vercel (serverless), function ini dibekukan setelah request selesai —
  // setInterval tidak bisa hidup terus. Scheduler di sana WAJIB dipicu dari luar
  // (cron eksternal) yang memanggil /api/scheduler/run, bukan dari sini.
  if (process.env.VERCEL) {
    console.log(
      "[Instrumentation] Terdeteksi environment Vercel — internal setInterval scheduler dilewati.\n" +
        "Pastikan cron eksternal (cron-job.org / GitHub Actions / Vercel Cron) memanggil /api/scheduler/run secara berkala."
    );
    return;
  }

  try {
    // Start reminder scheduler (jika Firebase Admin configured)
    // Hanya relevan untuk self-hosted / VPS / `next start` long-running process.
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      const { startScheduler } = await import("@/lib/scheduler");
      startScheduler();
      console.log("[Instrumentation] Scheduler started.");
    } else {
      console.warn(
        "[Instrumentation] Firebase Admin env vars belum diset. Scheduler tidak aktif.\n" +
          "Tambahkan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY ke .env.local"
      );
    }
  } catch (err: any) {
    console.error("[Instrumentation] Scheduler start error:", err.message);
  }
}
