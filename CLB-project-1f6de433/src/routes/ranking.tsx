import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { members } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Bảng xếp hạng — ClubHub" },
      { name: "description", content: "Bảng xếp hạng MVP tự động dựa trên điểm tích lũy của thành viên." },
    ],
  }),
  component: RankingPage,
});

const podiumStyles = [
  { icon: Trophy, ring: "ring-orange", badge: "bg-orange text-orange-foreground", order: "sm:order-2", h: "sm:pt-0" },
  { icon: Medal, ring: "ring-muted-foreground/40", badge: "bg-muted-foreground text-background", order: "sm:order-1", h: "sm:pt-8" },
  { icon: Award, ring: "ring-orange/40", badge: "bg-orange/30 text-orange", order: "sm:order-3", h: "sm:pt-8" },
];

function RankingPage() {
  const ranked = [...members].sort((a, b) => b.points - a.points);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div>
      <PageHeader
        title="Bảng xếp hạng & Vinh danh"
        subtitle="Điểm chấm tự động theo việc hoàn thành đúng hạn và mức độ tham gia sự kiện."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
        {top3.map((m, i) => {
          const s = podiumStyles[i];
          return (
            <div key={m.id} className={cn("flex flex-col items-center", s.order, s.h)}>
              <Card className={cn("flex w-full flex-col items-center text-center ring-2", s.ring)}>
                <span className={cn("mb-2 grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold", s.badge)}>
                  {i + 1}
                </span>
                <Avatar initials={m.initials} className={cn("h-16 w-16 text-lg", i === 0 && "h-20 w-20 text-xl")} />
                <h3 className="mt-3 font-bold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.department}</p>
                <div className="mt-3 flex items-center gap-1 rounded-lg bg-primary-light px-3 py-1.5">
                  <Star className="h-4 w-4 fill-current text-orange" />
                  <span className="text-lg font-extrabold text-primary">{m.points}</span>
                  <span className="text-xs text-muted-foreground">điểm</span>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-bold">Toàn bộ bảng xếp hạng</h2>
          <span className="rounded-md bg-orange/10 px-2 py-1 text-xs font-semibold text-orange">Kỳ 2024-2025</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Thành viên</th>
                <th className="px-5 py-3 font-semibold">Ban</th>
                <th className="px-5 py-3 text-right font-semibold">Điểm</th>
                <th className="px-5 py-3 text-right font-semibold">Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((m, idx) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-3">
                    <span className={cn("font-bold", idx < 3 ? "text-orange" : "text-muted-foreground")}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.initials} className="h-8 w-8" />
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{m.department}</td>
                  <td className="px-5 py-3 text-right font-bold text-primary">{m.points}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <TrendingUp className="h-3.5 w-3.5" /> +{Math.max(2, 30 - idx * 3)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
