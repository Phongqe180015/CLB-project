import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Circle } from "lucide-react";
import { PageHeader, Card } from "@/components/ui/page-primitives";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Lịch hoạt động — ClubHub" },
      { name: "description", content: "Lịch tập trung các mốc thời gian, lịch đăng bài và deadline." },
    ],
  }),
  component: CalendarPage,
});

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
// June 2025 starts on Sunday -> offset so Monday-first grid
const firstOffset = 6; // 1 June 2025 is Sunday => 6 blanks before
const daysInMonth = 30;

const typeStyles: Record<string, { dot: string; chip: string; label: string }> = {
  event: { dot: "bg-primary", chip: "bg-primary-light text-primary", label: "Sự kiện" },
  post: { dot: "bg-info", chip: "bg-info/10 text-info", label: "Đăng bài" },
  deadline: { dot: "bg-orange", chip: "bg-orange/10 text-orange", label: "Deadline" },
};

function CalendarPage() {
  const cells = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const today = 21;

  return (
    <div>
      <PageHeader
        title="Lịch hoạt động"
        subtitle="Toàn bộ mốc thời gian, lịch đăng bài và deadline ở một nơi."
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90">
            <Plus className="h-4 w-4" /> Thêm lịch
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Tháng 6, 2025</h2>
            <div className="flex items-center gap-1">
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((d) => (
              <div key={d} className="pb-2 text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const dayEvents = day ? events.filter((e) => e.day === day) : [];
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[84px] rounded-lg border border-transparent p-1.5 text-left",
                    day && "border-border bg-card hover:border-primary/40",
                    day === today && "ring-2 ring-primary",
                  )}
                >
                  {day && (
                    <>
                      <span
                        className={cn(
                          "inline-grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                          day === today ? "bg-primary text-primary-foreground" : "text-foreground",
                        )}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((e) => (
                          <div
                            key={e.id}
                            className={cn("truncate rounded px-1.5 py-0.5 text-[11px] font-medium", typeStyles[e.type].chip)}
                          >
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-bold">Chú thích</h3>
            <div className="space-y-2">
              {Object.values(typeStyles).map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-sm">
                  <span className={cn("h-2.5 w-2.5 rounded-full", t.dot)} />
                  {t.label}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-bold">Sắp diễn ra</h3>
            <div className="space-y-3">
              {[...events]
                .sort((a, b) => a.day - b.day)
                .map((e) => (
                  <div key={e.id} className="flex gap-3">
                    <Circle className={cn("mt-1 h-2.5 w-2.5 shrink-0 fill-current", typeStyles[e.type].chip.split(" ")[1])} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.date} • {e.location}</p>
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
