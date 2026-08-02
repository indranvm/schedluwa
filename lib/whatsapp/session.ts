/**
 * WhatsApp API Session Helper
 *
 * Karena sekarang menggunakan external API (bukan Baileys),
 * status koneksi dicek berdasarkan apakah env variable sudah diset.
 */

export type WAStatus = "connected" | "disconnected";

export interface WASessionInfo {
  status: WAStatus;
  apiUrl: string | undefined;
  session: string | undefined;
}

/**
 * Cek apakah konfigurasi WA API sudah lengkap
 */
export function getWhatsAppStatus(): WASessionInfo {
  const apiUrl = process.env.WA_API_URL;
  const apiToken = process.env.WA_API_TOKEN;
  const session = process.env.WA_API_SESSION || "upttik";

  const isConfigured = !!(apiUrl && apiToken);

  return {
    status: isConfigured ? "connected" : "disconnected",
    apiUrl: isConfigured ? apiUrl : undefined,
    session: isConfigured ? session : undefined,
  };
}
