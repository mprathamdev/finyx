"use client";

import { useState } from "react";
import { FolderPlus, Sparkles } from "lucide-react";

interface CategoryFormProps {
  onAddCategory: (name: string) => void;
}

export function CategoryForm({ onAddCategory }: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    onAddCategory(categoryName.trim());
    setCategoryName("");
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card hover:shadow-fin-floating transition-all duration-300">
      {/* Premium Ambient Background Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-finyx-accent-gradient opacity-10 blur-2xl pointer-events-none rounded-full" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-finyx-accent-gradient p-0.5 shadow-fin-sm">
          <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-[#0B63F6]" />
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            Add New Category
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20" />
          </h2>
          <p className="text-xs text-muted-foreground">
            Create custom tags to organize transactions across your analytics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Travel, Software SaaS, Utilities..."
            className="w-full h-11 px-4 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/30 focus:border-[#0B63F6] transition-all duration-200 shadow-inner"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 text-xs font-bold text-white bg-finyx-accent-gradient hover:opacity-95 active:scale-95 rounded-xl shadow-fin-md hover:shadow-fin-floating transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <FolderPlus className="w-4 h-4" />
          Create Category
        </button>
      </form>
    </div>
  );
}