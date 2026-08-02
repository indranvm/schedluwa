import type { Reminder, DashboardStats, Contact } from "./types";

export const dummyReminders: Reminder[] = [
  {
    id: "1",
    title: "Laporan Harian Tim",
    message: "Halo tim, jangan lupa submit laporan harian sebelum jam 5 sore ya. Terima kasih!",
    targetType: "group",
    target: "120363012345678901@g.us",
    targetName: "Grup Tim Development",
    scheduleType: "daily",
    time: "16:00",
    date: null,
    days: null,
    monthDay: null,
    monthName: null,
    status: true,
    lastSent: "2026-05-21 16:00",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Meeting Mingguan",
    message: "Reminder: Meeting mingguan hari ini jam 10 pagi. Siapkan progress report masing-masing.",
    targetType: "group",
    target: "120363098765432101@g.us",
    targetName: "Grup Project Alpha",
    scheduleType: "weekly",
    time: "09:00",
    date: null,
    days: ["Senin"],
    monthDay: null,
    monthName: null,
    status: true,
    lastSent: "2026-05-19 09:00",
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    title: "Tagihan Bulanan",
    message: "Reminder pembayaran tagihan server bulan ini. Segera proses sebelum tanggal 5.",
    targetType: "number",
    target: "6281234567890",
    targetName: "Pak Budi (Finance)",
    scheduleType: "monthly",
    time: "08:00",
    date: null,
    days: null,
    monthDay: 1,
    monthName: null,
    status: true,
    lastSent: "2026-05-01 08:00",
    createdAt: "2026-01-10",
  },
  {
    id: "4",
    title: "Ulang Tahun Perusahaan",
    message: "Selamat ulang tahun perusahaan kita! Semoga semakin sukses dan berkembang.",
    targetType: "group",
    target: "120363055555555501@g.us",
    targetName: "Grup All Staff",
    scheduleType: "yearly",
    time: "07:00",
    date: "15",
    days: null,
    monthDay: null,
    monthName: "Maret",
    status: true,
    lastSent: "2026-03-15 07:00",
    createdAt: "2025-12-20",
  },
  {
    id: "5",
    title: "Follow Up Client",
    message: "Halo Pak, ini reminder untuk follow up proposal yang sudah kami kirimkan minggu lalu. Apakah ada feedback?",
    targetType: "number",
    target: "6289876543210",
    targetName: "Pak Ahmad",
    scheduleType: "once",
    time: "10:00",
    date: "2026-05-25",
    days: null,
    monthDay: null,
    monthName: null,
    status: true,
    lastSent: null,
    createdAt: "2026-05-20",
  },
  {
    id: "6",
    title: "Backup Database",
    message: "Reminder: Lakukan backup database production dan staging. Pastikan semua berjalan lancar.",
    targetType: "number",
    target: "6281111222233",
    targetName: "DevOps Team Lead",
    scheduleType: "custom",
    time: "22:00",
    date: null,
    days: ["Senin", "Rabu", "Jumat"],
    monthDay: null,
    monthName: null,
    status: false,
    lastSent: "2026-05-19 22:00",
    createdAt: "2026-03-05",
  },
  {
    id: "7",
    title: "Standup Meeting",
    message: "Daily standup 5 menit lagi. Join meeting room ya!",
    targetType: "group",
    target: "120363077777777701@g.us",
    targetName: "Grup Engineering",
    scheduleType: "custom",
    time: "09:55",
    date: null,
    days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    monthDay: null,
    monthName: null,
    status: true,
    lastSent: "2026-05-22 09:55",
    createdAt: "2026-04-01",
  },
  {
    id: "8",
    title: "Invoice Reminder",
    message: "Reminder: Invoice #INV-2026-042 sudah jatuh tempo. Mohon segera diproses.",
    targetType: "number",
    target: "6282222333344",
    targetName: "Bu Sari (Accounting)",
    scheduleType: "once",
    time: "09:00",
    date: "2026-05-22",
    days: null,
    monthDay: null,
    monthName: null,
    status: true,
    lastSent: null,
    createdAt: "2026-05-18",
  },
];

// ============================================================
// Dummy Contacts
// ============================================================
export const dummyContacts: Contact[] = [
  {
    id: "ctc_001",
    name: "Pak Budi (Finance)",
    identifier: "6281234567890",
    type: "number",
    description: "Tim Finance, PIC tagihan server",
    createdAt: "2026-01-10",
  },
  {
    id: "ctc_002",
    name: "Pak Ahmad",
    identifier: "6289876543210",
    type: "number",
    description: "Client potensial Project Alpha",
    createdAt: "2026-05-20",
  },
  {
    id: "ctc_003",
    name: "DevOps Team Lead",
    identifier: "6281111222233",
    type: "number",
    description: "PIC infrastructure & backup",
    createdAt: "2026-03-05",
  },
  {
    id: "ctc_004",
    name: "Bu Sari (Accounting)",
    identifier: "6282222333344",
    type: "number",
    description: "Tim Accounting, urusan invoice",
    createdAt: "2026-05-18",
  },
  {
    id: "grp_001",
    name: "Grup Tim Development",
    identifier: "120363012345678901@g.us",
    type: "group",
    description: "Semua anggota tim dev",
    createdAt: "2026-01-15",
  },
  {
    id: "grp_002",
    name: "Grup Project Alpha",
    identifier: "120363098765432101@g.us",
    type: "group",
    description: "Grup project Alpha stakeholders",
    createdAt: "2026-02-01",
  },
  {
    id: "grp_003",
    name: "Grup All Staff",
    identifier: "120363055555555501@g.us",
    type: "group",
    description: "Seluruh karyawan perusahaan",
    createdAt: "2025-12-20",
  },
  {
    id: "grp_004",
    name: "Grup Engineering",
    identifier: "120363077777777701@g.us",
    type: "group",
    description: "Tim engineering & developers",
    createdAt: "2026-04-01",
  },
];

// ============================================================
// Stats
// ============================================================
export const stats: DashboardStats = {
  totalReminders: dummyReminders.length,
  activeReminders: dummyReminders.filter((r) => r.status).length,
  todayReminders: dummyReminders.filter((r) => {
    if (r.scheduleType === "once" && r.date === "2026-05-22") return true;
    if (r.scheduleType === "daily") return true;
    if (r.scheduleType === "custom" && r.days?.includes("Jumat")) return true;
    return false;
  }).length,
  sentMessages: 247,
};

// ============================================================
// Label Maps
// ============================================================
export const scheduleTypeLabels: Record<string, string> = {
  once: "Sekali Kirim",
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
  custom: "Custom",
};

export const dayOptions: string[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export const monthOptions: string[] = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// ============================================================
// Template Category Labels
// ============================================================
export const templateCategoryLabels: Record<string, string> = {
  umum: "Umum",
  keuangan: "Keuangan",
  meeting: "Meeting",
  operasional: "Operasional",
  marketing: "Marketing",
  hr: "HR & SDM",
};

// ============================================================
// Dummy Message Templates
// ============================================================
import type { MessageTemplate } from "./types";

export const dummyTemplates: MessageTemplate[] = [
  {
    id: "tpl_001",
    title: "Laporan Harian",
    content:
      "Halo tim 👋\n\nJangan lupa submit *laporan harian* sebelum jam 5 sore ya.\n\nTerima kasih! 🙏",
    category: "operasional",
    variables: [],
    usageCount: 24,
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
  },
  {
    id: "tpl_002",
    title: "Undangan Meeting",
    content:
      "📅 *Reminder Meeting*\n\nHalo {{nama}},\n\nAnda memiliki jadwal meeting pada:\n• Tanggal: {{tanggal}}\n• Jam: {{jam}}\n• Lokasi: {{lokasi}}\n\nMohon hadir tepat waktu. Terima kasih!",
    category: "meeting",
    variables: ["nama", "tanggal", "jam", "lokasi"],
    usageCount: 18,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-20",
  },
  {
    id: "tpl_003",
    title: "Tagihan Jatuh Tempo",
    content:
      "⚠️ *Reminder Tagihan*\n\nYth. {{nama}},\n\nTagihan atas *{{keterangan}}* senilai *Rp {{nominal}}* akan jatuh tempo pada tanggal {{tanggal_jatuh_tempo}}.\n\nMohon segera lakukan pembayaran. Terima kasih.",
    category: "keuangan",
    variables: ["nama", "keterangan", "nominal", "tanggal_jatuh_tempo"],
    usageCount: 31,
    createdAt: "2026-02-01",
    updatedAt: "2026-05-10",
  },
  {
    id: "tpl_004",
    title: "Standup Meeting Harian",
    content:
      "🚀 *Daily Standup — {{jam}}*\n\nHai team! Standup meeting dimulai {{menit}} menit lagi.\n\nSiapkan update progress masing-masing ya! 💪",
    category: "meeting",
    variables: ["jam", "menit"],
    usageCount: 87,
    createdAt: "2026-02-10",
    updatedAt: "2026-05-22",
  },
  {
    id: "tpl_005",
    title: "Backup Sistem",
    content:
      "🔒 *Reminder Backup Sistem*\n\nWaktunya melakukan backup:\n• Database Production\n• Database Staging\n• File Storage\n\nPastikan semua berjalan lancar dan kirimkan laporan setelah selesai.",
    category: "operasional",
    variables: [],
    usageCount: 12,
    createdAt: "2026-03-01",
    updatedAt: "2026-04-15",
  },
  {
    id: "tpl_006",
    title: "Follow Up Proposal",
    content:
      "Halo {{nama}} 👋\n\nSemoga kabar baik ya!\n\nSaya ingin menindaklanjuti proposal yang telah kami kirimkan pada {{tanggal_kirim}}. Apakah sudah sempat ditinjau?\n\nKami siap berdiskusi kapan pun sesuai waktu Anda. 😊",
    category: "marketing",
    variables: ["nama", "tanggal_kirim"],
    usageCount: 9,
    createdAt: "2026-03-15",
    updatedAt: "2026-05-18",
  },
  {
    id: "tpl_007",
    title: "Selamat Ulang Tahun",
    content:
      "🎉 *Happy Birthday, {{nama}}!*\n\nSeluruh tim mengucapkan selamat ulang tahun.\n\nSemoga selalu sehat, sukses, dan bahagia! 🎂🥳",
    category: "hr",
    variables: ["nama"],
    usageCount: 5,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01",
  },
  {
    id: "tpl_008",
    title: "Pengumuman Umum",
    content:
      "📢 *Pengumuman*\n\n{{isi_pengumuman}}\n\nHarap diperhatikan dan disebarkan kepada seluruh anggota terkait.\n\nTerima kasih. 🙏",
    category: "umum",
    variables: ["isi_pengumuman"],
    usageCount: 14,
    createdAt: "2026-04-10",
    updatedAt: "2026-05-05",
  },
  {
    id: "tpl_009",
    title: "Reminder Absensi",
    content:
      "⏰ *Reminder Absensi*\n\nHai {{nama}},\n\nJangan lupa untuk melakukan absensi *{{sesi}}* hari ini sebelum jam {{batas_jam}}.\n\nTerima kasih! ✅",
    category: "hr",
    variables: ["nama", "sesi", "batas_jam"],
    usageCount: 42,
    createdAt: "2026-04-15",
    updatedAt: "2026-05-20",
  },
  {
    id: "tpl_010",
    title: "Promo & Penawaran",
    content:
      "🔥 *Penawaran Spesial untuk Anda!*\n\nHalo {{nama}},\n\n{{deskripsi_promo}}\n\n⏰ Berlaku hingga: *{{batas_waktu}}*\n\nJangan sampai terlewat! 🎁",
    category: "marketing",
    variables: ["nama", "deskripsi_promo", "batas_waktu"],
    usageCount: 7,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-15",
  },
];
