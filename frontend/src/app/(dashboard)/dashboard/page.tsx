import { StatCards } from "@/components/dashboard/StatCards";
import { DashboardCharts } from "@/components/dashboard/Dashboard";
import { TopLists } from "@/components/dashboard/TopLists";
import { TransactionTable } from "@/components/dashboard/TransactionTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time overview of business revenue, vendor spending, and operational cash flow.</p>
        </div>
      </div>

      {/* KPI Cards (Row 1) */}
      <StatCards />

      {/* Interactive Charts (Row 2 & 3) */}
      <DashboardCharts />

      {/* Structured Ledger & Vendor Split (Row 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionTable />
        </div>
        <div>
          <TopLists />
        </div>
      </div>
    </div>
  );
}