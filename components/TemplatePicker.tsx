"use client";

import { useState } from "react";
import { X, Search, FileText, Tag } from "lucide-react";
import { dummyTemplates, templateCategoryLabels } from "@/lib/dummy-data";
import type { MessageTemplate, TemplateCategory } from "@/lib/types";

interface TemplatePickerProps {
  onSelect: (content: string) => void;
  onClose: () => void;
}

const ALL = "all";

const categoryColors: Record<string, string> = {
  umum: "bg-slate-100 text-slate-600",
  keuangan: "bg-amber-50 text-amber-700",
  meeting: "bg-blue-50 text-blue-700",
  operasional: "bg-violet-50 text-violet-700",
  marketing: "bg-pink-50 text-pink-700",
  hr: "bg-emerald-50 text-emerald-700",
};

function preview(content: string) {
  return content.split("\n").filter(Boolean).slice(0, 2).join(" ").trim();
}

export default function TemplatePicker({ onSelect, onClose }: TemplatePickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | typeof ALL>(ALL);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  const filtered = dummyTemplates.filter((t) => {
    const matchCat = activeCategory === ALL || t.category === activeCategory;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUse = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-800">Pilih Template Pesan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search + Category Filter */}
        <div className="px-5 py-3 border-b border-slate-50 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari template..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory(ALL)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === ALL
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua
            </button>
            {(Object.entries(templateCategoryLabels) as [TemplateCategory, string][]).map(
              ([val, label]) => (
                <button
                  key={val}
                  onClick={() => setActiveCategory(val)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === val
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* List + Preview split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Template list */}
          <div className="w-1/2 border-r border-slate-100 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                <FileText className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Template tidak ditemukan</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {filtered.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                        selectedTemplate?.id === t.id ? "bg-emerald-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {t.title}
                        </span>
                        <span
                          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            categoryColors[t.category] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {templateCategoryLabels[t.category]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{preview(t.content)}</p>
                      {t.variables.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Tag className="w-2.5 h-2.5 text-orange-400" />
                          <span className="text-[10px] text-orange-500 font-mono">
                            {t.variables.slice(0, 3).map((v) => `{{${v}}}`).join(", ")}
                            {t.variables.length > 3 && ` +${t.variables.length - 3}`}
                          </span>
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Preview panel */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {selectedTemplate ? (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Preview
                  </p>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                  {selectedTemplate.variables.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Variabel yang perlu diisi
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTemplate.variables.map((v) => (
                          <span
                            key={v}
                            className="px-2 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-xs font-mono"
                          >
                            {"{{"}{v}{"}}"}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Ganti variabel di atas setelah template dipilih
                      </p>
                    </div>
                  )}
                </div>
                <div className="shrink-0 px-4 py-3 border-t border-slate-100">
                  <button
                    onClick={handleUse}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Pakai Template Ini
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <FileText className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">
                  Pilih template di kiri untuk melihat preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
