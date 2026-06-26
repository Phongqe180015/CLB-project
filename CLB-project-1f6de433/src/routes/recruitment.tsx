import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  X,
  Clock,
  Users2,
  Mail,
  CalendarClock,
  IdCard,
  Briefcase,
  Phone,
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Applicant } from "@/lib/mock-data";
import { useApplicants, updateApplicantStatus } from "@/lib/applicants-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recruitment")({
  head: () => ({
    meta: [
      { title: "Tuyển dụng — ClubHub" },
      {
        name: "description",
        content: "Cổng tuyển dụng tích hợp: duyệt, từ chối và thông báo email ứng viên.",
      },
    ],
  }),
  component: RecruitmentPage,
});

const statusMeta: Record<Applicant["status"], { label: string; chip: string }> = {
  pending: { label: "Chờ duyệt", chip: "bg-warning/15 text-warning-foreground" },
  interview: { label: "Phỏng vấn", chip: "bg-info/10 text-info" },
  approved: { label: "Đã nhận", chip: "bg-success/10 text-success" },
  rejected: { label: "Từ chối", chip: "bg-destructive/10 text-destructive" },
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className="truncate font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

function ApplicantSheet({
  applicant,
  onClose,
}: {
  applicant: Applicant | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!applicant} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-7xl overflow-y-auto border-border bg-white text-slate-900 sm:rounded-2xl">
        {applicant && (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">Hồ sơ {applicant.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 pb-2 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-center">
                  <Avatar initials={applicant.initials} className="mx-auto h-20 w-20 text-2xl" />
                  <div className="mt-3">
                    <h2 className="text-xl font-extrabold">{applicant.name}</h2>
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-semibold",
                        statusMeta[applicant.status].chip,
                      )}
                    >
                      {statusMeta[applicant.status].label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {applicant.motivation}
                  </p>
                </div>

                <div className="space-y-2.5 rounded-2xl border border-border p-4">
                  <DetailRow icon={IdCard} label="MSSV" value={applicant.studentId} />
                  <DetailRow icon={Briefcase} label="Ban ứng tuyển" value={applicant.department} />
                  <DetailRow
                    icon={Users2}
                    label="Trạng thái"
                    value={statusMeta[applicant.status].label}
                  />
                  {applicant.club && (
                    <DetailRow icon={Users2} label="Câu lạc bộ" value={applicant.club} />
                  )}
                  <DetailRow icon={GraduationCap} label="Chuyên ngành" value={applicant.major} />
                  <DetailRow icon={Calendar} label="Khóa" value={applicant.course} />
                  <DetailRow icon={Mail} label="Email" value={applicant.email} />
                  <DetailRow icon={Phone} label="Điện thoại" value={applicant.phone} />
                  <DetailRow icon={Calendar} label="Ngày nộp" value={applicant.appliedAt} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                    <MessageSquare className="h-4 w-4 text-primary" /> Câu giới thiệu bản thân
                  </h3>
                  <p className="rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-foreground/80">
                    "{applicant.motivation}"
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                    <FileText className="h-4 w-4 text-primary" /> File đính kèm
                  </h3>
                  <button className="flex w-full items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:bg-muted">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        CV_{applicant.name.split(" ").slice(-1)[0]}.pdf
                      </p>
                      <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                    </div>
                  </button>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                    <MessageSquare className="h-4 w-4 text-primary" /> Câu trả lời tuyển dụng chi
                    tiết
                  </h3>
                  {applicant.answers && applicant.answers.length > 0 ? (
                    <div className="space-y-3">
                      {applicant.answers.map((item, index) => (
                        <div key={item.question} className="rounded-2xl border border-border p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Câu hỏi {index + 1}
                          </p>
                          <p className="mt-1 font-semibold text-foreground">{item.question}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                      Chưa có câu trả lời chi tiết.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                    <CalendarClock className="h-4 w-4 text-primary" /> Lịch sử đánh giá / Phỏng vấn
                  </h3>
                  <ul className="space-y-2.5">
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium">Sàng lọc hồ sơ</p>
                        <p className="text-xs text-muted-foreground">
                          Hồ sơ hợp lệ • {applicant.appliedAt}
                        </p>
                      </div>
                    </li>
                    {applicant.status !== "pending" && (
                      <li className="flex gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-info" />
                        <div>
                          <p className="text-sm font-medium">Vòng phỏng vấn</p>
                          <p className="text-xs text-muted-foreground">
                            Ban chủ nhiệm đánh giá tích cực
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <h3 className="mb-3 text-sm font-bold">Cập nhật trạng thái</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateApplicantStatus(applicant.id, "interview")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-info/10 px-3 py-2 text-sm font-semibold text-info transition-colors hover:bg-info/20"
                    >
                      <CalendarClock className="h-4 w-4" /> Phỏng vấn
                    </button>
                    <button
                      onClick={() => updateApplicantStatus(applicant.id, "approved")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-success-foreground transition-colors hover:bg-success/90"
                    >
                      <Check className="h-4 w-4" /> Phê duyệt
                    </button>
                    <button
                      onClick={() => updateApplicantStatus(applicant.id, "rejected")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
                    >
                      <X className="h-4 w-4" /> Từ chối
                    </button>
                    <button
                      onClick={() => updateApplicantStatus(applicant.id, "pending")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Clock className="h-4 w-4" /> Chờ duyệt
                    </button>
                  </div>
                  <button className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                    <Mail className="h-4 w-4" /> Gửi email kết quả
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RecruitmentPage() {
  const applicants = useApplicants();
  const [tab, setTab] = useState<"all" | Applicant["status"]>("all");
  const [selected, setSelected] = useState<Applicant | null>(null);
  const list = tab === "all" ? applicants : applicants.filter((a) => a.status === tab);

  // keep the open drawer in sync with live store updates
  const selectedLive = selected ? (applicants.find((a) => a.id === selected.id) ?? null) : null;

  const counts = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    approved: applicants.filter((a) => a.status === "approved").length,
  };

  return (
    <div>
      <PageHeader
        title="Tuyển dụng"
        subtitle="Cổng đăng ký trực tiếp thay cho Google Forms — duyệt và thông báo ngay trên hệ thống."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Tổng đơn",
            value: counts.total,
            icon: Users2,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Chờ duyệt",
            value: counts.pending,
            icon: Clock,
            tone: "bg-warning/15 text-warning-foreground",
          },
          {
            label: "Đang phỏng vấn",
            value: counts.interview,
            icon: CalendarClock,
            tone: "bg-info/10 text-info",
          },
          {
            label: "Đã nhận",
            value: counts.approved,
            icon: Check,
            tone: "bg-success/10 text-success",
          },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-3">
            <span className={cn("grid h-11 w-11 place-items-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "Tất cả"],
            ["pending", "Chờ duyệt"],
            ["interview", "Phỏng vấn"],
            ["approved", "Đã nhận"],
            ["rejected", "Từ chối"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((a) => (
          <Card
            key={a.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(a)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(a);
              }
            }}
            className="cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-start gap-3">
              <Avatar initials={a.initials} className="h-12 w-12" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{a.name}</h3>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-semibold",
                      statusMeta[a.status].chip,
                    )}
                  >
                    {statusMeta[a.status].label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {a.studentId} • Ứng tuyển {a.department}
                </p>
                <p className="mt-2 rounded-lg bg-secondary p-2.5 text-sm text-foreground/80">
                  "{a.motivation}"
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Nộp ngày {a.appliedAt}</span>
              {a.status === "pending" || a.status === "interview" ? (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateApplicantStatus(a.id, "rejected");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/5"
                  >
                    <X className="h-4 w-4" /> Từ chối
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateApplicantStatus(a.id, "approved");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-success-foreground hover:bg-success/90"
                  >
                    <Check className="h-4 w-4" /> Phê duyệt
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4" /> Gửi email kết quả
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-primary-light/50">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Thông báo email tự động</p>
            <p className="text-sm text-muted-foreground">
              Có thể đặt lịch gửi trễ để đảm bảo tính tế nhị sau buổi phỏng vấn.
            </p>
          </div>
        </div>
        <button className="rounded-lg border border-primary/30 bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-card/80">
          Cấu hình mẫu email
        </button>
      </Card>

      <ApplicantSheet applicant={selectedLive} onClose={() => setSelected(null)} />
    </div>
  );
}
