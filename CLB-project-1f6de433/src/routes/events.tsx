import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, Card } from "@/components/ui/page-primitives";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Sự kiện — ClubHub" },
      { name: "description", content: "Quản lý sự kiện đã được gộp vào trang Lịch hoạt động." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  useEffect(() => {
    window.location.replace("/calendar");
  }, []);

  return (
    <div>
      <PageHeader
        title="Sự kiện"
        subtitle="Đã được gộp vào Lịch hoạt động để quản lý tập trung một nơi."
        action={
          <Link
            to="/calendar"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
          >
            <ArrowRight className="h-4 w-4" /> Đi tới Lịch hoạt động
          </Link>
        }
      />

      <Card className="border-border bg-white">
        <p className="text-sm text-slate-600">
          Trang Sự kiện riêng đã được gộp vào <Link to="/calendar" className="font-semibold text-primary hover:underline">Lịch hoạt động</Link>.
        </p>
      </Card>
    </div>
  );
}
