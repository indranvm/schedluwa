/**
 * Next.js umentation Hook
 * Dijalankan SEKALI saat server pertama kali start.
 * Digunakan untuk init scheduler.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/umentation
 */
export async function register() {
  // Hanya jalankan di runtime Node.js (bukan Edge runtime)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  console.log("[umentation] Server starting — initializing services...");

  // Cek konfigurasi WA API
  const waApiUrl = process.env.WA_API_URL;
  const waApiToken = process.env.WA_API_TOKEN;

  if (waApiUrl && waApiToken) {
    console.log("[umentation] WA API configured ✓");
  } else {
    console.warn(
      "[umentation] WA_API_URL atau WA_API_TOKEN belum diset. Pengiriman pesan tidak akan berfungsi."
    );
  }

  try {
    // Start reminder scheduler (jika Firebase Admin configured)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      const { startScheduler } = await import("@/lib/scheduler");
      startScheduler();
      console.log("[umentation] Scheduler started.");
    } else {
      console.warn(
        "[umentation] Firebase Admin env vars belum diset. Scheduler tidak aktif.\n" +
        "Tambahkan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY ke .env.local"
      );
    }
  } catch (err: any) {
    console.error("[umentation] Scheduler start error:", err.message);
  }
}
