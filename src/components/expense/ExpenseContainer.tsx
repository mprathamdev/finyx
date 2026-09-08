"use client";

import { useEffect, useState } from "react";
import { ExpenseForm, ExpenseFormData } from "./ExpenseForm";
import { ExpenseTable, ExpenseItem } from "./ExpenseTable";
import { expenseService } from "@/services/expense.service";
import { categoryService } from "@/services/category.service";
import { Loader2, AlertCircle } from "lucide-react";

export function ExpenseContainer() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [expenseData, categoryData] = await Promise.all([
        expenseService.getUserExpenses(),
        categoryService.getUserCategories(),
      ]);

      const formattedExpenses: ExpenseItem[] = (expenseData || []).map((item: any) => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount),
        category: item.categories?.name || "Uncategorized",
        paymentMode: item.payment_mode,
        date: item.expense_date,
      }));

      setExpenses(formattedExpenses);
      setCategories(categoryData || []);
    } catch (err: any) {
      setError(err.message || "Failed to load dynamic expense data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveExpense = async (formData: ExpenseFormData, id?: string) => {
    try {
      const matchedCat = categories.find((c) => c.name === formData.category);

      if (id) {
        // Edit flow
        await expenseService.updateExpense(id, {
          description: formData.description,
          amount: formData.amount,
          payment_mode: formData.paymentMode,
          expense_date: formData.date,
          category_id: matchedCat?.id || null,
        });
      } else {
        // Add flow
        await expenseService.createExpense({
          description: formData.description,
          amount: formData.amount,
          payment_mode: formData.paymentMode,
          expense_date: formData.date,
          category_id: matchedCat?.id || null,
        });
      }

      setEditingExpense(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Error saving expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Error deleting expense");
    }
  };

  const categoryNames = categories.length > 0
    ? categories.map((c) => c.name)
    : ["General", "Utilities", "Grocery"];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
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

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ExpenseForm
        onSaveExpense={handleSaveExpense}
        editingExpense={editingExpense}
        onCancelEdit={() => setEditingExpense(null)}
        categories={categoryNames}
      />

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-card border border-border/80 rounded-2xl">
          <Loader2 className="w-6 h-6 text-[#0B63F6] animate-spin" />
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
          onStartEdit={(expense) => {
            setEditingExpense(expense);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}