"use client";

import { useState, useEffect } from "react";
import { FolderPlus, Edit3, Sparkles, Loader2, X } from "lucide-react";
import { Category } from "./CategoryTable";

interface CategoryFormProps {
  onSaveCategory: (name: string, id?: string) => Promise<void>;
  editingCategory: Category | null;
  onCancelEdit: () => void;
}

export function CategoryForm({
  onSaveCategory,
  editingCategory,
  onCancelEdit,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-load and pre-fill category value when editing
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
    } else {
      setCategoryName("");
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onSaveCategory(categoryName.trim(), editingCategory?.id);
      setCategoryName("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card hover:shadow-fin-floating transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-finyx-accent-gradient opacity-10 blur-2xl pointer-events-none rounded-full" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-finyx-accent-gradient p-0.5 shadow-fin-sm">
            <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
              {editingCategory ? (
                <Edit3 className="w-5 h-5 text-[#0B63F6]" />
              ) : (
                <FolderPlus className="w-5 h-5 text-[#0B63F6]" />
              )}
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              {editingCategory ? "Edit Category" : "Add New Category"}
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20" />
            </h2>
            <p className="text-xs text-muted-foreground">
              {editingCategory
                ? "Update category details across your transaction analytics."
                : "Create custom tags to organize transactions across your analytics."}
            </p>
          </div>
        </div>

        {editingCategory && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Travel, Software SaaS, Utilities..."
            disabled={submitting}
            className="w-full h-11 px-4 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all duration-200 shadow-inner disabled:opacity-50"
            required
            autoFocus={!!editingCategory}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 text-xs font-bold text-white bg-finyx-accent-gradient hover:opacity-95 active:scale-95 rounded-xl shadow-fin-md hover:shadow-fin-floating transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 flex-1 sm:flex-none"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingCategory ? (
              <Edit3 className="w-4 h-4" />
            ) : (
              <FolderPlus className="w-4 h-4" />
            )}
            {submitting
              ? "Saving..."
              : editingCategory
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}