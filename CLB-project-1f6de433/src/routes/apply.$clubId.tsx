import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { clubs } from "@/lib/clubs-data";
import { addApplicant } from "@/lib/applicants-store";
import { useAuth, getPendingClub, setPendingClub } from "@/lib/auth-store";

export const Route = createFileRoute("/apply/$clubId")({
  head: () => ({
    meta: [
      { title: "Đăng ký gia nhập — ClubHub" },
      { name: "description", content: "Hoàn tất đơn đăng ký gia nhập câu lạc bộ." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { clubId } = Route.useParams();
  const navigate = useNavigate();
  const user = useAuth();
  const club = clubs.find((c) => c.id === clubId);

  const [course, setCourse] = useState("");
  const [major, setMajor] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");

  // Guests must log in first; remember the club they wanted to join.
  useEffect(() => {
    if (!user) {
      setPendingClub(clubId);
      navigate({ to: "/login" });
    }
  }, [user, clubId, navigate]);

  // Pre-fill editable fields from the saved profile.
  useEffect(() => {
    if (user) {
      setCourse((v) => v || user.course);
      setMajor((v) => v || user.major);
      setPhone((v) => v || user.phone);
    }
  }, [user]);

  if (!user) return null;

  if (!club) {
    return (
      <div className="-mx-4 -my-6 flex min-h-[60vh] items-center justify-center sm:-mx-6 lg:-mx-8">
        <div className="text-center">
          <p className="text-lg font-semibold">Không tìm thấy câu lạc bộ.</p>
          <Link
            to="/clubs"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            ← Về danh sách câu lạc bộ
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation.trim()) {
      toast.error("Vui lòng nhập lý do muốn gia nhập.");
      return;
    }

    addApplicant({
      name: user.name,
      studentId: user.studentId || "—",
      department: club.name,
      club: club.fullName,
      motivation: motivation.trim(),
      course: course.trim(),
      major: major.trim(),
      phone: phone.trim(),
      email: user.email,
    });

    setPendingClub(null);
    toast.success("Đã nộp đơn đăng ký!", {
      description: "Đơn của bạn đã được gửi tới Ban chủ nhiệm và đang chờ duyệt.",
    });
    navigate({ to: "/clubs" });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/clubs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Danh sách câu lạc bộ
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${club.tone}`}
          >
            {club.emoji}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight">Đơn Đăng Ký Gia Nhập</h1>
            <p className="truncate text-sm text-muted-foreground">{club.fullName}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>
            Thông tin cá nhân được tự động điền từ tài khoản của bạn. Bạn chỉ cần viết lý do muốn
            gia nhập rồi gửi đơn.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Họ và Tên" value={user.name} />
            <ReadOnlyField label="Mã Số Sinh Viên" value={user.studentId || "—"} />
            <ReadOnlyField label="Email Sinh Viên" value={user.email} />
            <Field label="Số Điện Thoại">
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
              />
            </Field>
            <Field label="Khóa">
              <TextInput
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="K2024"
              />
            </Field>
            <Field label="Chuyên Ngành">
              <TextInput
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="CNTT"
              />
            </Field>
          </div>

          <Field label="Lý Do Muốn Gia Nhập" required>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={5}
              placeholder="Chia sẻ lý do và mong muốn của bạn khi tham gia câu lạc bộ…"
              className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </Field>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange text-base font-bold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
          >
            <Send className="h-4 w-4" /> Nộp Đơn Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Field label={label}>
      <input
        value={value}
        readOnly
        className="h-10 w-full cursor-not-allowed truncate rounded-lg border border-border bg-secondary px-3 text-sm font-semibold text-foreground"
      />
    </Field>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
    />
  );
}
