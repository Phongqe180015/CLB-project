import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  GraduationCap,
  Users2,
  Megaphone,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { clubs, clubCategories, type Club } from "@/lib/clubs-data";
import { useAuth, setPendingClub } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Câu lạc bộ — ClubHub" },
      {
        name: "description",
        content: "Khám phá danh sách các câu lạc bộ sinh viên, xem thông tin và đăng ký gia nhập.",
      },
    ],
  }),
  component: ClubsPage,
});

function ClubsPage() {
  const navigate = useNavigate();
  const user = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tất cả");
  const [viewMode, setViewMode] = useState<"all" | "my">("all");
  const [myMode, setMyMode] = useState<"created" | "chaired">("created");
  const [detailClub, setDetailClub] = useState<Club | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source =
      viewMode === "all"
        ? clubs
        : clubs.filter((club) =>
            myMode === "created" ? club.createdBy === user?.name : club.president === user?.name,
          );

    return source.filter((c) => {
      const matchCat = category === "Tất cả" || c.category === category;
      const matchQuery =
        !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category, viewMode, myMode, user?.name]);

  const openRegister = (club: Club) => {
    setDetailClub(null);
    setPendingClub(club.id);
    if (user) {
      navigate({ to: "/apply/$clubId", params: { clubId: club.id } });
    } else {
      // Guests must sign in / sign up before applying.
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
      {/* Sub navbar */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange text-orange-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">CLUB HUB</span>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-muted-foreground">
          Student Portal
        </span>
        {!user && (
          <Link
            to="/login"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Đăng nhập
          </Link>
        )}
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Title + search */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Khám Phá Các Câu Lạc Bộ
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Tìm câu lạc bộ phù hợp với đam mê của bạn và gửi đơn đăng ký gia nhập chỉ trong vài
            bước.
          </p>
        </div>

        <div className="mx-auto mb-5 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Tìm câu lạc bộ theo tên hoặc mô tả…"
              className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm shadow-[var(--shadow-card)] outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        </div>

        {/* View and category filters */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setViewMode("all")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              viewMode === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setViewMode("my")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              viewMode === "my"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            Của tôi
          </button>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["Tất cả", ...clubCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setViewMode("all");
                setCategory(cat);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                viewMode === "all" && category === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {viewMode === "my" && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-[var(--shadow-card)]">
              {[
                { id: "created", label: "CLB đã tạo" },
                { id: "chaired", label: "CLB chủ nhiệm" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMyMode(item.id as "created" | "chaired")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    myMode === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Không tìm thấy câu lạc bộ phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <article
                key={club.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl",
                      club.tone,
                    )}
                  >
                    {club.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{club.name}</h3>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {club.category}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {club.createdBy === user?.name && (
                        <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                          Đã tạo
                        </span>
                      )}
                      {club.president === user?.name && (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          Chủ nhiệm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{club.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users2 className="h-4 w-4" /> {club.members} thành viên
                  </span>
                  <button
                    onClick={() => setDetailClub(club)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detail / Overview modal */}
      <Dialog open={!!detailClub} onOpenChange={(o) => !o && setDetailClub(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          {detailClub && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl",
                      detailClub.tone,
                    )}
                  >
                    {detailClub.emoji}
                  </span>
                  <div className="min-w-0 text-left">
                    <DialogTitle className="text-xl">{detailClub.fullName}</DialogTitle>
                    <DialogDescription className="mt-0.5">{detailClub.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{detailClub.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={Sparkles} label="Người tạo" value={detailClub.createdBy} />
                  <InfoRow
                    icon={GraduationCap}
                    label="Ban chủ nhiệm"
                    value={detailClub.president}
                  />
                  <InfoRow
                    icon={Users2}
                    label="Số thành viên"
                    value={`${detailClub.members} người`}
                  />
                  <InfoRow icon={Megaphone} label="Fanpage" value={detailClub.fanpage} />
                  <InfoRow icon={Sparkles} label="Danh mục" value={detailClub.category} />
                </div>

                <div>
                  <p className="mb-2 font-semibold">Hoạt động nổi bật</p>
                  <ul className="space-y-1.5">
                    {detailClub.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => openRegister(detailClub)}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange text-base font-bold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90"
              >
                Đăng Ký Tham Gia
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-0.5 truncate font-semibold">{value}</p>
    </div>
  );
}
