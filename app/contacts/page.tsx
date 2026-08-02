"use client";

import { useState,useEffect } from "react";
import { PlusCircle, Search, Phone, Users, BookUser } from "lucide-react";
import ContactCard from "@/components/ContactCard";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/Button";
import type { Contact, ContactType } from "@/lib/types";
import { createContact, getContacts, updateContact, deleteContact } from "../services/contacsService";
import { ToastContainer, useToast } from "@/components/Toast";
import { AlertTriangle, Loader2 } from "lucide-react";

type TabType = "number" | "group";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("number");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toasts, toast, removeToast } = useToast();


  const filtered = contacts.filter(
    (c) =>
      c.type === activeTab &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.identifier.toLowerCase().includes(search.toLowerCase()))
  );

  const numberCount = contacts.filter((c) => c.type === "number").length;
  const groupCount = contacts.filter((c) => c.type === "group").length;

  const fetchContacts  = async () => {
    try {
      const result = await getContacts();

      console.log("contacts:", result);

      setContacts(result || []);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal mengambil kontak");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);


  const handleSave = async (data: Omit<Contact, "id" | "createdAt">) => {
    const {name,identifier,type,description} = data;
    if (editContact) {
     
 

      try {
         const result = await updateContact(editContact.id,{
            name: name,
            identifier:identifier,
            type:type,
            description:description
          })

          setShowForm(false);
          setEditContact(null);
          
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editContact.id ? { ...c, ...data } : c
        )
      );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await createContact({
        name: name,
        identifier: identifier,
        type : type,
        description:description

      })
      
      setContacts((prev) => [
        ...prev,
        result as Contact,
      ]);

      setShowForm(false);
      setEditContact(null);
        
      } catch (error:any) {
        console.log(error);
      }
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditContact(contact);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteContact(deleteConfirmId);
      setContacts((prev) => prev.filter((c) => c.id !== deleteConfirmId));
      toast.success("Kontak berhasil dihapus");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menghapus kontak");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAddNew = () => {
    setEditContact(null);
    setShowForm(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Kontak & Grup</h2>
            <p className="text-sm text-slate-500 mt-1">
              Simpan nomor WhatsApp dan ID grup untuk digunakan di reminder
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="w-4 h-4" />
            Tambah
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{numberCount}</p>
              <p className="text-xs text-slate-500">Nomor Tersimpan</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{groupCount}</p>
              <p className="text-xs text-slate-500">Grup Tersimpan</p>
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {/* Tab header */}
          <div className="flex border-b border-slate-100">
            {(["number", "group"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "number" ? (
                  <Phone className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                {tab === "number" ? "Kontak Nomor" : "Grup WhatsApp"}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab === "number" ? numberCount : groupCount}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === "number"
                    ? "Cari nama atau nomor..."
                    : "Cari nama atau Group ID..."
                }
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="p-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <BookUser className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  {search
                    ? "Kontak tidak ditemukan"
                    : activeTab === "number"
                    ? "Belum ada kontak tersimpan"
                    : "Belum ada grup tersimpan"}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {search
                    ? "Coba kata kunci lain"
                    : "Klik tombol Tambah untuk menambahkan kontak baru"}
                </p>
                {!search && (
                  <Button size="sm" onClick={handleAddNew}>
                    <PlusCircle className="w-3.5 h-3.5" />
                    Tambah Sekarang
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
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
        <ContactForm
          editData={editContact}
          defaultType={activeTab as ContactType}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditContact(null);
          }}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Hapus Kontak?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Kontak ini akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
