"use client";

import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className=" flex items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className=" text-lg font-semibold text-slate-800 hidden">
            WhatsApp Reminder
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-700">
                {initial}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-xs text-slate-400">
                {user?.email || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
