"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category.service";
import { CategoryForm } from "./CategoryForm";
import { CategoryTable, Category } from "./CategoryTable";
import { Loader2, AlertCircle } from "lucide-react";

export function CategoryContainer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getUserCategories();
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (name: string, id?: string) => {
    if (id) {
      await categoryService.updateCategory(id, { name });
    } else {
      await categoryService.createCategory({ name, type: "expense" });
    }
    setEditingCategory(null);
    await fetchCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    if (editingCategory?.id === id) {
      setEditingCategory(null);
    }
    await fetchCategories();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Category Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and organize transaction categories tied directly to your profile.
        </p>
      </div>

      <CategoryForm
        onSaveCategory={handleSaveCategory}
        editingCategory={editingCategory}
        onCancelEdit={() => setEditingCategory(null)}
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-card border border-border/80 rounded-2xl">
          <Loader2 className="w-6 h-6 text-[#0B63F6] animate-spin" />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onStartEdit={(category) => setEditingCategory(category)}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}