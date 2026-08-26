"use client";

import { useState } from "react";
import { CategoryForm } from "./CategoryForm";
import { CategoryTable, Category } from "./CategoryTable";
import { Layers } from "lucide-react";

const initialCategories: Category[] = [
  { id: "1", name: "Grocery" },
  { id: "2", name: "Transportation" },
  { id: "3", name: "Rent & Housing" },
  { id: "4", name: "Utilities & Bills" },
  { id: "5", name: "Shopping & Retail" },
  { id: "6", name: "Entertainment" },
  { id: "7", name: "Healthcare" },
];

export function CategoryContainer() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    };
    setCategories((prev) => [newCategory, ...prev]);
  };

  const handleEditCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B63F6]/10 text-[#0B63F6] border border-[#0B63F6]/20 uppercase">
              System Settings
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Category Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure analytical groups to automate income & expense classification.
          </p>
        </div>
      </div>

      <CategoryForm onAddCategory={handleAddCategory} />
      <CategoryTable
        categories={categories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}