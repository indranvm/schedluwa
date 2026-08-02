"use client";

import { useState } from "react";
import { PlusCircle, Search, FileText, TrendingUp } from "lucide-react";
import TemplateCard from "@/components/TemplateCard";
import TemplateForm from "@/components/TemplateForm";
import Button from "@/components/Button";
import { dummyTemplates, templateCategoryLabels } from "@/lib/dummy-data";
import type { MessageTemplate, TemplateCategory } from "@/lib/types";

const ALL = "all";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>(dummyTemplates);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | typeof ALL>(ALL);
  const [showForm, setShowForm] = useState(false);
  const [editTemplate, setEditTemplate] = useState<MessageTemplate | null>(null);

  // Stats
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const topTemplate = [...templates].sort((a, b) => b.usageCount - a.usageCount)[0];

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === ALL || t.category === activeCategory;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (
    data: Omit<MessageTemplate, "id" | "usageCount" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString().split("T")[0];
    if (editTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editTemplate.id ? { ...t, ...data, updatedAt: now } : t
        )
      );
    } else {
      const newTpl: MessageTemplate = {
        ...data,
        id: `tpl_${Date.now()}`,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      setTemplates((prev) => [newTpl, ...prev]);
    }
    setShowForm(false);
    setEditTemplate(null);
  };

  const handleEdit = (template: MessageTemplate) => {
    setEditTemplate(template);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus template ini?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditTemplate(null);
    setShowForm(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Template Pesan</h2>
            <p className="text-sm text-slate-500 mt-1">
              Kelola template pesan WhatsApp yang bisa dipakai ulang
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="w-4 h-4" />
            Buat Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{templates.length}</p>
              <p className="text-xs text-slate-500">Total Template</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{totalUsage}</p>
              <p className="text-xs text-slate-500">Total Penggunaan</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 truncate">
                {topTemplate?.title ?? "—"}
              </p>
              <p className="text-xs text-slate-500">Template Terpopuler</p>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau isi template..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveCategory(ALL)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === ALL
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({templates.length})
              </button>
              {(Object.entries(templateCategoryLabels) as [TemplateCategory, string][]).map(
                ([val, label]) => {
                  const count = templates.filter((t) => t.category === val).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={val}
                      onClick={() => setActiveCategory(val)}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeCategory === val
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="p-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  {search ? "Template tidak ditemukan" : "Belum ada template"}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {search
                    ? "Coba kata kunci lain atau ganti kategori"
                    : "Klik Buat Template untuk membuat template pertama Anda"}
                </p>
                {!search && (
                  <Button size="sm" onClick={handleAddNew}>
                    <PlusCircle className="w-3.5 h-3.5" />
                    Buat Sekarang
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TemplateForm
          editData={editTemplate}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTemplate(null);
          }}
        />
      )}
    </>
  );
}
