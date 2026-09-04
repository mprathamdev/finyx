import type { Metadata } from "next";
import { CategoryContainer } from "@/components/category/CategoryContainer";

export const metadata: Metadata = {
  title: "Categories - FinYX Financial Dashboard",
  description: "Manage and organize expense categories for better budget tracking.",
};

export default function CategoryPage() {
  return <CategoryContainer />;
}