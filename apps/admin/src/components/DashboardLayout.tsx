"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/prompts", label: "Prompt Settings", icon: Settings },
  { href: "/homepage", label: "Homepage", icon: Home },
  { href: "/suggested-questions", label: "Suggested Questions", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-slate-200">
        <div className="border-b border-slate-800 px-5 py-6">
          <p className="text-lg font-semibold text-white">Portfolio CMS</p>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                pathname === href
                  ? "bg-sidebar-hover text-white"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-sidebar-hover hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
