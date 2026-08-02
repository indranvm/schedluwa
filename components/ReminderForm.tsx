"use client";

import { useState ,useEffect } from "react";
import { Save, RotateCcw, ChevronDown, LayoutTemplate } from "lucide-react";
import Button from "./Button";
import ScheduleFields from "./ScheduleFields";
import TemplatePicker from "./TemplatePicker";
import { dummyContacts } from "@/lib/dummy-data";
import type { ReminderFormData, ScheduleType, ContactType, Contact } from "@/lib/types";
import {getContacts} from "@/app/services/contacsService";

const scheduleOptions: { value: ScheduleType; label: string }[] = [
  { value: "once", label: "Sekali Kirim" },
  { value: "daily", label: "Harian" },
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
  { value: "custom", label: "Custom Hari" },
];

const initialState: ReminderFormData = {
  title: "",
  message: "",
  targetType: "number",
  target: "",
  scheduleType: "once",
  time: "",
  date: "",
  days: [],
  monthDay: "",
  monthName: "",
  status: true,
};

interface ReminderFormProps {
  editData?: ReminderFormData;
  onSubmit?: (data: ReminderFormData) => void;
}

export default function ReminderForm({ editData, onSubmit }: ReminderFormProps) {
  const [form, setForm] = useState<ReminderFormData>(editData || initialState);
  const [useContactPicker, setUseContactPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<
    Record<string,string>
  >({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  


  const handleChange = (field: keyof ReminderFormData, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (type: ScheduleType) => {
    setForm((prev) => ({
      ...prev,
      scheduleType: type,
      time: "",
      date: "",
      days: [],
      monthDay: "",
      monthName: "",
    }));
  };

  const handleScheduleFieldsChange = (scheduleData: Partial<ReminderFormData>) => {
    setForm((prev) => ({ ...prev, ...scheduleData }));
  };

  const handleContactSelect = (contact: Contact) => {
    setForm((prev) => ({
      ...prev,
      targetType: contact.type as ContactType,
      target: contact.identifier,
    }));
  };

  function renderTemplate(
    content:string,
    values:Record<string,string>
    ){

    return content.replace(
    /{{\s*(.*?)\s*}}/g,
    (_,key)=>values[key] || ""
    );

    }

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const submitData = {
    ...form,
    variables: variableValues,
  };

  if (onSubmit) {
    onSubmit(submitData);
  } else {
    
  }
};

  const handleReset = () => {
    setForm(editData || initialState);
    setUseContactPicker(false);
    setShowTemplatePicker(false);
  };

  function extractVariables(content:string){

  const matches =
    content.matchAll(/{{\s*(.*?)\s*}}/g);

  return [
    ...new Set(
      [...matches].map(m => m[1])
    )
  ];
}

  const handleTemplateSelect = (
      content:string
    ) => {

      const vars = extractVariables(content);

      setVariables(vars);

      const initialValues:
      Record<string,string> = {};

      vars.forEach((v)=>{
        initialValues[v]="";
      });

      setVariableValues(initialValues);

      setForm((prev)=>({
        ...prev,
        message:content
      }));
    };

  // Contacts filtered by current targetType
  const filteredContacts = contacts.filter((c) => c.type === form.targetType);

  useEffect(() => {
    getContacts()
      .then(setContacts)
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Informasi Reminder ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Informasi Reminder
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Judul Reminder
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Contoh: Laporan Harian Tim"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Isi Pesan WhatsApp
            </label>
            <button
              type="button"
              onClick={() => setShowTemplatePicker(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-600 text-xs font-medium transition-colors"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              Pilih Template
            </button>
          </div>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Tulis pesan yang akan dikirim atau pilih dari template..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent  placeholder:text-slate-400"
          />
          {variables.length > 0 && (
            <div className="mt-4 space-y-4">

            <h4 className="font-medium text-sm">
            Variabel Template
            </h4>

            {variables.map((variable)=>(
            <div key={variable}>

            <label className="block text-sm mb-1">
            {variable}
            </label>

            <input
            type="text"
            value={variableValues[variable] || ""}
            placeholder={`Masukkan ${variable}`}
            onChange={(e)=>
            setVariableValues(prev=>({
            ...prev,
            [variable]:e.target.value
            }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />

            </div>
            ))}
            </div>
            )}
          {form.message && (
            <p className="mt-1 text-xs text-slate-400 text-right">
              {form.message.length} karakter
            </p>
          )}
        </div>
      </div>

      {/* ── Target Pengiriman ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Target Pengiriman
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipe Target
          </label>
          <div className="flex gap-3">
            {(["number", "group"] as ContactType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  handleChange("targetType", type);
                  handleChange("target", "");
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.targetType === type
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type === "number" ? "Nomor WhatsApp" : "Grup WhatsApp"}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle: pilih dari kontak atau input manual */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUseContactPicker(!useContactPicker)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              useContactPicker ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                useContactPicker ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-slate-600">
            Pilih dari daftar kontak tersimpan
          </span>
        </div>

        {useContactPicker ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Pilih Kontak
            </label>
            <div className="relative">
              <select
                value={form.target}
                onChange={(e) => {
                  const contact = contacts.find((c) => c.identifier === e.target.value);
                  if (contact) handleContactSelect(contact);
                }}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              >
                <option value="">-- Pilih kontak --</option>
                {filteredContacts.map((c) => (
                  <option key={c.id} value={c.identifier}>
                    {c.name} — {c.identifier}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {form.target && (
              <p className="mt-1.5 text-xs text-slate-500 font-mono">{form.target}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {form.targetType === "number" ? "Nomor WhatsApp" : "ID Grup WhatsApp"}
            </label>
            <input
              type="text"
              value={form.target}
              onChange={(e) => handleChange("target", e.target.value)}
              placeholder={
                form.targetType === "number"
                  ? "Contoh: 628xxxxxxxxxx"
                  : "Contoh: 120363012345678901@g.us"
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
            />
            {form.targetType === "number" && (
              <p className="mt-1.5 text-xs text-slate-500">
                Gunakan format internasional tanpa tanda + (contoh: 628123456789)
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Jadwal Pengiriman ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Jadwal Pengiriman
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipe Jadwal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {scheduleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleScheduleChange(opt.value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.scheduleType === opt.value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <ScheduleFields
          scheduleType={form.scheduleType}
          formData={form}
          onChange={handleScheduleFieldsChange}
        />
      </div>

      {/* ── Status ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Status Reminder
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aktifkan untuk mulai mengirim pesan sesuai jadwal
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleChange("status", !form.status)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              form.status ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.status ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4" />
          {editData ? "Update Reminder" : "Simpan Reminder"}
        </Button>
      </div>
    </form>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <TemplatePicker
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </>
  );
}
