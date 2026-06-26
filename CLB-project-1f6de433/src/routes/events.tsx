import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, CheckSquare, Square, UserCheck } from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Sự kiện — ClubHub" },
      { name: "description", content: "Tạo sự kiện và phân chia nhân sự trực tiếp cho từng vị trí." },
    ],
  }),
  component: EventsPage,
});

const positions = [
  { role: "Trưởng ban tổ chức", assigned: "Trần Quốc Bảo", initials: "QB" },
  { role: "MC chương trình", assigned: "Lê Thị Cẩm", initials: "TC" },
  { role: "Phụ trách hậu cần", assigned: "Phạm Hoàng Dũng", initials: "HD" },
  { role: "Truyền thông sự kiện", assigned: null, initials: null },
  { role: "Đối ngoại & tài trợ", assigned: "Vũ Gia Khánh", initials: "GK" },
];

function EventsPage() {
  const featured = events[0];

  return (
    <div>
      <PageHeader
        title="Sự kiện"
        subtitle="Đăng ký tham gia hoặc được phân công — tích chọn trực tiếp thay cho vote thủ công."
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90">
            <Plus className="h-4 w-4" /> Sự kiện mới
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-md bg-orange/10 px-2 py-0.5 text-xs font-semibold text-orange">
                Đang chuẩn bị
              </span>
              <h2 className="mt-2 text-xl font-extrabold">{featured.title}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {featured.location} • {featured.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-primary">{featured.progress}%</p>
              <p className="text-xs text-muted-foreground">hoàn thành</p>
            </div>
          </div>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-orange" style={{ width: `${featured.progress}%` }} />
          </div>

          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <UserCheck className="h-4 w-4 text-primary" /> Phân công nhân sự theo vị trí
          </h3>
          <div className="space-y-2">
            {positions.map((p) => (
              <div
                key={p.role}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3",
                  p.assigned ? "border-border" : "border-dashed border-orange/50 bg-orange/5",
                )}
              >
                <div className="flex items-center gap-3">
                  {p.assigned ? (
                    <CheckSquare className="h-5 w-5 text-success" />
                  ) : (
                    <Square className="h-5 w-5 text-orange" />
                  )}
                  <span className="font-medium">{p.role}</span>
                </div>
                {p.assigned ? (
                  <div className="flex items-center gap-2">
                    <Avatar initials={p.initials!} className="h-7 w-7" />
                    <span className="text-sm font-semibold">{p.assigned}</span>
                  </div>
                ) : (
                  <button className="rounded-lg bg-orange px-3 py-1.5 text-xs font-semibold text-orange-foreground hover:bg-orange/90">
                    Đăng ký vị trí
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-bold">Tất cả sự kiện</h3>
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-snug">{e.title}</p>
                    <span className="shrink-0 text-xs font-bold text-primary">{e.progress}%</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.date}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {e.team.slice(0, 4).map((t) => (
                        <Avatar key={t} initials={t} className="h-6 w-6 ring-2 ring-card" />
                      ))}
                    </div>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-orange" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
