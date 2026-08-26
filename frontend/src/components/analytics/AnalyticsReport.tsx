"use client";

import React from "react";
import { StatementAnalytics } from "@/types/analytics";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Building2,
  Receipt,
  Download,
  Wallet,
  PieChart as PieIcon,
  ShoppingBag,
  Repeat,
} from "lucide-react";

interface AnalyticsReportProps {
  data: StatementAnalytics;
}

export default function AnalyticsReport({ data }: AnalyticsReportProps) {
  const {
    metadata,
    kpis,
    category_distribution,
    top_5_categories,
    highest_expense,
    top_vendors,
    recurring_payments,
    discretionary_split,
    spending_trends,
    insights,
  } = data;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION & METADATA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl bg-card border border-border p-6 shadow-fin-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {metadata.bank_name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {metadata.period}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Financial Statement Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Processed {metadata.total_transactions} transactions on{" "}
            {new Date(metadata.processed_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 shadow-fin-sm cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      {/* METRICS #1 - #6: KPI SUMMARY GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* #1 Total Income */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">1. Total Income</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {formatCurrency(kpis.total_income)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Total credits received</p>
        </div>

        {/* #2 Total Expenses */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">2. Total Expenses</span>
            <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {formatCurrency(kpis.total_expenses)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Total debits processed</p>
        </div>

        {/* #3 Total Savings */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">3. Total Savings</span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {formatCurrency(kpis.total_savings)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Net remaining balance</p>
        </div>

        {/* #4 Income vs Expense Ratio */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">4. Income vs Expense</span>
            <div className="rounded-lg bg-accent p-2 text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {kpis.income_vs_expense_ratio}x
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {kpis.income_vs_expense_ratio >= 1.2
              ? "Sustainable spending pattern"
              : "High expenditure alert"}
          </p>
        </div>

        {/* #5 Average Daily Spending */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">5. Avg Daily Spending</span>
            <div className="rounded-lg bg-secondary p-2 text-secondary-foreground">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {formatCurrency(kpis.avg_daily_spending)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Per day average spend</p>
        </div>

        {/* #6 Average Monthly Spending */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-fin-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">6. Avg Monthly Spending</span>
            <div className="rounded-lg bg-secondary p-2 text-secondary-foreground">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-numeric text-foreground">
            {formatCurrency(kpis.avg_monthly_spending)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Baseline monthly outflow</p>
        </div>
      </div>

      {/* METRICS #7, #8, #9, #12: CHARTS & HIGHLIGHTS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* #7 Category-wise Expense Distribution (Donut Chart) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              7. Category Distribution
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_distribution}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--card-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {category_distribution.map((item) => (
              <div key={item.category} className="flex items-center gap-2 text-xs">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-muted-foreground">{item.category}</span>
                <span className="font-semibold font-numeric text-foreground ml-auto">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* #8 Top 5 Expense Categories (Bar Chart) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              8. Top 5 Expense Categories
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top_5_categories}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Spent"]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="amount" fill="#0B63F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* METRICS #9 & #12: HIGHEST EXPENSE & DISCRETIONARY SPLIT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* #9 Highest Expense Card */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              9. Highest Single Expense
            </span>
            <div className="mt-3 flex items-baseline justify-between">
              <h4 className="text-xl font-bold text-foreground">
                {highest_expense.merchant}
              </h4>
              <span className="text-2xl font-extrabold font-numeric text-destructive">
                {formatCurrency(highest_expense.amount)}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {highest_expense.category}
              </span>
              <span className="text-xs text-muted-foreground">
                Date: {highest_expense.date}
              </span>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-destructive/5 p-3 border border-destructive/10 text-xs text-destructive">
            Largest transaction recorded during this statement cycle.
          </div>
        </div>

        {/* #12 Essential vs Non-Essential Spending */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              12. Essential vs Non-Essential
            </span>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">Essential Needs</span>
                  <span className="font-semibold font-numeric text-foreground">
                    {formatCurrency(discretionary_split.essential.amount)} (
                    {discretionary_split.essential.percentage}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-[#0B63F6] rounded-full"
                    style={{ width: `${discretionary_split.essential.percentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">Non-Essential Discretionary</span>
                  <span className="font-semibold font-numeric text-foreground">
                    {formatCurrency(discretionary_split.non_essential.amount)} (
                    {discretionary_split.non_essential.percentage}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${discretionary_split.non_essential.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Ideal baseline recommendation is 70% Essential / 30% Non-Essential.
          </p>
        </div>
      </div>

      {/* METRICS #10 & #11: TOP VENDORS & RECURRING PAYMENTS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* #10 Top Vendors / Merchants */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            10. Top Vendors / Merchants
          </h3>
          <div className="divide-y divide-border">
            {top_vendors.map((vendor, idx) => (
              <div key={vendor.merchant} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground font-numeric">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{vendor.merchant}</p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.transaction_count} transactions
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold font-numeric text-foreground">
                  {formatCurrency(vendor.total_spent)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* #11 Recurring Payments & Bills */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
          <div className="flex items-center gap-2 mb-4">
            <Repeat className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              11. Recurring Payments & Subscriptions
            </h3>
          </div>
          <div className="divide-y divide-border">
            {recurring_payments.map((bill) => (
              <div key={bill.merchant} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{bill.merchant}</p>
                  <span className="inline-block mt-0.5 rounded bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {bill.frequency} • {bill.category}
                  </span>
                </div>
                <span className="text-sm font-bold font-numeric text-foreground">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METRICS #13 & #14: MONTHLY SPENDING TREND & MOM CHANGE */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              13. Monthly Spending Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Cumulative expenditure progression over the period
            </p>
          </div>
          {/* #14 Month-over-Month Change */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">14. MoM Change:</span>
            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                spending_trends.mom_change_percentage < 0
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {spending_trends.mom_change_percentage < 0 ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
              {spending_trends.mom_change_percentage}% ({spending_trends.spending_direction})
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={spending_trends.daily_trend}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B63F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0B63F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Cumulative Spend"]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--card-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative_spend"
                stroke="#0B63F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#spendingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* METRIC #15: SPENDING INSIGHTS & SAVINGS OPPORTUNITIES */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-fin-card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-foreground">
            15. Actionable Spending Insights & Savings Opportunities
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${
                item.type === "OPPORTUNITY"
                  ? "border-amber-500/20 bg-amber-500/5 text-foreground"
                  : item.type === "POSITIVE"
                  ? "border-emerald-500/20 bg-emerald-500/5 text-foreground"
                  : "border-destructive/20 bg-destructive/5 text-foreground"
              }`}
            >
              <div className="flex items-center gap-2 font-medium text-sm mb-2">
                {item.type === "OPPORTUNITY" && <Lightbulb className="h-4 w-4 text-amber-500" />}
                {item.type === "POSITIVE" && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
                {item.type === "WARNING" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}