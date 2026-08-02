"use client";

import { ReactNode } from "react";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoginPage from "@/components/LoginPage";

function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-[3px] border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Memuat...</p>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AppLoading />;
  if (!user) return <LoginPage />;

  return <>{children}</>;
}

function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
          <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-100 mt-auto">
            <p className="text-center text-xs text-slate-400">
              Dibuat oleh Codein Community Team
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthGate>
    </AuthProvider>
  );
}
