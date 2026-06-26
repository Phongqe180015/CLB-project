import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Users,
  PartyPopper,
  TrendingUp,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, PageHeader, Avatar } from "@/components/ui/page-primitives";
import { tasks, members, events, taskColumns } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — ClubHub" },
      { name: "description", content: "Bảng điều khiển tổng quan hoạt động câu lạc bộ." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Tác vụ đang chạy", value: "24", delta: "+12%", icon: Clock, tone: "bg-sky-100 text-sky-600", to: "/tasks", search: { status: "progress" } },
  { label: "Hoàn thành tuần này", value: "18", delta: "+8%", icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-600", to: "/tasks", search: { status: "done" } },
  { label: "Thành viên hoạt động", value: "86", delta: "+5", icon: Users, tone: "bg-indigo-100 text-indigo-600", to: "/members", search: undefined },
  { label: "Sự kiện sắp tới", value: "4", delta: "tháng 6", icon: PartyPopper, tone: "bg-orange-100 text-orange-600", to: "/events", search: undefined },
] as const;

const activityData = [
  { name: "T2", value: 12 },
  { name: "T3", value: 18 },
  { name: "T4", value: 15 },
  { name: "T5", value: 24 },
  { name: "T6", value: 20 },
  { name: "T7", value: 28 },
  { name: "CN", value: 14 },
];

const pieColors = ["var(--color-muted-foreground)", "var(--color-info)", "var(--color-orange)", "var(--color-success)"];

function Dashboard() {
  const user = useAuth();
  const pieData = taskColumns.map((c) => ({
    name: c.label,
    value: tasks.filter((t) => t.status === c.status).length,
  }));

  const topMembers = [...members].sort((a, b) => b.points - a.points).slice(0, 3);
  const upcoming = [...events].sort((a, b) => a.day - b.day).slice(0, 4);

  return (
    <div>
      <PageHeader
        title={user ? `Chào buổi sáng, ${user.name} 👋` : "Chào mừng đến với ClubHub"}
        subtitle={
          user
            ? "Đây là bức tranh tổng thể hoạt động câu lạc bộ hôm nay."
            : "Đăng nhập để quản lý tác vụ, lịch hoạt động và thành viên của bạn."
        }
        action={
          user ? (
            <Link
              to="/tasks"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
            >
              + Tạo tác vụ
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Đăng nhập
            </Link>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            search={s.search as never}
            className="block focus-visible:outline-none"
          >
            <Card className="flex h-full cursor-pointer flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-center justify-between">
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl", s.tone)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> {s.delta}
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Hoạt động trong tuần</h2>
              <p className="text-sm text-muted-foreground">Số tác vụ được cập nhật mỗi ngày</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    fontSize: 13,
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Phân bố tác vụ</h2>
          <p className="text-sm text-muted-foreground">Theo trạng thái hiện tại</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} />
                  {d.name}
                </span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Sự kiện sắp tới</h2>
            <Link to="/calendar" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Xem lịch <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-light">
                  <span className="text-lg font-extrabold leading-none text-primary">{e.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.location} • {e.date}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-orange" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {e.team.slice(0, 3).map((t) => (
                    <Avatar key={t} initials={t} className="h-7 w-7 ring-2 ring-card" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-success/20 bg-success/5">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-success">Top MVP kỳ này</h2>
            <Trophy className="h-5 w-5 text-success" />
          </div>
          <div className="space-y-3">
            {topMembers.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold",
                    i === 0 ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <Avatar initials={m.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.department}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">{m.points}đ</span>
              </div>
            ))}
            <Link
              to="/ranking"
              className="block rounded-xl border border-dashed border-border py-2.5 text-center text-sm font-semibold text-primary hover:bg-accent"
            >
              Xem bảng xếp hạng đầy đủ
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
