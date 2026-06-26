import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarDays,
  PartyPopper,
  Users,
  UserPlus,
  FolderArchive,
  GitBranch,
  Trophy,
  Wallet,
  Compass,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Tổng quan", url: "/", icon: LayoutDashboard },
  { title: "Tác vụ", url: "/tasks", icon: KanbanSquare },
  { title: "Lịch hoạt động", url: "/calendar", icon: CalendarDays },
  { title: "Sự kiện", url: "/events", icon: PartyPopper },
  { title: "Thành viên", url: "/members", icon: Users },
  { title: "Câu lạc bộ", url: "/clubs", icon: Compass },
  { title: "Tuyển dụng", url: "/recruitment", icon: UserPlus },
  { title: "Tài liệu", url: "/documents", icon: FolderArchive },
  { title: "Phả hệ BCN", url: "/lineage", icon: GitBranch },
  { title: "Bảng xếp hạng", url: "/ranking", icon: Trophy },
  { title: "Tài chính", url: "/finance", icon: Wallet },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange text-orange-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold tracking-tight text-sidebar-foreground">
            Club
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">Quản lý câu lạc bộ</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
            MA
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Minh Anh</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Ban chủ nhiệm</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm tác vụ, thành viên, sự kiện…"
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-card"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="relative grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted"
              aria-label="Thông báo"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange ring-2 ring-background" />
            </button>
            <Link
              to="/profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              aria-label="Hồ sơ cá nhân"
            >
              MA
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
