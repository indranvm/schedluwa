import { NextRequest, NextResponse } from "next/server";
import { runScheduler } from "@/lib/scheduler";

/**
 * Cek header Authorization: Bearer <CRON_SECRET>
 * Wajib supaya endpoint ini tidak bisa dipicu sembarang orang dari internet.
 * Set CRON_SECRET di Environment Variables Vercel (dan .env lokal untuk testing).
 */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Kalau CRON_SECRET belum diset sama sekali, endpoint ditutup total
    // demi keamanan (daripada terbuka tanpa proteksi).
    return false;
  }
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function handleRun(req: NextRequest) {
  if (!isAuthorized(req)) {
    console.warn("[API] Scheduler trigger ditolak: unauthorized");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    console.log("[API] Scheduler trigger (cron)");
    const result = await runScheduler();

    return NextResponse.json({
      success: true,
      message: `Scheduler selesai: ${result.sent} terkirim, ${result.failed} gagal dari ${result.checked} reminder.`,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET dipakai oleh cron eksternal (cron-job.org, dll umumnya default GET)
export async function GET(req: NextRequest) {
  return handleRun(req);
}

// POST tetap tersedia kalau mau trigger manual (mis. dari Postman / curl)
export async function POST(req: NextRequest) {
  return handleRun(req);
}
