"use client";

import { useState, useEffect } from "react";
import { X, Save, Lightbulb, AlertCircle } from "lucide-react";
import Button from "./Button";
import { templateCategoryLabels } from "@/lib/dummy-data";
import type { MessageTemplate, TemplateCategory } from "@/lib/types";

interface TemplateFormProps {
  editData?: MessageTemplate | null;
  onSave: (data: Omit<MessageTemplate, "id" | "usageCount" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

const categories = Object.entries(templateCategoryLabels) as [TemplateCategory, string][];

/** Ekstrak variabel dari konten: {{variable}} */
function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g) ?? [];
  const unique = [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))];
  return unique;
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400";

export default function TemplateForm({ editData, onSave, onClose }: TemplateFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("umum");
  const detectedVars = extractVariables(content);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setContent(editData.content);
      setCategory(editData.category);
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      variables: detectedVars,
    });
  };

  const insertVariable = (varName: string) => {
    setContent((prev) => prev + `{{${varName}}}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-800">
            {editData ? "Edit Template" : "Buat Template Baru"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Judul Template
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Undangan Meeting Mingguan"
                required
                className={inputClass}
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCategory(val)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      category === val
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Isi Pesan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Isi Pesan
                </label>
                <span className="text-xs text-slate-400">
                  {content.length} karakter
                </span>
              </div>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Tulis pesan template di sini...\n\nGunakan {{variabel}} untuk bagian yang bisa diisi saat pakai template."}
                required
                className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
              />
            </div>

            {/* Hint variabel */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-700 space-y-1">
                  <p className="font-semibold">Tips Variabel</p>
                  <p>
                    Gunakan <code className="font-mono bg-amber-100 px-1 rounded">{"{{nama_variabel}}"}</code> untuk bagian yang berbeda setiap kirim.
                    Contoh: <code className="font-mono bg-amber-100 px-1 rounded">{"{{nama}}"}</code>, <code className="font-mono bg-amber-100 px-1 rounded">{"{{tanggal}}"}</code>
                  </p>
                  <p className="text-[10px] opacity-70">Contoh cepat:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {["nama", "tanggal", "jam", "nominal", "lokasi"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded font-mono text-[10px] transition-colors"
                      >
                        + {"{{"}{v}{"}}"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detected variables */}
            {detectedVars.length > 0 && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-600">
                    Variabel Terdeteksi ({detectedVars.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectedVars.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[10px] font-mono font-medium"
                    >
                      {"{{"}{v}{"}}"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              {editData ? "Simpan Perubahan" : "Buat Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
