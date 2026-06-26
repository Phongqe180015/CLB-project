import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Check,
  CircleDashed,
  Eye,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { PageHeader, Card } from "@/components/ui/page-primitives";
import { Avatar } from "@/components/ui/page-primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-store";
import { departments, events as seedEvents, members } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Lịch hoạt động — ClubHub" },
      {
        name: "description",
        content: "Lịch tập trung các mốc thời gian, lịch đăng bài và deadline.",
      },
    ],
  }),
  component: CalendarPage,
});

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
// June 2025 starts on Sunday -> offset so Monday-first grid
const firstOffset = 6; // 1 June 2025 is Sunday => 6 blanks before
const daysInMonth = 30;
const calendarYear = 2025;
const calendarMonthLabel = "Tháng 6, 2025";
const today = 21;

type EventStatus = "Đang chuẩn bị" | "Đang diễn ra" | "Hoàn tất";

type EventPosition = {
  role: string;
  assignedMemberId: string | null;
};

type CalendarEventItem = (typeof seedEvents)[number] & {
  status: EventStatus;
  positions: EventPosition[];
};

type EventDraft = {
  title: string;
  description: string;
  date: string;
  timeRange: string;
  organizerUnit: string;
  organizer: string;
  location: string;
};

const toCalendarDate = (day: number) => `${calendarYear}-06-${String(day).padStart(2, "0")}`;

const formatDisplayDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const createDraft = (date = toCalendarDate(today)): EventDraft => ({
  title: "",
  description: "",
  date,
  timeRange: "",
  organizerUnit: "Ban Truyền thông",
  organizer: "Ban Chủ Nhiệm",
  location: "Văn phòng CLB",
});

const positionSeeds: Record<string, EventPosition[]> = {
  e1: [
    { role: "Trưởng ban tổ chức", assignedMemberId: "1" },
    { role: "MC chương trình", assignedMemberId: "3" },
    { role: "Âm thanh / Ánh sáng", assignedMemberId: "4" },
    { role: "Truyền thông sự kiện", assignedMemberId: null },
  ],
  e2: [
    { role: "Điều phối hồ sơ", assignedMemberId: "7" },
    { role: "Phỏng vấn viên", assignedMemberId: "2" },
    { role: "Hỗ trợ hậu cần", assignedMemberId: null },
  ],
  e3: [
    { role: "Điều phối nội dung", assignedMemberId: "2" },
    { role: "Kỹ thuật phòng", assignedMemberId: "4" },
    { role: "Truyền thông", assignedMemberId: "5" },
  ],
  e4: [
    { role: "Biên tập nội dung", assignedMemberId: "5" },
    { role: "Thiết kế ảnh", assignedMemberId: "3" },
    { role: "Kiểm duyệt đăng bài", assignedMemberId: null },
  ],
  e5: [
    { role: "Chủ trì cuộc họp", assignedMemberId: "1" },
    { role: "Thư ký", assignedMemberId: "2" },
    { role: "Tổng hợp báo cáo", assignedMemberId: "6" },
  ],
};

const createEventStatus = (event: (typeof seedEvents)[number]): EventStatus => {
  if (event.progress >= 100) return "Hoàn tất";
  if (event.day === today) return "Đang diễn ra";
  return "Đang chuẩn bị";
};

const createEventDraft = (event: CalendarEventItem): CalendarEventItem => ({
  ...event,
  positions: event.positions.map((position) => ({ ...position })),
});

const createNewEventPositions = (): EventPosition[] => [
  { role: "Trưởng ban tổ chức", assignedMemberId: null },
  { role: "MC chương trình", assignedMemberId: null },
  { role: "Truyền thông sự kiện", assignedMemberId: null },
  { role: "Hậu cần", assignedMemberId: null },
];

const createSeedEvents = (): CalendarEventItem[] =>
  seedEvents.map((event) => ({
    ...event,
    status: createEventStatus(event),
    positions: positionSeeds[event.id]
      ? positionSeeds[event.id].map((position) => ({ ...position }))
      : [],
  }));

const typeStyles: Record<string, { dot: string; chip: string; label: string }> = {
  event: { dot: "bg-primary", chip: "bg-primary-light text-primary", label: "Sự kiện" },
  post: { dot: "bg-info", chip: "bg-info/10 text-info", label: "Đăng bài" },
  deadline: { dot: "bg-orange", chip: "bg-orange/10 text-orange", label: "Deadline" },
};

const statusStyles: Record<EventStatus, string> = {
  "Đang chuẩn bị": "bg-orange/10 text-orange",
  "Đang diễn ra": "bg-info/10 text-info",
  "Hoàn tất": "bg-success/10 text-success",
};

function CalendarPage() {
  const currentUser = useAuth();
  const isAdmin = currentUser?.department === "Ban Chủ nhiệm";
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(createSeedEvents);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<EventDraft>(createDraft());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const isPastEvent = !!selectedEvent && selectedEvent.day < today;

  const openCreateModal = (date?: string) => {
    setDraft(createDraft(date));
    setIsCreateOpen(true);
  };

  const openEventDetail = (event: CalendarEventItem) => {
    setSelectedEvent(createEventDraft(event));
  };

  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCalendarEvents((current) => [
      {
        id: `e-${Date.now()}`,
        title: draft.title,
        date: formatDisplayDate(draft.date),
        day: Number(draft.date.split("-")[2]),
        type: "event",
        progress: 0,
        team: [],
        location: draft.location,
        status: "Đang chuẩn bị",
        positions: createNewEventPositions(),
      },
      ...current,
    ]);

    setIsCreateOpen(false);
    setDraft(createDraft());
  };

  const handleSaveEventDetail = () => {
    if (!selectedEvent || isPastEvent) return;
    setCalendarEvents((current) =>
      current.map((event) =>
        event.id === selectedEvent.id ? createEventDraft(selectedEvent) : event,
      ),
    );
    closeEventDetail();
  };

  const handleDeleteEventDetail = () => {
    if (!selectedEvent || isPastEvent) return;
    const confirmed = window.confirm(`Xóa sự kiện "${selectedEvent.title}"?`);
    if (!confirmed) return;

    setCalendarEvents((current) => current.filter((event) => event.id !== selectedEvent.id));
    closeEventDetail();
  };

  const updatePosition = (index: number, nextPosition: EventPosition) => {
    if (isPastEvent) return;
    setSelectedEvent((current) => {
      if (!current) return current;
      const nextPositions = current.positions.map((position, currentIndex) =>
        currentIndex === index ? nextPosition : position,
      );
      return { ...current, positions: nextPositions };
    });
  };

  const clearPosition = (index: number) => {
    if (isPastEvent) return;
    updatePosition(index, { ...selectedEvent!.positions[index], assignedMemberId: null });
  };

  const claimOpenPosition = (index: number) => {
    if (!currentUser || isPastEvent) return;
    const matchedMember = members.find(
      (member) =>
        member.name === currentUser.name ||
        member.email === currentUser.email ||
        member.studentId === currentUser.studentId,
    );
    if (!matchedMember) return;
    updatePosition(index, {
      ...selectedEvent!.positions[index],
      assignedMemberId: matchedMember.id,
    });
  };

  const cells = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <PageHeader
        title="Lịch hoạt động"
        subtitle="Toàn bộ mốc thời gian, lịch đăng bài và deadline ở một nơi."
        action={
          <Button
            type="button"
            onClick={() => openCreateModal()}
            className="h-10 bg-[#ff6b00] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#e85f00]"
          >
            <Plus className="h-4 w-4" /> Thêm lịch
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">{calendarMonthLabel}</h2>
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
              const dayEvents = day ? calendarEvents.filter((e) => e.day === day) : [];
              const isPastDay = Boolean(day && day < today);
              const cellDate = day ? toCalendarDate(day) : null;

              if (!day) {
                return (
                  <div
                    key={i}
                    className="min-h-[84px] rounded-lg border border-transparent p-1.5 text-left"
                  />
                );
              }

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={isPastDay ? -1 : 0}
                  aria-disabled={isPastDay}
                  onClick={() => !isPastDay && openCreateModal(cellDate ?? undefined)}
                  onKeyDown={(e) => {
                    if (isPastDay) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openCreateModal(cellDate ?? undefined);
                    }
                  }}
                  className={cn(
                    "min-h-[84px] rounded-lg border border-transparent p-1.5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isPastDay
                      ? "cursor-not-allowed border-border/60 bg-muted/40 opacity-70"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-sm cursor-pointer",
                    day === today && "ring-2 ring-primary",
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateModal(cellDate ?? undefined);
                    }}
                    className={cn(
                      "inline-grid h-6 w-6 place-items-center rounded-full text-xs font-semibold transition-colors",
                      day === today ? "bg-primary text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {day}
                  </button>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEventDetail(e);
                        }}
                        className={cn(
                          "w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors hover:opacity-90",
                          typeStyles[e.type].chip,
                        )}
                      >
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate">{e.title}</span>
                          <Eye className="h-3 w-3 shrink-0 opacity-70" />
                        </span>
                      </button>
                    ))}
                  </div>
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
              {[...calendarEvents]
                .sort((a, b) => a.day - b.day)
                .map((e) => (
                  <div key={e.id} className="flex gap-3">
                    <Circle
                      className={cn(
                        "mt-1 h-2.5 w-2.5 shrink-0 fill-current",
                        typeStyles[e.type].chip.split(" ")[1],
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.date} • {e.location}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && closeEventDetail()}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-border bg-white text-slate-900 sm:rounded-2xl">
          {selectedEvent && (
            <div className="space-y-6">
              <DialogHeader className="text-left">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <span
                      className={cn(
                        "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
                        statusStyles[selectedEvent.status],
                      )}
                    >
                      {selectedEvent.status}
                    </span>
                    <div>
                      <DialogTitle className="text-2xl font-extrabold text-slate-900">
                        {selectedEvent.title}
                      </DialogTitle>
                      <DialogDescription className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" /> {selectedEvent.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4" /> {selectedEvent.date}
                        </span>
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-slate-50 px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-slate-500">
                      {selectedEvent.progress}% hoàn thành
                    </p>
                    <p className="text-3xl font-extrabold text-primary">
                      {selectedEvent.progress}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Progress value={selectedEvent.progress} />
                  <p className="text-xs text-slate-500">
                    Tiến độ tổng thể của sự kiện / hoạt động hiện tại.
                  </p>
                </div>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Bảng phân công nhân sự theo vị trí
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" /> {selectedEvent.positions.length} vị trí
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedEvent.positions.map((position, index) => {
                      const assignee = position.assignedMemberId
                        ? members.find((member) => member.id === position.assignedMemberId)
                        : null;

                      return (
                        <div
                          key={`${position.role}-${index}`}
                          className={cn(
                            "flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
                            assignee
                              ? "border-border"
                              : "border-dashed border-orange/40 bg-orange/5",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                                assignee
                                  ? "bg-success/10 text-success"
                                  : "bg-orange/10 text-orange",
                              )}
                            >
                              {assignee ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <CircleDashed className="h-5 w-5" />
                              )}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{position.role}</p>
                              <p className="text-xs text-slate-500">
                                {assignee ? "Đã phân công" : "Vị trí đang tuyển"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center sm:justify-end">
                            {assignee ? (
                              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                                <Avatar
                                  initials={assignee.initials}
                                  className="h-10 w-10 text-xs"
                                />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {assignee.name}
                                  </p>
                                  <p className="truncate text-xs text-slate-500">
                                    {assignee.department}
                                  </p>
                                </div>
                                {isAdmin && !isPastEvent && (
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={position.assignedMemberId ?? undefined}
                                      onValueChange={(value) =>
                                        updatePosition(index, {
                                          ...position,
                                          assignedMemberId: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="h-9 w-44 bg-white text-slate-900">
                                        <SelectValue placeholder="Đổi nhân sự" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {members.map((member) => (
                                          <SelectItem key={member.id} value={member.id}>
                                            {member.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="h-9 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => clearPosition(index)}
                                    >
                                      <X className="h-4 w-4" /> Xóa phân công
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "flex w-full items-center justify-end gap-2 rounded-xl px-3 py-2",
                                  isPastEvent
                                    ? "border border-border bg-slate-50"
                                    : "border border-dashed border-orange/40 bg-orange/5",
                                )}
                              >
                                <span className="text-sm font-medium text-slate-500">
                                  {isPastEvent ? "Vị trí đã qua, chỉ xem" : "Chưa có người phụ trách"}
                                </span>
                                {!isPastEvent && (
                                  <Button
                                    type="button"
                                    className="bg-[#ff6b00] text-white hover:bg-[#e85f00]"
                                    onClick={() => claimOpenPosition(index)}
                                  >
                                    Đăng ký vị trí
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="border-border bg-slate-50">
                    <h4 className="mb-3 text-sm font-bold text-slate-900">Thông tin sự kiện</h4>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="rounded-xl bg-white px-3 py-2">
                        <p className="text-xs text-slate-500">Loại</p>
                        <p className="font-semibold text-slate-900">
                          {typeStyles[selectedEvent.type].label}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-2">
                        <p className="text-xs text-slate-500">Trạng thái hiển thị</p>
                        <p className="font-semibold text-slate-900">{selectedEvent.status}</p>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-2">
                        <p className="text-xs text-slate-500">Nhân sự đã phân công</p>
                        <p className="font-semibold text-slate-900">
                          {
                            selectedEvent.positions.filter((position) => position.assignedMemberId)
                              .length
                          }
                          /{selectedEvent.positions.length}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border">
                    <h4 className="mb-3 text-sm font-bold text-slate-900">Quyền thao tác</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="rounded-xl bg-secondary px-3 py-2">
                        <p className="font-semibold text-slate-900">
                          {isAdmin ? "Ban Chủ nhiệm" : "Thành viên"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isPastEvent
                            ? "Sự kiện đã qua chỉ cho phép xem thông tin và phân công cũ."
                            : isAdmin
                              ? "Có thể đổi hoặc xóa phân công nhân sự trước khi lưu."
                              : "Chỉ có thể đăng ký ở các vị trí đang trống."}
                        </p>
                      </div>
                      {!isPastEvent && (
                        <p className="text-xs text-slate-500">
                          Các thay đổi sẽ chỉ được ghi nhận sau khi bấm Lưu thay đổi.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              <DialogFooter className="gap-3 sm:justify-end">
                <Button type="button" variant="outline" onClick={closeEventDetail}>
                  {isPastEvent ? "Đóng" : "Hủy bỏ"}
                </Button>
                {!isPastEvent && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteEventDetail}
                  >
                    Xóa sự kiện
                  </Button>
                )}
                {!isPastEvent && (
                  <Button
                    type="button"
                    className="bg-[#ff6b00] text-white hover:bg-[#e85f00]"
                    onClick={handleSaveEventDetail}
                  >
                    Lưu thay đổi
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-white text-slate-900 sm:rounded-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Thêm Sự kiện / Hoạt động
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Tạo nhanh một sự kiện mới từ lịch hoặc từ nút thêm lịch ở góc trên bên phải.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleCreateSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-title" className="text-slate-800">
                  TÊN SỰ KIỆN *
                </Label>
                <Input
                  id="event-title"
                  required
                  value={draft.title}
                  onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
                  placeholder="Ví dụ: Họp khẩn thiết kế banner..."
                  className="h-11 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-description" className="text-slate-800">
                  MÔ TẢ SỰ KIỆN
                </Label>
                <Textarea
                  id="event-description"
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((current) => ({ ...current, description: e.target.value }))
                  }
                  placeholder="Mục tiêu buổi họp, nội dung chính..."
                  className="min-h-24 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date" className="text-slate-800">
                  NGÀY (THÁNG/NĂM)
                </Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="event-date"
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft((current) => ({ ...current, date: e.target.value }))}
                    className="h-11 bg-white pl-9 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-time" className="text-slate-800">
                  THỜI GIAN DIỄN RA
                </Label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="event-time"
                    value={draft.timeRange}
                    onChange={(e) =>
                      setDraft((current) => ({ ...current, timeRange: e.target.value }))
                    }
                    placeholder="14:00 - 16:00"
                    className="h-11 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-unit" className="text-slate-800">
                  ĐƠN VỊ CHỦ TRÌ
                </Label>
                <Select
                  value={draft.organizerUnit}
                  onValueChange={(value) =>
                    setDraft((current) => ({ ...current, organizerUnit: value }))
                  }
                >
                  <SelectTrigger id="event-unit" className="h-11 bg-white text-slate-900">
                    <SelectValue placeholder="Chọn ban chủ trì" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-organizer" className="text-slate-800">
                  NGƯỜI TỔ CHỨC / PHỤ TRÁCH
                </Label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="event-organizer"
                    value={draft.organizer}
                    onChange={(e) =>
                      setDraft((current) => ({ ...current, organizer: e.target.value }))
                    }
                    placeholder="Ban Chủ Nhiệm"
                    className="h-11 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-location" className="text-slate-800">
                  ĐỊA ĐIỂM
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="event-location"
                    value={draft.location}
                    onChange={(e) =>
                      setDraft((current) => ({ ...current, location: e.target.value }))
                    }
                    placeholder="Văn phòng CLB"
                    className="h-11 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-[#ff6b00] text-white hover:bg-[#e85f00] focus-visible:ring-[#ff6b00]/30"
              >
                Lưu sự kiện
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
