import { NextResponse } from "next/server";

export async function POST() {
  // Dengan API external, tidak ada session lokal untuk diputus.
  // Endpoint ini tetap ada untuk kompatibilitas UI.
  return NextResponse.json({
    success: true,
    message: "Tidak ada session lokal — menggunakan external API.",
  });
}
