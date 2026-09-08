"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from "recharts";

interface DashboardChartsProps {
  expenseData?: Array<{ month: string; expense: number; transactions: number }>;
  categoryData?: Array<{ name: string; value: number }>;
}

const COLORS = ["#071B5C", "#0B63F6", "#1769FF", "#12D9FF", "#94A3B8"];

export function DashboardCharts({ expenseData = [], categoryData = [] }: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Trend Chart */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Financial Trend</h3>
              <p className="text-xs text-muted-foreground">Monthly cumulative spending pattern</p>
            </div>
            <span className="text-xs font-semibold bg-[#0B63F6]/10 text-[#0B63F6] px-2.5 py-1 rounded-md">
              YTD Analytics
            </span>
          </div>
          
          <div className="h-72 w-full min-h-[280px] flex items-center justify-center">
            {expenseData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No monthly trend data available in DB.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Expense"]}
                  />
                  <Area type="monotone" dataKey="expense" stroke="#0B63F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expenses by Category Donut Chart */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Expense by Category</h3>
            <p className="text-xs text-muted-foreground">Category percentage distribution</p>
          </div>
          
          <div className="h-52 w-full my-2 flex items-center justify-center">
            {categoryData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No category data in DB.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1.5 border-t border-border pt-3">
            {categoryData.slice(0, 4).map((cat, i) => (
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

      {/* Transaction Volume Bar Chart */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
        <h3 className="text-base font-bold text-foreground">Monthly Volume</h3>
        <p className="text-xs text-muted-foreground mb-4">Total processed transaction counts</p>
        <div className="h-48 w-full flex items-center justify-center">
          {expenseData.length === 0 ? (
            <p className="text-xs text-muted-foreground">No volume metrics available in DB.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                <Bar dataKey="transactions" fill="#1769FF" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}