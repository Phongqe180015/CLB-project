import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Eye,
  GraduationCap,
  Plus,
  Mail,
  Phone,
  Search,
  IdCard,
  Quote,
  Trophy,
  Sparkles,
  Users2,
} from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { members, tasks, type Member } from "@/lib/mock-data";
import { clubs, type Club } from "@/lib/clubs-data";
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

const joinedClubIds = ["cl8", "cl5", "cl3"];

const clubMemberships: Record<string, string[]> = {
  cl1: ["1", "2", "4", "6"],
  cl2: ["3", "5", "7", "8"],
  cl3: ["1", "4", "6", "8"],
  cl4: ["2", "3", "5", "7"],
  cl5: ["1", "2", "7"],
  cl6: ["3", "4", "5"],
  cl7: ["2", "4", "6", "8"],
  cl8: ["1", "5", "6", "8"],
};

function getClubMembers(clubId: string) {
  return (clubMemberships[clubId] ?? [])
    .map((id) => members.find((member) => member.id === id))
    .filter((member): member is Member => Boolean(member));
}

function getMemberClubs(memberId: string) {
  return clubs.filter((club) => clubMemberships[club.id]?.includes(memberId));
}

function MemberDetailDialog({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const memberTasks = member ? tasks.filter((t) => t.assignee === member.name) : [];
  const rate = member ? completionRate(member) : 0;
  const memberClubs = member ? getMemberClubs(member.id) : [];

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

                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="mb-2 font-semibold text-foreground">Câu lạc bộ đã tham gia</p>
                  {memberClubs.length === 0 ? (
                    <p className="text-muted-foreground">Chưa ghi nhận câu lạc bộ nào.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {memberClubs.map((club) => (
                        <span
                          key={club.id}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                            club.tone,
                          )}
                        >
                          <span>{club.emoji}</span> {club.name}
                        </span>
                      ))}
                    </div>
                  )}
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
  const [selectedClubId, setSelectedClubId] = useState(joinedClubIds[0]);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Member | null>(null);

  const joinedClubs = useMemo(() => clubs.filter((club) => joinedClubIds.includes(club.id)), []);

  const selectedClub = joinedClubs.find((club) => club.id === selectedClubId) ?? joinedClubs[0];
  const selectedClubMembers = useMemo(() => {
    if (!selectedClub) return [];
    const q = search.trim().toLowerCase();
    return getClubMembers(selectedClub.id).filter((member) => {
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q)
      );
    });
  }, [search, selectedClub]);

  return (
    <div>
      <PageHeader
        title="Câu lạc bộ của bạn"
        subtitle="Chọn một câu lạc bộ bạn đã tham gia trước, rồi xem danh sách thành viên bên trong."
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90">
            <Plus className="h-4 w-4" /> Thêm thành viên
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {joinedClubs.map((club) => (
          <Card
            key={club.id}
            className={cn(
              "transition-all hover:shadow-[var(--shadow-card-hover)]",
              selectedClubId === club.id && "border-primary/30 ring-2 ring-primary/15",
            )}
          >
            <button
              type="button"
              onClick={() => setSelectedClubId(club.id)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={cn(
                  "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl",
                  club.tone,
                )}
              >
                {club.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-bold">{club.name}</h3>
                  {selectedClubId === club.id && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{club.category}</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                  <Users2 className="h-3.5 w-3.5" /> {club.members} thành viên
                </span>
              </div>
            </button>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="min-w-0 text-sm text-muted-foreground">
                <span className="block truncate">{club.fullName}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClubId(club.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Xem thành viên <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Đang xem</p>
              <h2 className="text-xl font-extrabold">
                {selectedClub?.name ?? "Chọn một câu lạc bộ"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedClub?.description ?? "Chọn một CLB ở trên để xem danh sách thành viên."}
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm thành viên trong CLB…"
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring"
              />
            </div>
          </div>

          <div className="my-4 h-px bg-border" />

          {selectedClubMembers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy thành viên trong câu lạc bộ này.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {selectedClubMembers.map((m) => {
                const memberClubs = getMemberClubs(m.id);

                return (
                  <Card
                    key={m.id}
                    className="transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar initials={m.initials} className="h-14 w-14 text-base" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate font-bold">{m.name}</h3>
                          {m.role.includes("Chủ nhiệm") && (
                            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                          )}
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
                      <p className="text-muted-foreground">
                        CLB tham gia:{" "}
                        <span className="font-medium text-foreground">{memberClubs.length}</span>
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2">
                      <span className="text-sm font-bold text-primary">{m.points} điểm</span>
                      <button
                        type="button"
                        onClick={() => setDetail(m)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" /> Xem chi tiết
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <MemberDetailDialog member={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
