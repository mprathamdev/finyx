import type { Metadata } from "next";
import { ExpenseContainer } from "@/components/expense/ExpenseContainer";

export const metadata: Metadata = {
  title: "Expenses - FinYX Financial Dashboard",
  description: "Record and analyze personal and business transactions.",
};

export default function ExpensePage() {
  return <ExpenseContainer />;
}