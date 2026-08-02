import { NextResponse } from "next/server";

export async function GET() {
  // QR code tidak diperlukan lagi — menggunakan external API
  return NextResponse.json({ qr: null });
}
