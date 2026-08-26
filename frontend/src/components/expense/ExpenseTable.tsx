"use client";

import { useState } from "react";
import { Edit3, Trash2, Check, X, Search, Receipt, ArrowUpDown } from "lucide-react";

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  paymentMode: string;
  date: string;
}

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (id: string, updated: Partial<ExpenseItem>) => void;
}

export function ExpenseTable({ expenses, onDeleteExpense, onEditExpense }: ExpenseTableProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExpenseItem>>({});

  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.paymentMode.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalFiltered = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  const startEdit = (expense: ExpenseItem) => {
    setEditingId(expense.id);
    setEditForm(expense);
  };

  const saveEdit = (id: string) => {
    if (editForm.description && editForm.amount) {
      onEditExpense(id, editForm);
    }
    setEditingId(null);
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary rounded-lg border border-border">
            <Receipt className="w-4 h-4 text-[#0B63F6]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Expense Ledger</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredExpenses.length} transactions — Total:{" "}
              <span className="font-bold text-foreground font-numeric">
                ${totalFiltered.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/20"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or mode..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/20 focus:border-[#0B63F6] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-border/60 rounded-xl shadow-fin-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">#</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <tr key={expense.id} className="hover:bg-secondary/40 transition-colors group">
                    <td className="py-3.5 px-4 font-numeric text-muted-foreground font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      {editingId === expense.id ? (
                        <input
                          type="date"
                          value={editForm.date || ""}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="px-2 py-1 text-xs bg-background border border-input rounded text-foreground"
                        />
                      ) : (
                        expense.date
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {editingId === expense.id ? (
                        <input
                          type="text"
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="px-2 py-1 text-xs bg-background border border-input rounded text-foreground w-full"
                        />
                      ) : (
                        expense.description
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0B63F6]/10 text-[#0B63F6] border border-[#0B63F6]/20">
                        {expense.category}
                      </span>
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {expense.paymentMode}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-numeric font-bold text-foreground text-sm">
                      {editingId === expense.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount || ""}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                          className="px-2 py-1 text-xs bg-background border border-input rounded text-foreground w-24 text-right"
                        />
                      ) : (
                        `$${expense.amount.toFixed(2)}`
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {editingId === expense.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(expense.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(expense)}
                            className="p-1.5 text-muted-foreground hover:text-[#0B63F6] hover:bg-[#0B63F6]/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}