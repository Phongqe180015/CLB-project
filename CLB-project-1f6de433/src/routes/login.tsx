import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, getPendingClub, setPendingClub } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Club" },
      { name: "description", content: "Đăng nhập vào hệ thống quản lý câu lạc bộ Club." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email.trim());
    const pending = getPendingClub();
    if (pending) {
      setPendingClub(null);
      navigate({ to: "/apply/$clubId", params: { clubId: pending } });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange text-orange-foreground shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-sidebar-foreground">Club</p>
            <p className="text-xs text-sidebar-foreground/60">Quản lý câu lạc bộ</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight text-sidebar-foreground">
            Quản lý câu lạc bộ chuyên nghiệp, không còn trôi việc.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Tập trung tác vụ, sự kiện, thành viên và tài chính trong một nền tảng duy nhất —
            minh bạch, rõ ràng và dễ theo dõi.
          </p>
        </div>

        <div className="flex gap-8 text-sidebar-foreground/80">
          <div>
            <p className="text-2xl font-extrabold text-sidebar-foreground">120+</p>
            <p className="text-xs text-sidebar-foreground/60">Thành viên</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-sidebar-foreground">35</p>
            <p className="text-xs text-sidebar-foreground/60">Sự kiện / năm</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-sidebar-foreground">98%</p>
            <p className="text-xs text-sidebar-foreground/60">Hoàn thành đúng hạn</p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange text-orange-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-base font-extrabold tracking-tight text-foreground">Club</p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Chào mừng trở lại 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Đăng nhập để tiếp tục quản lý câu lạc bộ của bạn.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@club.edu.vn"
                  className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">Mật khẩu</label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-10 text-sm outline-none transition-colors focus:border-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-[var(--color-primary)]" />
              Ghi nhớ đăng nhập
            </label>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
            >
              Đăng nhập <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
