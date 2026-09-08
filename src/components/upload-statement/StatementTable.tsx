"use client";

import { useState } from "react";
import { FileText, BarChart3, Edit3, Trash2, Check, X, Search, Loader2 } from "lucide-react";

export interface StatementItem {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: "Processed" | "Processing" | "Failed";
}

interface StatementTableProps {
  statements: StatementItem[];
  onDeleteStatement: (id: string) => void;
  onEditStatement: (id: string, newFileName: string) => void;
  onViewAnalytics: (statement: StatementItem) => void;
  analyzingId?: string | null;
}

export function StatementTable({
  statements,
  onDeleteStatement,
  onEditStatement,
  onViewAnalytics,
  analyzingId,
}: StatementTableProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const filteredStatements = statements.filter((stmt) =>
    stmt.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (stmt: StatementItem) => {
    setEditingId(stmt.id);
    setEditName(stmt.fileName);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onEditStatement(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary rounded-lg border border-border">
            <FileText className="w-4 h-4 text-[#0B63F6]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Uploaded Statements</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredStatements.length} statements ready for statement parsing
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statement files..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]/20 focus:border-[#0B63F6] transition-all"
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-hidden border border-border/60 rounded-xl shadow-fin-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">Sr No.</th>
                <th className="py-3.5 px-4">File Name</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4 text-center">Analytics</th>
                <th className="py-3.5 px-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {filteredStatements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No bank statement records found.
                  </td>
                </tr>
              ) : (
                filteredStatements.map((statement, index) => (
                  <tr key={statement.id} className="hover:bg-secondary/40 transition-colors group">
                    <td className="py-3.5 px-4 font-numeric text-muted-foreground font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    {/* File details */}
                    <td className="py-3.5 px-4">
                      {editingId === statement.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-3 py-1.5 text-xs font-semibold bg-background border border-[#0B63F6] rounded-lg text-foreground focus:outline-none ring-2 ring-[#0B63F6]/20 w-full max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-red-500 shrink-0" />
                          <div>
                            <p className="font-bold text-foreground text-sm tracking-tight">{statement.fileName}</p>
                            <p className="text-[10px] text-muted-foreground">{statement.fileSize}</p>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-medium whitespace-nowrap">
                      {statement.uploadDate}
                    </td>

                    {/* View Analytics Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onViewAnalytics(statement)}
                        disabled={analyzingId === statement.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0B63F6]/10 text-[#0B63F6] hover:bg-[#0B63F6] hover:text-white border border-[#0B63F6]/20 transition-all duration-200 cursor-pointer shadow-fin-sm disabled:opacity-50"
                      >
                        {analyzingId === statement.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-3.5 h-3.5" />
                            View Analytics
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {editingId === statement.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(statement.id)}
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
                            onClick={() => startEdit(statement)}
                            className="p-1.5 text-muted-foreground hover:text-[#0B63F6] hover:bg-[#0B63F6]/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStatement(statement.id)}
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