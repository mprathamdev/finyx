"use client";

import { useState } from "react";
import { ExpenseForm, ExpenseFormData } from "./ExpenseForm";
import { ExpenseTable, ExpenseItem } from "./ExpenseTable";

const INITIAL_CATEGORIES = ["Grocery", "Transportation", "Rent & Housing", "Utilities", "Shopping", "Entertainment", "Healthcare"];

const MOCK_EXPENSES: ExpenseItem[] = [
  { id: "1", description: "AWS Cloud Infrastructure", amount: 4250.0, category: "Utilities", paymentMode: "Credit Card", date: "2026-08-24" },
  { id: "2", description: "MacBook Pro M3 Max", amount: 3499.0, category: "Shopping", paymentMode: "Bank Transfer", date: "2026-08-22" },
  { id: "3", description: "Monthly Grocery Restock", amount: 485.5, category: "Grocery", paymentMode: "UPI", date: "2026-08-20" },
  { id: "4", description: "Uber Business Commute", amount: 124.0, category: "Transportation", paymentMode: "Debit Card", date: "2026-08-18" },
];

export function ExpenseContainer() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(MOCK_EXPENSES);

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      ...formData,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditExpense = (id: string, updated: Partial<ExpenseItem>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B63F6]/10 text-[#0B63F6] border border-[#0B63F6]/20 uppercase">
              Financial Operations
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Expense Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log, categorize, and track operational expenditure records.
          </p>
        </div>
      </div>

      <ExpenseForm onAddExpense={handleAddExpense} categories={INITIAL_CATEGORIES} />
      <ExpenseTable
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
        onEditExpense={handleEditExpense}
      />
    </div>
  );
}