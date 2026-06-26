import { createFileRoute } from "@tanstack/react-router";
import { Crown, Users } from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { lineage } from "@/lib/mock-data";

export const Route = createFileRoute("/lineage")({
  head: () => ({
    meta: [
      { title: "Phả hệ BCN — ClubHub" },
      { name: "description", content: "Sơ đồ phả hệ vinh danh Ban chủ nhiệm qua các nhiệm kỳ." },
    ],
  }),
  component: LineagePage,
});

function LineagePage() {
  return (
    <div>
      <PageHeader
        title="Phả hệ Ban chủ nhiệm"
        subtitle="Vinh danh các thế hệ lãnh đạo — duy trì truyền thống và nhận diện thương hiệu nội bộ."
      />

      <div className="relative">
        <div className="absolute left-6 top-0 hidden h-full w-px bg-border sm:block" />
        <div className="space-y-5">
          {lineage.map((t, i) => (
            <div key={t.term} className="relative sm:pl-16">
              <div className="absolute left-0 top-5 hidden h-12 w-12 place-items-center rounded-full border-4 border-background bg-primary text-primary-foreground sm:grid">
                <Crown className="h-5 w-5" />
              </div>
              <Card className={i === 0 ? "border-orange/40 ring-1 ring-orange/30" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold">{t.term}</h2>
                      {i === 0 && (
                        <span className="rounded-md bg-orange/10 px-2 py-0.5 text-xs font-semibold text-orange">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.highlight}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr]">
                  <div className="flex items-center gap-3 rounded-xl bg-primary-light px-4 py-3">
                    <Avatar initials={t.initials} className="h-12 w-12 bg-primary text-base text-primary-foreground" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary/70">Chủ nhiệm</p>
                      <p className="font-bold text-primary">{t.president}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border px-4 py-3">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Phó chủ nhiệm
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.vicePresidents.map((v) => (
                        <span key={v} className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
