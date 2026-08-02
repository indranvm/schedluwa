"use client";

import { Phone, Users, Pencil, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Contact } from "@/lib/types";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contact.identifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGroup = contact.type === "group";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all group">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isGroup ? "bg-blue-50" : "bg-emerald-50"
          }`}
        >
          {isGroup ? (
            <Users className="w-5 h-5 text-blue-600" />
          ) : (
            <Phone className="w-5 h-5 text-emerald-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-800 truncate">
              {contact.name}
            </h4>
            <span
              className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isGroup
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isGroup ? "Grup" : "Nomor"}
            </span>
          </div>

          {contact.description && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {contact.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-2">
            <code className="text-xs text-slate-500 font-mono truncate flex-1">
              {contact.identifier}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="Salin identifier"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-1">
            Ditambahkan {contact.createdAt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-slate-50">
        <button
          onClick={() => onEdit(contact)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
