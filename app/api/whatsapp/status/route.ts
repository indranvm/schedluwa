import { NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp/session";

export async function GET() {
  try {
    const status = getWhatsAppStatus();
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
