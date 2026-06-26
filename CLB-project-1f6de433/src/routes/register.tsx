import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, User, Mail, Lock, Eye, EyeOff, IdCard, ArrowRight } from "lucide-react";
import { departments } from "@/lib/mock-data";
import { register, getPendingClub, setPendingClub } from "@/lib/auth-store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Đăng ký — Club" },
      { name: "description", content: "Tạo tài khoản thành viên trên hệ thống quản lý câu lạc bộ Club." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: name.trim(),
      studentId: studentId.trim(),
      department,
      email: email.trim(),
      course: "",
      major: "",
      phone: "",
    });
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
            Tham gia cộng đồng câu lạc bộ năng động.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Tạo hồ sơ thành viên, nhận tác vụ, tích điểm đóng góp và theo dõi hành trình của bạn
            trong câu lạc bộ.
          </p>
        </div>

        <ul className="relative z-10 space-y-3 text-sm text-sidebar-foreground/80">
          <li className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-orange/20 text-orange">✓</span>
            Quản lý tác vụ và deadline rõ ràng
          </li>
          <li className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-orange/20 text-orange">✓</span>
            Bảng xếp hạng và vinh danh thành viên
          </li>
          <li className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-orange/20 text-orange">✓</span>
            Lưu trữ tài liệu và phả hệ ban chủ nhiệm
          </li>
        </ul>

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

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Tạo tài khoản</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Điền thông tin để trở thành thành viên của câu lạc bộ.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Họ và tên</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Mã số SV</label>
                <div className="relative">
                  <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="SV2024xxx"
                    className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Ban</label>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-ring"
                >
                  <option value="" disabled>
                    Chọn ban
                  </option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
              <label className="mb-1.5 block text-sm font-medium text-foreground">Mật khẩu</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Tối thiểu 8 ký tự"
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

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--color-primary)]" />
              <span>
                Tôi đồng ý với{" "}
                <span className="font-medium text-primary">điều khoản</span> và{" "}
                <span className="font-medium text-primary">chính sách</span> của câu lạc bộ.
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
            >
              Đăng ký <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
