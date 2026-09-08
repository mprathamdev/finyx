"use client";

import { useState } from "react";
import { Edit3, Trash2, Search, Tag, Loader2 } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

interface CategoryTableProps {
  categories: Category[];
  onStartEdit: (category: Category) => void;
  onDeleteCategory: (id: string) => Promise<void>;
}

const BADGE_STYLES = [
  "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "bg-amber-500/10 text-amber-600 border-amber-500/20",
];

export function CategoryTable({
  categories,
  onStartEdit,
  onDeleteCategory,
}: CategoryTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDeleteCategory(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-fin-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary rounded-lg border border-border">
            <Tag className="w-4 h-4 text-[#0B63F6]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Active Categories</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredCategories.length} of {categories.length} configured tags
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter categories..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/20 focus:border-[#0B63F6] transition-all"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-border/60 shadow-fin-sm">
        <table className="w-full min-w-[540px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/60 border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16"># No.</th>
              <th className="py-3.5 px-4">Category Details</th>
              <th className="py-3.5 px-4 text-center w-28">Status</th>
              <th className="py-3.5 px-4 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-card">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-muted-foreground">
                  No categories found in Supabase database.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category, index) => {
                const badgeStyle = BADGE_STYLES[index % BADGE_STYLES.length];
                const isDeleting = deletingId === category.id;

                return (
                  <tr
                    key={category.id}
                    className="hover:bg-secondary/40 transition-colors duration-150 group"
                  >
                    <td className="py-3.5 px-4 font-numeric text-muted-foreground font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeStyle}`}
                        >
                          {category.name.slice(0, 3).toUpperCase()}
                        </span>
                        <span className="font-bold text-foreground text-sm tracking-tight truncate">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isDeleting ? (
                        <div className="flex justify-end">
                          <Loader2 className="w-4 h-4 text-[#0B63F6] animate-spin" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onStartEdit(category)}
                            className="p-1.5 text-muted-foreground hover:text-[#0B63F6] hover:bg-[#0B63F6]/10 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}