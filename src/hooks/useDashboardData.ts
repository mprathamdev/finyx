"use client";

import { useEffect, useState, useMemo } from "react";
import { expenseService } from "@/services/expense.service";

export interface MonthlyTrendItem {
  month: string;
  expense: number;
  transactions: number;
}

export interface CategoryDataItem {
  name: string;
  value: number;
  rawAmount: number;
}

export interface VendorDataItem {
  name: string;
  amount: string;
  percentage: number;
  rawAmount: number;
}

export interface StatCardItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
}

export interface TransactionItem {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: string;
  status: string;
  type: string;
}

export function useDashboardData() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await expenseService.getUserExpenses();
        setExpenses(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard expenses.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const processed = useMemo(() => {
    let totalExpense = 0;
    const catMap: Record<string, number> = {};
    const monthlyMap: Record<string, { month: string; expense: number; transactions: number; sortKey: number }> = {};
    const vendorMap: Record<string, number> = {};

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      totalExpense += amt;

      // Category breakdown
      const catName = item.categories?.name || "General";
      catMap[catName] = (catMap[catName] || 0) + amt;

      // Vendor / Description breakdown
      const desc = item.description || "General Expense";
      vendorMap[desc] = (vendorMap[desc] || 0) + amt;

      // Monthly trend breakdown
      const d = new Date(item.expense_date);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const sortKey = d.getFullYear() * 100 + d.getMonth();
        const label = monthNames[d.getMonth()];

        if (!monthlyMap[key]) {
          monthlyMap[key] = { month: label, expense: 0, transactions: 0, sortKey };
        }
        monthlyMap[key].expense += amt;
        monthlyMap[key].transactions += 1;
      }
    });

    // Monthly trend sorted chronologically
    const expenseData: MonthlyTrendItem[] = Object.values(monthlyMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ month, expense, transactions }) => ({ month, expense, transactions }));

    // Category Percentage Data
    const categoryData: CategoryDataItem[] = Object.entries(catMap)
      .map(([name, rawAmount]) => ({
        name,
        rawAmount,
        value: totalExpense > 0 ? Math.round((rawAmount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Top 5 Vendors
    const topVendors: VendorDataItem[] = Object.entries(vendorMap)
      .map(([name, rawAmount]) => ({
        name,
        rawAmount,
        amount: `₹${rawAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        percentage: totalExpense > 0 ? Math.min(Math.round((rawAmount / totalExpense) * 100), 100) : 0,
      }))
      .sort((a, b) => b.rawAmount - a.rawAmount)
      .slice(0, 5);

    // Recent Transactions Table
    const recentTransactions: TransactionItem[] = expenses.slice(0, 5).map((tx) => ({
      id: `TX-${tx.id.toString().slice(0, 4).toUpperCase()}`,
      merchant: tx.description || "Expense Record",
      category: tx.categories?.name || "General",
      date: tx.expense_date,
      amount: `₹${Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      status: tx.status || "Completed",
      type: "expense",
    }));

    // Stats
    const totalTransactionsCount = expenses.length;
    const avgExpense = totalTransactionsCount > 0 ? totalExpense / totalTransactionsCount : 0;
    const topCategoryName = categoryData[0]?.name || "N/A";
    const topCategoryPct = categoryData[0]?.value || 0;

    const stats: StatCardItem[] = [
      {
        title: "Total Expenses",
        value: `₹${totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: "+12.4%",
        isPositive: false,
        iconName: "IndianRupee",
      },
      {
        title: "Total Transactions",
        value: totalTransactionsCount.toLocaleString("en-IN"),
        change: "+8.2%",
        isPositive: true,
        iconName: "CreditCard",
      },
      {
        title: "Avg Transaction",
        value: `₹${avgExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: "+4.1%",
        isPositive: true,
        iconName: "Wallet",
      },
      {
        title: "Top Category",
        value: topCategoryName,
        change: `${topCategoryPct}% Share`,
        isPositive: true,
        iconName: "TrendingUp",
      },
    ];

    // Text Summary
    const analysisText = expenses.length === 0
      ? "No expense records are currently available in your Supabase database. Log expenses to populate analytics."
      : `Your organization logged ${totalTransactionsCount} total expenses amounting to ₹${totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}. The primary expenditure driver is "${topCategoryName}", accounting for ${topCategoryPct}% of total net outflow. Your largest vendor outlay is "${topVendors[0]?.name || 'N/A'}" at ${topVendors[0]?.amount || '₹0.00'}.`;

    return {
      expenseData,
      categoryData,
      topVendors,
      recentTransactions,
      stats,
      analysisText,
      totalExpense,
    };
  }, [expenses]);

  return { loading, error, ...processed };
}