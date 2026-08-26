"use client";

import { useState } from "react";
import { PlusCircle, DollarSign, Calendar, Tag, CreditCard, FileText, Sparkles } from "lucide-react";

export interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
  paymentMode: string;
  date: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: ExpenseFormData) => void;
  categories: string[];
}

const PAYMENT_MODES = ["Credit Card", "Debit Card", "UPI", "Bank Transfer", "Cash"];

export function ExpenseForm({ onAddExpense, categories }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "Grocery");
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    onAddExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      paymentMode,
      date,
    });

    setDescription("");
    setAmount("");
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card hover:shadow-fin-floating transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-finyx-accent-gradient opacity-10 blur-2xl pointer-events-none rounded-full" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-finyx-accent-gradient p-0.5 shadow-fin-sm">
          <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#0B63F6]" />
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            Record New Expense
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20" />
          </h2>
          <p className="text-xs text-muted-foreground">Log your outgoings to track monthly budget performance.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Description */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. AWS Renewal, Team Lunch..."
              className="w-full h-10 px-3 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-10 px-3 py-2 text-xs font-semibold font-numeric bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full h-10 px-3 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all"
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Date Picker */}
          <div className="space-y-1.5 w-full sm:w-auto">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-48 h-10 px-3 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-auto self-end inline-flex items-center justify-center gap-2 h-10 px-6 text-xs font-bold text-white bg-finyx-accent-gradient hover:opacity-95 active:scale-95 rounded-xl shadow-fin-md hover:shadow-fin-floating transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
}