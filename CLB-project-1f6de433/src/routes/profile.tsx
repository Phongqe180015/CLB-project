import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  IdCard,
  Calendar,
  Briefcase,
  Award,
  Pencil,
  Camera,
  Check,
  X,
  LogOut,
  BadgeCheck,
  Trophy,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { PageHeader, Card } from "@/components/ui/page-primitives";
import { members } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Hồ sơ cá nhân — Club" },
      { name: "description", content: "Thông tin chi tiết hồ sơ thành viên câu lạc bộ." },
    ],
  }),
  component: ProfilePage,
});

const me = members[0];

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: me.name,
    studentId: me.studentId,
    department: me.department,
    role: me.role,
    email: me.email,
    phone: me.phone,
  });
  const [draft, setDraft] = useState(form);

  const startEdit = () => {
    setDraft(form);
    setEditing(true);
  };
  const save = () => {
    setForm(draft);
    setEditing(false);
  };

  return (
    <div>
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản và theo dõi đóng góp của bạn trong câu lạc bộ."
        action={
          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={startEdit}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
              >
                <Pencil className="h-4 w-4" /> Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" /> Hủy
                </button>
                <button
                  onClick={save}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" /> Lưu thay đổi
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — identity card */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-light text-2xl font-extrabold text-primary">
                  {me.initials}
                </div>
                {editing && (
                  <button
                    className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-orange text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
                    aria-label="Đổi ảnh đại diện"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold text-foreground">{form.name}</h2>
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <span className="mt-1.5 inline-block rounded-md bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                {form.role}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">{form.department}</p>
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-extrabold text-primary">{me.points}</p>
                <p className="text-xs text-muted-foreground">Điểm</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-success">12</p>
                <p className="text-xs text-muted-foreground">Sự kiện</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-orange">48</p>
                <p className="text-xs text-muted-foreground">Tác vụ</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-bold text-foreground">Trạng thái quỹ</h3>
            <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2.5">
              <span className="text-sm font-medium text-foreground">Quỹ kỳ này</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" /> Đã đóng
              </span>
            </div>
            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Đăng xuất
            </Link>
          </Card>
        </div>

        {/* Right — details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-base font-bold text-foreground">Thông tin chi tiết</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                icon={IdCard}
                label="Mã số sinh viên"
                value={form.studentId}
                editing={editing}
                onChange={(v) => setDraft((d) => ({ ...d, studentId: v }))}
                draftValue={draft.studentId}
              />
              <Field
                icon={Briefcase}
                label="Ban chuyên môn"
                value={form.department}
                editing={editing}
                onChange={(v) => setDraft((d) => ({ ...d, department: v }))}
                draftValue={draft.department}
              />
              <Field
                icon={Award}
                label="Chức vụ"
                value={form.role}
                editing={editing}
                onChange={(v) => setDraft((d) => ({ ...d, role: v }))}
                draftValue={draft.role}
              />
              <Field
                icon={Calendar}
                label="Ngày gia nhập"
                value={me.joinedAt}
                editing={false}
                onChange={() => {}}
                draftValue={me.joinedAt}
              />
              <Field
                icon={Mail}
                label="Email"
                value={form.email}
                editing={editing}
                onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                draftValue={draft.email}
                type="email"
              />
              <Field
                icon={Phone}
                label="Số điện thoại"
                value={form.phone}
                editing={editing}
                onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                draftValue={draft.phone}
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-base font-bold text-foreground">Hoạt động gần đây</h3>
            <ul className="space-y-3">
              {[
                { icon: Trophy, color: "text-success", text: "Đạt Top MVP kỳ này", time: "2 ngày trước" },
                { icon: CheckCircle2, color: "text-primary", text: "Hoàn thành tác vụ \"Lên kịch bản Year End Party\"", time: "4 ngày trước" },
                { icon: CalendarDays, color: "text-orange", text: "Tham gia sự kiện Workshop Kỹ năng", time: "1 tuần trước" },
              ].map((a, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card">
                    <a.icon className={`h-4 w-4 ${a.color}`} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{a.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  editing,
  draftValue,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  editing: boolean;
  draftValue: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={draftValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring"
        />
      ) : (
        <p className="rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  );
}
