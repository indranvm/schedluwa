"use client";

import {
  Wifi,
  WifiOff,
  QrCode,
  RefreshCw,
  Power,
  Loader2,
  Plug,
  Smartphone,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Button from "./Button";
import type { WhatsAppStatus } from "@/lib/types";

interface WhatsAppStatusCardProps {
  status: WhatsAppStatus;
  qrCode?: string | null;
  device?: string;
  platform?: string;
  connectedAt?: string;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onRefreshQR?: () => void;
}

const statusConfig = {
  connected: {
    Icon: Wifi,
    label: "Terhubung",
    description: "WhatsApp aktif dan siap mengirim pesan otomatis",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
    dotAnimate: false,
  },
  disconnected: {
    Icon: WifiOff,
    label: "Terputus",
    description: "WhatsApp tidak terhubung. Klik Hubungkan untuk scan QR.",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    dotColor: "bg-red-500",
    dotAnimate: false,
  },
  waiting: {
    Icon: QrCode,
    label: "Menunggu Scan QR",
    description: "Buka WhatsApp di HP → Menu → Perangkat Tertaut → Tautkan Perangkat",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-500",
    dotAnimate: true,
  },
};

function formatConnectedAt(isoStr?: string): string {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WhatsAppStatusCard({
  status,
  qrCode,
  device,
  platform,
  connectedAt,
  isConnecting = false,
  isDisconnecting = false,
  onConnect,
  onDisconnect,
  onRefreshQR,
}: WhatsAppStatusCardProps) {
  const cfg = statusConfig[status];
  const StatusIcon = cfg.Icon;

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`rounded-2xl border ${cfg.borderColor} ${cfg.bgColor} p-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} border ${cfg.borderColor} flex items-center justify-center`}>
            <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${cfg.dotColor} ${
                  cfg.dotAnimate ? "animate-pulse" : ""
                }`}
              />
              <h3 className={`text-sm font-semibold ${cfg.color}`}>
                {cfg.label}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{cfg.description}</p>
          </div>

          {/* Action Buttons */}
          {status === "disconnected" && (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              size="sm"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plug className="w-4 h-4" />
              )}
              {isConnecting ? "Menghubungkan..." : "Hubungkan"}
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Panel — tampil saat waiting */}
      {status === "waiting" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">QR Code</h3>
            <button
              onClick={onRefreshQR}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          <div className="flex flex-col items-center">
            {qrCode ? (
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-60 h-60 rounded-lg"
                />
              </div>
            ) : (
              <div className="w-60 h-60 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-spin" />
                  <p className="text-xs text-slate-500">Membuat QR code...</p>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-1.5 text-center">
              <p className="text-xs font-medium text-slate-700">Cara scan QR:</p>
              {[
                "Buka WhatsApp di HP",
                "Ketuk ⋮ Menu → Perangkat Tertaut",
                "Ketuk Tautkan Perangkat",
                "Arahkan kamera ke QR code ini",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Device Info — tampil saat connected */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Informasi Device</h3>
          {status === "connected" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>

        <div className="space-y-3">
          {[
            {
              icon: Smartphone,
              label: "Device",
              value: device || "—",
            },
            {
              icon: Wifi,
              label: "Platform",
              value: platform || "—",
            },
            {
              icon: Clock,
              label: "Terhubung Sejak",
              value: formatConnectedAt(connectedAt),
            },
          ].map(({ icon: Icon, label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-2 ${
                i < arr.length - 1 ? "border-b border-slate-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
              <span className="text-xs font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disconnect Button */}
      {status === "connected" && (
        <div className="flex justify-end">
          <Button
            onClick={onDisconnect}
            disabled={isDisconnecting}
            variant="danger"
            size="md"
          >
            {isDisconnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {isDisconnecting ? "Memutus..." : "Putuskan WhatsApp"}
          </Button>
        </div>
      )}
    </div>
  );
}
