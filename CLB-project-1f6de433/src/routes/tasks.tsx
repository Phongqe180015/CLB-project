import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  CalendarClock,
  Flag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { PageHeader, Avatar } from "@/components/ui/page-primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  tasks as seedTasks,
  taskColumns,
  members,
  departments,
  type Task,
  type TaskStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  validateSearch: (search: Record<string, unknown>): { status?: TaskStatus } => {
    const valid: TaskStatus[] = ["todo", "progress", "review", "done"];
    const status = search.status;
    return typeof status === "string" && valid.includes(status as TaskStatus)
      ? { status: status as TaskStatus }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Tác vụ — ClubHub" },
      { name: "description", content: "Bảng Kanban quản lý tác vụ theo bốn giai đoạn." },
    ],
  }),
  component: TasksPage,
});

const priorityTone: Record<Task["priority"], string> = {
  Cao: "bg-red-50 text-red-600",
  "Trung bình": "bg-amber-50 text-amber-700",
  Thấp: "bg-green-50 text-green-600",
};

// Soft pastel màu riêng cho từng Ban — chỉ dùng nhóm tím / xanh dương / chàm / lam,
// tránh đỏ–cam–vàng–xanh lá vốn đã dành cho nhãn độ ưu tiên.
const departmentTone: Record<string, string> = {
  "Ban Chủ nhiệm": "bg-violet-50 text-violet-700 border-violet-200",
  "Ban Truyền thông": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Ban Chuyên môn": "bg-blue-50 text-blue-700 border-blue-200",
  "Ban Hậu cần": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Ban Đối ngoại": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const departmentDot: Record<string, string> = {
  "Ban Chủ nhiệm": "bg-violet-500",
  "Ban Truyền thông": "bg-fuchsia-500",
  "Ban Chuyên môn": "bg-blue-500",
  "Ban Hậu cần": "bg-cyan-500",
  "Ban Đối ngoại": "bg-indigo-500",
};

function deptTone(d: string) {
  return departmentTone[d] ?? "bg-slate-50 text-slate-700 border-slate-200";
}

const columnAccent: Record<string, string> = {
  todo: "bg-muted-foreground",
  progress: "bg-info",
  review: "bg-orange",
  done: "bg-success",
};

function findMember(name: string) {
  return members.find((m) => m.name === name);
}

function TaskCard({
  task,
  onOpen,
  onDragStart,
  dragging,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: () => void;
  dragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={cn(
        "group cursor-pointer rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        dragging && "rotate-1 opacity-50 ring-2 ring-primary/40",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
            deptTone(task.department),
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", departmentDot[task.department])} />
          {task.department}
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
            priorityTone[task.priority],
          )}
        >
          <Flag className="h-2.5 w-2.5" /> {task.priority}
        </span>
      </div>

      <p className="font-bold leading-snug">{task.title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
          <Sparkles className="h-3 w-3" /> +{task.points} Pts
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" /> {task.due}
          <Avatar initials={task.assigneeInitials} className="h-7 w-7" />
        </span>
      </div>
    </div>
  );
}

function TaskDetailDialog({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const member = task ? findMember(task.assignee) : undefined;
  const colLabel = task
    ? taskColumns.find((c) => c.status === task.status)?.label
    : "";

  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        {task && (
          <>
            <DialogHeader>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                    deptTone(task.department),
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", departmentDot[task.department])} />
                  {task.department}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
                    priorityTone[task.priority],
                  )}
                >
                  <Flag className="h-3 w-3" /> {task.priority}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {colLabel}
                </span>
              </div>
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <DialogDescription>{task.event}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mô tả chi tiết
                </p>
                <p className="text-sm leading-relaxed text-foreground">{task.description}</p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-secondary/60 p-3">
                <CalendarClock className="h-4 w-4 text-info" />
                <span className="text-sm font-medium">Hạn chót (deadline)</span>
                <span className="ml-auto text-sm font-bold">{task.due}</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Avatar initials={task.assigneeInitials} className="h-11 w-11 text-sm" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{task.assignee}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member?.role ? `${member.role} · ` : ""}
                    {task.department}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-extrabold text-amber-600">+{task.points}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">điểm tích luỹ</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70"
              >
                Đóng
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const emptyForm = {
  title: "",
  description: "",
  department: departments[0],
  priority: "Trung bình" as Task["priority"],
  assignee: members[0].name,
  due: "",
  points: 100,
  status: "todo" as TaskStatus,
};

function NewTaskDialog({
  open,
  defaultStatus,
  onClose,
  onCreate,
}: {
  open: boolean;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onCreate: (t: Task) => void;
}) {
  const [form, setForm] = useState({ ...emptyForm, status: defaultStatus });

  function submit() {
    if (!form.title.trim()) return;
    const member = findMember(form.assignee);
    onCreate({
      id: `t${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim() || "Chưa có mô tả.",
      status: form.status,
      assignee: form.assignee,
      assigneeInitials: member?.initials ?? "??",
      due: form.due.trim() || "—",
      event: "Tác vụ nội bộ",
      priority: form.priority,
      department: form.department,
      points: Number(form.points) || 0,
    });
    setForm({ ...emptyForm, status: defaultStatus });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm công việc mới</DialogTitle>
          <DialogDescription>Điền thông tin chi tiết cho tác vụ.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="VD: Lên kế hoạch sự kiện..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Mô tả chi tiết</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Mô tả nội dung công việc..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ban phụ trách</Label>
              <Select
                value={form.department}
                onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Mức độ ưu tiên</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, priority: v as Task["priority"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Cao", "Trung bình", "Thấp"] as const).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Người phụ trách</Label>
              <Select
                value={form.assignee}
                onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="due">Deadline</Label>
              <Input
                id="due"
                value={form.due}
                onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                placeholder="VD: 30/06"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="points">Điểm tích luỹ</Label>
              <Input
                id="points"
                type="number"
                value={form.points}
                onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))}
                placeholder="VD: 150"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as TaskStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskColumns.map((c) => (
                    <SelectItem key={c.status} value={c.status}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            Huỷ
          </button>
          <button
            onClick={submit}
            disabled={!form.title.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Tạo công việc
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TasksPage() {
  const { status: statusFilter } = Route.useSearch();
  const navigate = useNavigate({ from: "/tasks" });
  const [items, setItems] = useState<Task[]>(seedTasks);
  const [active, setActive] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<TaskStatus>("todo");

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], progress: [], review: [], done: [] };
    items.forEach((t) => map[t.status].push(t));
    return map;
  }, [items]);

  const visibleColumns = statusFilter
    ? taskColumns.filter((c) => c.status === statusFilter)
    : taskColumns;

  const clearFilter = () => navigate({ search: {} });

  function handleDrop(status: TaskStatus) {
    if (!draggingId) return;
    setItems((prev) =>
      prev.map((t) => (t.id === draggingId ? { ...t, status } : t)),
    );
    setDraggingId(null);
    setDragOverCol(null);
  }

  function openNew(status: TaskStatus) {
    setNewStatus(status);
    setNewOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Quản lý tác vụ"
        subtitle="Theo dõi tiến độ công việc qua bốn giai đoạn — không còn trôi việc trên chat."
        action={
          <button
            onClick={() => openNew("todo")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
          >
            <Plus className="h-4 w-4" /> Tác vụ mới
          </button>
        }
      />

      {statusFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Đang lọc theo trạng thái:</span>
          <button
            onClick={clearFilter}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {taskColumns.find((c) => c.status === statusFilter)?.label}
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        {visibleColumns.map((col) => {
          const colTasks = grouped[col.status];
          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.status);
              }}
              onDragLeave={() => setDragOverCol((c) => (c === col.status ? null : c))}
              onDrop={() => handleDrop(col.status)}
              className={cn(
                "flex max-h-[calc(100vh-12rem)] w-[300px] min-w-[280px] max-w-[350px] flex-1 flex-col rounded-2xl bg-secondary/60 p-3 transition-colors duration-200",
                dragOverCol === col.status && "bg-primary/10 ring-2 ring-primary/30",
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", columnAccent[col.status])} />
                  <h2 className="font-bold">{col.label}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openNew(col.status)}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
                  aria-label="Thêm nhanh tác vụ"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto">
                {colTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    dragging={draggingId === t.id}
                    onOpen={() => setActive(t)}
                    onDragStart={() => setDraggingId(t.id)}
                  />
                ))}
                {colTasks.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                    {dragOverCol === col.status ? "Thả vào đây" : "Chưa có tác vụ"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDetailDialog task={active} onClose={() => setActive(null)} />
      <NewTaskDialog
        open={newOpen}
        defaultStatus={newStatus}
        onClose={() => setNewOpen(false)}
        onCreate={(t) => {
          setItems((prev) => [t, ...prev]);
          setNewOpen(false);
        }}
      />

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5" /> Kéo thả thẻ để chuyển công việc giữa các cột
      </p>
    </div>
  );
}
