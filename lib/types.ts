
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}


export interface LoginResult {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface AuthContextType {
  user: import("firebase/auth").User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export type ContactType = "number" | "group";

export interface Contact {
  id: string;
  name: string;
  identifier: string;
  type: ContactType;
  description?: string;
  createdAt: string;
}

export type ScheduleType = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface Reminder {
  id: string; // Firestore document ID (string)
  title: string;
  message: string;
  targetType: ContactType;
  /** Nomor WA atau Group ID */
  target: string;
  targetName: string;
  scheduleType: ScheduleType;
  time: string;
  date: string | null;
  days: string[] | null;
  monthDay: number | null;
  monthName: string | null;
  status: boolean;
  lastSent: string | null;
  createdAt: string;
}

export interface ReminderFormData {
  title: string;
  message: string;
  variables?: Record<string, string>;
  targetType: ContactType;
  target: string;
  targetName?: string;
  scheduleType: ScheduleType;
  time: string;
  date?: string;
  days?: string[];
  monthDay?: string | number;
  monthName?: string;
  status: boolean;
}

export type WhatsAppStatus =
  | "connected"
  | "disconnected"
  | "waiting";

export interface WhatsAppSession {
  id: string;
  status: WhatsAppStatus;
  device?: string;
  platform?: string;
  connectedAt?: string;
}


export type TemplateCategory =
  | "umum"
  | "keuangan"
  | "meeting"
  | "operasional"
  | "marketing"
  | "hr";

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: TemplateCategory;
  variables: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalReminders: number;
  activeReminders: number;
  todayReminders: number;
  sentMessages: number;
}
