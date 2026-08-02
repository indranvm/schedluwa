"use client";

import { useState, useEffect } from "react";
import { X, Save, Phone, Users } from "lucide-react";
import Button from "./Button";
import type { Contact, ContactType } from "@/lib/types";

interface ContactFormProps {
  editData?: Contact | null;
  defaultType?: ContactType;
  onSave: (data: Omit<Contact, "id" | "createdAt">) => void;
  onClose: () => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400";

export default function ContactForm({
  editData,
  defaultType = "number",
  onSave,
  onClose,
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    type: defaultType as ContactType,
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        identifier: editData.identifier,
        type: editData.type,
        description: editData.description || "",
      });
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            {editData ? "Edit Kontak" : "Tambah Kontak"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tipe */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipe
            </label>
            <div className="flex gap-3">
              {(["number", "group"] as ContactType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: t, identifier: "" }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.type === t
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t === "number" ? (
                    <Phone className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  {t === "number" ? "Nomor WA" : "Grup WA"}
                </button>
              ))}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Kontak / Grup
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={form.type === "number" ? "Contoh: Pak Budi" : "Contoh: Grup Tim Dev"}
              required
              className={inputClass}
            />
          </div>

          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {form.type === "number" ? "Nomor WhatsApp" : "Group ID"}
            </label>
            <input
              type="text"
              value={form.identifier}
              onChange={(e) => setForm((prev) => ({ ...prev, identifier: e.target.value }))}
              placeholder={
                form.type === "number"
                  ? "628xxxxxxxxxx"
                  : "120363012345678901@g.us"
              }
              required
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-400">
              {form.type === "number"
                ? "Format internasional tanpa + (contoh: 628123456789)"
                : "Group ID dari WhatsApp (format: xxx@g.us)"}
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Keterangan <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Contoh: PIC Finance, urusan tagihan"
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              {editData ? "Simpan Perubahan" : "Tambah Kontak"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
