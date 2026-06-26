import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Mail,
  Phone,
  Search,
  BadgeCheck,
  Eye,
  IdCard,
  Calendar,
  GraduationCap,
  Quote,
  Briefcase,
  Trophy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { members, departments, tasks, type Member } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Thành viên — ClubHub" },
      { name: "description", content: "Cơ sở dữ liệu nhân sự câu lạc bộ với hồ sơ chi tiết." },
    ],
  }),
  component: MembersPage,
});

function completionRate(m: Member) {
  return Math.min(98, 55 + (m.points % 45));
}

function MemberDetailDialog({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const memberTasks = member
    ? tasks.filter((t) => t.assignee === member.name)
    : [];
  const rate = member ? completionRate(member) : 0;

  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {member && (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">Hồ sơ {member.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
              {/* Left — identity */}
              <div className="space-y-4">
                <div className="flex flex-col items-center rounded-2xl border border-border bg-secondary/40 p-5 text-center">
                  <Avatar initials={member.initials} className="h-20 w-20 text-2xl" />
                  <div className="mt-3 flex items-center gap-1.5">
                    <h2 className="text-lg font-extrabold">{member.name}</h2>
                    {member.role.includes("Chủ nhiệm") && (
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <span className="mt-1.5 inline-block rounded-md bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                    {member.role}
                  </span>
                  <p className="mt-2 flex items-start gap-1.5 text-sm italic text-muted-foreground">
                    <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {member.motto}
                  </p>
                </div>

                <div className="space-y-2.5 rounded-2xl border border-border p-4 text-sm">
                  <InfoRow icon={IdCard} label="MSSV" value={member.studentId} />
                  <InfoRow icon={Calendar} label="Gia nhập" value={member.joinedAt} />
                  <InfoRow icon={GraduationCap} label="Chuyên ngành" value={member.major} />
                  <InfoRow icon={Briefcase} label="Ban" value={member.department} />
                  <InfoRow icon={Mail} label="Email" value={member.email} />
                  <InfoRow icon={Phone} label="Điện thoại" value={member.phone} />
                </div>
              </div>

              {/* Right — contributions */}
              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 text-base font-bold">Kết quả đóng góp & Hoạt động</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-primary-light p-4">
                      <p className="text-2xl font-extrabold text-primary">{member.points}</p>
                      <p className="text-xs font-medium text-muted-foreground">Điểm tích luỹ</p>
                    </div>
                    <div className="rounded-xl bg-success/10 p-4">
                      <p className="text-2xl font-extrabold text-success">{memberTasks.length}</p>
                      <p className="text-xs font-medium text-muted-foreground">Tác vụ phụ trách</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">Tỷ lệ hoàn thành công việc</span>
                      <span className="font-bold text-success">{rate}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-success transition-all"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-base font-bold">Nhật ký ghi nhận đóng góp</h3>
                  {memberTasks.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                      Chưa có công việc nào được ghi nhận.
                    </p>
                  ) : (
                    <ul className="space-y-2.5">
                      {memberTasks.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center gap-3 rounded-xl border border-border p-3"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary">
                            {t.status === "done" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <Trophy className="h-4 w-4 text-orange" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{t.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {t.event} • Hạn {t.due}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                            <Sparkles className="h-3 w-3" /> +{t.points}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}

function MembersPage() {
  const [filter, setFilter] = useState<string>("Tất cả");
  const [detail, setDetail] = useState<Member | null>(null);
  const list = filter === "Tất cả" ? members : members.filter((m) => m.department === filter);

  return (
    <div>
      <PageHeader
        title="Thành viên"
        subtitle="Cơ sở dữ liệu nhân sự sống động — lưu toàn bộ quá trình đóng góp của mỗi cá nhân."
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90">
            <Plus className="h-4 w-4" /> Thêm thành viên
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Tìm thành viên…"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Tất cả", ...departments].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                filter === d ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <Card key={m.id} className="transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-start gap-3">
              <Avatar initials={m.initials} className="h-14 w-14 text-base" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-bold">{m.name}</h3>
                  {m.role.includes("Chủ nhiệm") && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{m.studentId}</p>
                <span className="mt-1 inline-block rounded-md bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                  {m.role}
                </span>
              </div>
            </div>

            <div className="my-3 h-px bg-border" />

            <div className="space-y-1.5 text-sm">
              <p className="text-muted-foreground">
                Ban: <span className="font-medium text-foreground">{m.department}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> <span className="truncate">{m.email}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> {m.phone}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2">
              <span className="text-sm font-bold text-primary">{m.points} điểm</span>
              <button
                onClick={() => setDetail(m)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="h-3.5 w-3.5" /> Xem chi tiết
              </button>
            </div>
          </Card>
        ))}
      </div>

      <MemberDetailDialog member={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
