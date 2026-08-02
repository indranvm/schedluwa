"use client";

import { FileText, Pencil, Trash2, TrendingUp, Tag } from "lucide-react";
import type { MessageTemplate } from "@/lib/types";
import { templateCategoryLabels } from "@/lib/dummy-data";

interface TemplateCardProps {
  template: MessageTemplate;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (id: string) => void;
  onUse?: (template: MessageTemplate) => void;
}

const categoryColors: Record<string, string> = {
  umum: "bg-slate-100 text-slate-600",
  keuangan: "bg-amber-50 text-amber-700",
  meeting: "bg-blue-50 text-blue-700",
  operasional: "bg-violet-50 text-violet-700",
  marketing: "bg-pink-50 text-pink-700",
  hr: "bg-emerald-50 text-emerald-700",
};

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onUse,
}: TemplateCardProps) {
  const categoryLabel =
    templateCategoryLabels[template.category] ?? template.category;
  const colorClass = categoryColors[template.category] ?? categoryColors.umum;

  /** Preview 2 baris pertama konten */
  const preview = template.content.split("\n").slice(0, 2).join(" ").trim();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-all group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 truncate">
            {template.title}
          </h4>
        </div>
        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Preview */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {preview}
      </p>

      {/* Variables */}
      {template.variables.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.variables.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[10px] font-mono font-medium"
            >
              <Tag className="w-2.5 h-2.5" />
              {"{{"}{v}{"}}"}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <TrendingUp className="w-3 h-3" />
          <span>Dipakai {template.usageCount}x</span>
        </div>
        <div className="flex items-center gap-1">
          {onUse && (
            <button
              onClick={() => onUse(template)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
              title="Gunakan template ini"
            >
              Pakai
            </button>
          )}
          <button
            onClick={() => onEdit(template)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
