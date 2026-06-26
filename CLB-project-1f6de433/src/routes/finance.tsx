import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Check, X, TrendingUp, PiggyBank } from "lucide-react";
import { PageHeader, Card, Avatar } from "@/components/ui/page-primitives";
import { fundRecords } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Tài chính — ClubHub" },
      { name: "description", content: "Theo dõi tình trạng đóng quỹ của thành viên một cách minh bạch." },
    ],
  }),
  component: FinancePage,
});

function PaidCell({ paid }: { paid: boolean }) {
  return (
    <span
      className={cn(
        "inline-grid h-7 w-7 place-items-center rounded-full",
        paid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
      )}
    >
      {paid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </span>
  );
}

function FinancePage() {
  const totalPaid = fundRecords.filter((r) => r.q2).length;
  const rate = Math.round((totalPaid / fundRecords.length) * 100);

  return (
    <div>
      <PageHeader
        title="Theo dõi tài chính"
        subtitle="Tình trạng đóng quỹ câu lạc bộ theo kỳ và theo sự kiện — minh bạch, rõ ràng."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Tổng quỹ kỳ này", value: "12.450.000đ", icon: PiggyBank, tone: "bg-primary/10 text-primary" },
          { label: "Tỷ lệ đã đóng", value: `${rate}%`, icon: TrendingUp, tone: "bg-success/10 text-success" },
          { label: "Chưa hoàn thành", value: `${fundRecords.length - totalPaid} người`, icon: Wallet, tone: "bg-orange/10 text-orange" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-3">
            <span className={cn("grid h-12 w-12 place-items-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="px-5 py-4">
          <h2 className="font-bold">Bảng đóng quỹ thành viên</h2>
          <p className="text-sm text-muted-foreground">Theo dõi theo kỳ và theo sự kiện</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Thành viên</th>
                <th className="px-5 py-3 font-semibold">Ban</th>
                <th className="px-5 py-3 text-center font-semibold">Quỹ kỳ I</th>
                <th className="px-5 py-3 text-center font-semibold">Quỹ kỳ II</th>
                <th className="px-5 py-3 text-center font-semibold">Quỹ sự kiện</th>
              </tr>
            </thead>
            <tbody>
              {fundRecords.map((r) => (
                <tr key={r.member} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={r.initials} className="h-8 w-8" />
                      <span className="font-medium">{r.member}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.department}</td>
                  <td className="px-5 py-3 text-center"><div className="flex justify-center"><PaidCell paid={r.q1} /></div></td>
                  <td className="px-5 py-3 text-center"><div className="flex justify-center"><PaidCell paid={r.q2} /></div></td>
                  <td className="px-5 py-3 text-center"><div className="flex justify-center"><PaidCell paid={r.event} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
