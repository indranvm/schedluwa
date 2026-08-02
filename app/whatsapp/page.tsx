"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, useToast } from "@/components/Toast";

interface WAStatusData {
  status: "connected" | "disconnected";
  apiUrl?: string;
  session?: string;
}

export default function WhatsAppPage() {
  const [waData, setWaData] = useState<WAStatusData>({ status: "disconnected" });
  const [loading, setLoading] = useState(true);
  const { toasts, toast, removeToast } = useToast();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/status", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal fetch status");
      const data: WAStatusData = await res.json();
      setWaData(data);
      return data;
    } catch (err) {
      console.error("[WA Page] fetchStatus error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Koneksi WhatsApp</h2>
        <p className="text-sm text-slate-500 mt-1">
          Status koneksi ke WhatsApp API external
        </p>
      </div>

      {/* Scheduler Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-700">Auto-Scheduler Aktif</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Reminder dicek setiap 60 detik. Pesan dikirim otomatis sesuai jadwal yang sudah dibuat.
          </p>
        </div>
      </div>

      {/* Status Card */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Memuat status...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                waData.status === "connected"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                waData.status === "connected"
                  ? "text-emerald-700"
                  : "text-red-600"
              }`}
            >
              {waData.status === "connected"
                ? "API Terhubung"
                : "API Belum Dikonfigurasi"}
            </span>
          </div>

          {waData.status === "connected" ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Session</span>
                <span className="font-mono text-slate-700">{waData.session}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">API URL</span>
                <span className="font-mono text-slate-700 text-xs truncate max-w-[250px]">
                  {waData.apiUrl}
                </span>
              </div>
              <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <p className="text-xs text-emerald-700">
                  ✓ WhatsApp API siap digunakan untuk mengirim pesan otomatis.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <p className="text-xs text-amber-700">
                  ⚠ Tambahkan variabel berikut di file <code className="bg-amber-100 px-1 rounded">.env.local</code>:
                </p>
                <pre className="mt-2 text-xs text-amber-800 bg-amber-100 rounded px-2 py-1.5 font-mono">
{`WA_API_URL=https://your-api-url.com/send
WA_API_TOKEN=your-bearer-token
WA_API_SESSION=upttik`}
                </pre>
              </div>
              <p className="text-xs text-slate-500">
                Restart server setelah menambahkan environment variables.
              </p>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => {
              setLoading(true);
              fetchStatus();
              toast.info("Status diperbarui");
            }}
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
