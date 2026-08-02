import { NextRequest, NextResponse } from "next/server";
import { runScheduler } from "@/lib/scheduler";


export async function POST(req: NextRequest) {
  try {
    console.log("[API] Manual scheduler trigger");
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


export async function GET() {
  return NextResponse.json({
    running: !!globalThis.__schedulerIntervalId,
    message: globalThis.__schedulerIntervalId
      ? "Scheduler aktif (interval 60s)"
      : "Scheduler tidak aktif",
  });
}
