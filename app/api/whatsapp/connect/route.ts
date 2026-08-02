import { NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp/session";

export async function POST() {
  try {
    const status = getWhatsAppStatus();

    if (status.status === "connected") {
      return NextResponse.json({
        success: true,
        message: "WhatsApp API sudah terkonfigurasi.",
        status,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "WA_API_URL dan WA_API_TOKEN belum diset di environment variables (.env.local).",
      },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}