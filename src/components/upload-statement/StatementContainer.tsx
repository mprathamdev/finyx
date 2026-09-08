"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatementUploadForm } from "./StatementUploadForm";
import { StatementTable, StatementItem } from "./StatementTable";
import { statementService, StatementRecord } from "@/services/statement.service";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

export function StatementContainer() {
  const router = useRouter();
  const [statements, setStatements] = useState<StatementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: StatementRecord[] = await statementService.getUserStatements();
      const formatted: StatementItem[] = data.map((item) => ({
        id: item.id,
        fileName: item.original_file_name,
        fileSize: "PDF Document",
        uploadDate: new Date(item.created_at).toISOString().split("T")[0],
        status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as
          | "Processed"
          | "Processing"
          | "Failed",
      }));

      setStatements(formatted);
    } catch (err: any) {
      setError(err.message || "Failed to load statement history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const handleUploadSuccess = async (file: File) => {
    try {
      await statementService.uploadStatement(file);
      await fetchStatements();
    } catch (err: any) {
      alert(err.message || "Error processing statement upload.");
    }
  };

  const handleDeleteStatement = async (id: string) => {
    try {
      await statementService.deleteStatement(id);
      await fetchStatements();
    } catch (err: any) {
      alert(err.message || "Error deleting statement.");
    }
  };

  const handleEditStatement = async (id: string, newFileName: string) => {
    try {
      await statementService.updateStatementName(id, newFileName);
      await fetchStatements();
    } catch (err: any) {
      alert(err.message || "Error renaming statement.");
    }
  };

  const handleViewAnalytics = async (statement: StatementItem) => {
    try {
      setAnalyzingId(statement.id);

      // Get user's session access token to attach as Bearer header
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/statements/analyze", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ statementId: statement.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process analytics.");
      }

      router.push(`/analytics?statementId=${statement.id}`);
    } catch (err: any) {
      alert(err.message || "Error analyzing bank statement.");
      fetchStatements();
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B63F6]/10 text-[#0B63F6] border border-[#0B63F6]/20 uppercase">
              Data Import
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Bank Statement Upload
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload PDF bank statements to automatically extract transactions and generate insights.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <StatementUploadForm onUploadSuccess={handleUploadSuccess} />

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-card border border-border/80 rounded-2xl">
          <Loader2 className="w-6 h-6 text-[#0B63F6] animate-spin" />
        </div>
      ) : (
        <StatementTable
          statements={statements}
          onDeleteStatement={handleDeleteStatement}
          onEditStatement={handleEditStatement}
          onViewAnalytics={handleViewAnalytics}
          analyzingId={analyzingId}
        />
      )}
    </div>
  );
}