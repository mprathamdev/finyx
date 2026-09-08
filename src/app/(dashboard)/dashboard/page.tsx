"use client";

import { StatCards } from "@/components/dashboard/StatCards";
import { DashboardCharts } from "@/components/dashboard/Dashboard";
import { TopLists } from "@/components/dashboard/TopLists";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BrainCircuit } from "lucide-react";

export default function DashboardPage() {
  const {
    stats,
    expenseData,
    categoryData,
    recentTransactions,
    topVendors,
    analysisText,
  } = useDashboardData();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time overview of business revenue, vendor spending, and operational cash flow.
          </p>
        </div>
      </div>

      {/* Dynamic Spend Intelligence Banner */}
      <div className="bg-gradient-to-r from-[#0B63F6]/10 via-[#0B63F6]/5 to-transparent border border-[#0B63F6]/20 rounded-2xl p-4 shadow-fin-sm flex items-start gap-3.5">
        <div className="p-2.5 bg-[#0B63F6] text-white rounded-xl shadow-fin-sm shrink-0">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Dynamic Spend Intelligence</h3>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#0B63F6]/20 text-[#0B63F6] uppercase">
              Live Analysis
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {analysisText}
          </p>
        </div>
      </div>

      {/* KPI Cards (Row 1) */}
      <StatCards stats={stats} />

      {/* Interactive Charts (Row 2 & 3) */}
      <DashboardCharts expenseData={expenseData} categoryData={categoryData} />

      {/* Structured Ledger & Vendor Split (Row 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionTable transactions={recentTransactions} />
        </div>
        <div>
          <TopLists topVendors={topVendors} />
        </div>
      </div>
    </div>
  );
}