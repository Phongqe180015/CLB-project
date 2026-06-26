import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, Download, HardDrive, FolderOpen, Lightbulb, Archive } from "lucide-react";
import { PageHeader, Card } from "@/components/ui/page-primitives";
import { documents, type Document } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Tài liệu — ClubHub" },
      { name: "description", content: "Kho lưu trữ kế hoạch, ý tưởng và tri thức của câu lạc bộ qua các nhiệm kỳ." },
    ],
  }),
  component: DocumentsPage,
});

const typeColor: Record<Document["type"], string> = {
  PDF: "bg-destructive/10 text-destructive",
  DOCX: "bg-info/10 text-info",
  XLSX: "bg-success/10 text-success",
};

const statusMeta: Record<Document["status"], { chip: string; icon: typeof FolderOpen }> = {
  "Đã thực hiện": { chip: "bg-success/10 text-success", icon: FolderOpen },
  "Ý tưởng": { chip: "bg-orange/10 text-orange", icon: Lightbulb },
  "Lưu trữ": { chip: "bg-muted text-muted-foreground", icon: Archive },
};

function DocumentsPage() {
  const [filter, setFilter] = useState<"all" | Document["status"]>("all");
  const list = filter === "all" ? documents : documents.filter((d) => d.status === filter);

  return (
    <div>
      <PageHeader
        title="Tài liệu & Tri thức"
        subtitle="Kho lưu trữ kế hoạch và ý tưởng — bảo tồn giá trị lịch sử cho các thế hệ sau."
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange px-4 text-sm font-semibold text-orange-foreground shadow-sm transition-colors hover:bg-orange/90">
            <Upload className="h-4 w-4" /> Tải lên
          </button>
        }
      />

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-primary to-primary/80">
        <div className="flex items-center gap-3 text-primary-foreground">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/90 text-orange-foreground">
            <HardDrive className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Kho đa phương tiện Google Drive</p>
            <p className="text-sm text-primary-foreground/80">
              Ảnh & video sự kiện được liên kết, không gây quá tải bộ nhớ máy chủ.
            </p>
          </div>
        </div>
        <button className="rounded-lg bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-card/90">
          Mở Drive
        </button>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          ["all", "Tất cả"],
          ["Đã thực hiện", "Đã thực hiện"],
          ["Ý tưởng", "Ý tưởng"],
          ["Lưu trữ", "Lưu trữ"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              filter === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Tên tài liệu</th>
                <th className="px-5 py-3 font-semibold">Phân loại</th>
                <th className="px-5 py-3 font-semibold">Nhiệm kỳ</th>
                <th className="px-5 py-3 font-semibold">Trạng thái</th>
                <th className="px-5 py-3 font-semibold">Cập nhật</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((d) => {
                const Icon = statusMeta[d.status].icon;
                return (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-bold", typeColor[d.type])}>
                          {d.type}
                        </span>
                        <span className="font-medium">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{d.category}</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.term}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", statusMeta[d.status].chip)}>
                        <Icon className="h-3 w-3" /> {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{d.updatedAt}</td>
                    <td className="px-5 py-3 text-right">
                      <button className="inline-grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
