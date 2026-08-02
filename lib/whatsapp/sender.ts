export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Kirim pesan WhatsApp via external API
 * API menerima body: { session, to, message }
 * dengan header Authorization: Bearer <token>
 */
export async function sendWhatsAppMessage(
  target: string,
  targetType: "number" | "group",
  message: string
): Promise<SendResult> {
  const apiUrl = process.env.WA_API_URL;
  const apiToken = process.env.WA_API_TOKEN;
  const session = process.env.WA_API_SESSION || "upttik";

  if (!apiUrl || !apiToken) {
    return {
      success: false,
      error: "WA_API_URL atau WA_API_TOKEN belum diset di environment variables.",
    };
  }

  // Bersihkan target: nomor HP dibersihkan dari karakter non-digit,
  // tapi group ID (format "xxxxxxxxxx-xxxxxxxxxx@g.us") HARUS dibiarkan
  // apa adanya karena mengandung "-" dan "@g.us" yang wajib ada.
  const cleaned = targetType === "group" ? target.trim() : target.replace(/\D/g, "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        session,
        to: cleaned,
        message,
      }),
      signal: controller.signal,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      // Respons bukan JSON valid — biarkan data kosong, tetap pakai res.status di bawah
    }

    if (res.ok) {
      return {
        success: true,
        messageId: data.messageId || data.id || undefined,
      };
    }

    console.error(
      `[WA Sender] API responded ${res.status}:`,
      data.message || data.error || JSON.stringify(data)
    );

    return {
      success: false,
      error: data.message || data.error || `API error: ${res.status}`,
    };
  } catch (err: any) {
    const isTimeout = err.name === "AbortError";
    console.error(
      "[WA Sender] Request failed:",
      isTimeout ? "Timeout setelah 15s" : err.message
    );
    return {
      success: false,
      error: isTimeout ? "Timeout: WA API tidak merespons dalam 15 detik" : (err.message || "Gagal mengirim pesan via API"),
    };
  } finally {
    clearTimeout(timeout);
  }
}
