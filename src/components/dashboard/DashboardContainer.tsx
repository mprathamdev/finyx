"use client";

import { useEffect, useState, useMemo } from "react";
import { expenseService } from "@/services/expense.service";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from "recharts";
import {
  DollarSign, CreditCard, Wallet, TrendingUp, ArrowUpRight,
  ArrowDownRight, Loader2, Sparkles, BrainCircuit, AlertCircle, Download
} from "lucide-react";

const COLORS = ["#071B5C", "#0B63F6", "#1769FF", "#12D9FF", "#94A3B8", "#6366F1", "#EC4899"];

export function DashboardContainer() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getUserExpenses();
      setExpenses(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load expenses for analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- Dynamic Analytics Computations ---
  const analytics = useMemo(() => {
    if (!expenses.length) return null;

    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};
    const monthlyData: Record<string, { month: string; expense: number; transactions: number }> = {};
    const descriptionTotals: Record<string, number> = {};

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      totalExpense += amt;

      // Category breakdown
      const catName = item.categories?.name || "Uncategorized";
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;

      // Top Descriptions / Vendors breakdown
      const desc = item.description || "General Expense";
      descriptionTotals[desc] = (descriptionTotals[desc] || 0) + amt;

      // Monthly breakdown
      const dateObj = new Date(item.expense_date);
      if (!isNaN(dateObj.getTime())) {
        const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
        const label = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear().toString().slice(-2)}`;

        if (!monthlyData[key]) {
          monthlyData[key] = { month: label, expense: 0, transactions: 0 };
        }
        monthlyData[key].expense += amt;
        monthlyData[key].transactions += 1;
      }
    });

    // Format Category Data for PieChart
    const categoryPie = Object.entries(categoryTotals).map(([name, val]) => ({
      name,
      value: Math.round((val / totalExpense) * 100),
      rawAmount: val,
    })).sort((a, b) => b.value - a.value);

    // Format Monthly Trend Data
    const monthlyTrend = Object.values(monthlyData);

    // Top 5 Vendors
    const topVendors = Object.entries(descriptionTotals)
      .map(([name, amt]) => ({
        name,
        amount: amt,
        percentage: Math.min(Math.round((amt / totalExpense) * 100), 100),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // AI Insight calculations
    const topCategory = categoryPie[0] || { name: "N/A", value: 0 };
    const avgTransaction = expenses.length ? (totalExpense / expenses.length).toFixed(2) : "0.00";

    return {
      totalExpense,
      totalTransactions: expenses.length,
      avgTransaction,
      categoryPie,
      monthlyTrend,
      topVendors,
      topCategory,
    };
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-card border border-border/80 rounded-2xl space-y-3">
        <Loader2 className="w-8 h-8 text-[#0B63F6] animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Analyzing user expenses from Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</span>
            <div className="w-9 h-9 rounded-lg bg-[#0B63F6]/10 text-[#0B63F6] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-numeric text-foreground tracking-tight">
              ${(analytics?.totalExpense || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Sum of all user-logged transactions</p>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Transactions</span>
            <div className="w-9 h-9 rounded-lg bg-[#0B63F6]/10 text-[#0B63F6] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-numeric text-foreground tracking-tight">
              {analytics?.totalTransactions || 0}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Active items recorded in database</p>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average Expense</span>
            <div className="w-9 h-9 rounded-lg bg-[#0B63F6]/10 text-[#0B63F6] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-numeric text-foreground tracking-tight">
              ${analytics?.avgTransaction || "0.00"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Average ticket size per transaction</p>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Category</span>
            <div className="w-9 h-9 rounded-lg bg-[#0B63F6]/10 text-[#0B63F6] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground tracking-tight truncate">
              {analytics?.topCategory?.name || "N/A"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Accounted for {analytics?.topCategory?.value || 0}% of net spend
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic AI Analysis Summary Banner */}
      <div className="bg-gradient-to-r from-[#0B63F6]/10 via-[#0B63F6]/5 to-transparent border border-[#0B63F6]/20 rounded-2xl p-5 shadow-fin-card relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0B63F6] text-white rounded-xl shadow-fin-sm shrink-0">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Dynamic Spend Intelligence</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B63F6]/20 text-[#0B63F6] uppercase">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {expenses.length === 0 ? (
                "No transaction records found for your account. Log new items under Expenses to generate automated insights."
              ) : (
                <>
                  You have logged <strong>{analytics?.totalTransactions} transactions</strong> totaling{" "}
                  <strong>${analytics?.totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>. 
                  Your highest expenditure category is <strong>{analytics?.topCategory?.name}</strong> at{" "}
                  <strong>{analytics?.topCategory?.value}%</strong> of total spend. 
                  {analytics?.topVendors[0] && (
                    <> The top single expense allocation is <strong>{analytics.topVendors[0].name}</strong> at <strong>${analytics.topVendors[0].amount.toLocaleString()}</strong>.</>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Trend Chart */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Financial Trend</h3>
              <p className="text-xs text-muted-foreground">Monthly spending accumulation based on user records</p>
            </div>
            <span className="text-xs font-semibold bg-[#0B63F6]/10 text-[#0B63F6] px-2.5 py-1 rounded-md">
              Dynamic
            </span>
          </div>

          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B63F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0B63F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, "Expense"]}
                />
                <Area type="monotone" dataKey="expense" stroke="#0B63F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Donut Chart */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Expense by Category</h3>
            <p className="text-xs text-muted-foreground">Category percentage breakdown</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics?.categoryPie || []} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {(analytics?.categoryPie || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-border pt-3">
            {(analytics?.categoryPie || []).slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground truncate max-w-[120px]">{cat.name}</span>
                </div>
                <span className="font-semibold text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Allocations & Transaction Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Allocations */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Top Spending Allocations</h3>
            <p className="text-xs text-muted-foreground mb-4">Highest individual expenses by item</p>
          </div>
          <div className="space-y-4">
            {(analytics?.topVendors || []).map((vendor, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground truncate max-w-[160px]">{vendor.name}</span>
                  <span className="font-numeric text-foreground">${vendor.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B63F6] rounded-full transition-all duration-500"
                    style={{ width: `${vendor.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Transaction Ledger Table */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Recent Expense Records</h3>
              <p className="text-xs text-muted-foreground">Showing latest logged user expenses</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-2">Description</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Date</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {expenses.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-semibold text-foreground">{tx.description}</td>
                    <td className="py-3 px-2 text-muted-foreground">{tx.categories?.name || "General"}</td>
                    <td className="py-3 px-2 text-muted-foreground">{tx.expense_date}</td>
                    <td className="py-3 px-2 text-right font-numeric font-bold text-foreground">
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}