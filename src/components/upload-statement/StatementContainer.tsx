"use client";

import { useState } from "react";
import { StatementUploadForm } from "./StatementUploadForm";
import { StatementTable, StatementItem } from "./StatementTable";

const INITIAL_STATEMENTS: StatementItem[] = [
  { id: "1", fileName: "HDFC_Bank_Statement_July_2026.pdf", fileSize: "2.4 MB", uploadDate: "2026-08-01", status: "Processed" },
  { id: "2", fileName: "Chase_Checking_Account_Q2.pdf", fileSize: "1.8 MB", uploadDate: "2026-07-15", status: "Processed" },
  { id: "3", fileName: "ICICI_CreditCard_Statement_June.pdf", fileSize: "840 KB", uploadDate: "2026-07-02", status: "Processed" },
];

export function StatementContainer() {
  const [statements, setStatements] = useState<StatementItem[]>(INITIAL_STATEMENTS);

  const handleUploadSuccess = (file: File) => {
    const newStatement: StatementItem = {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Processed",
    };
    setStatements((prev) => [newStatement, ...prev]);
  };

  const handleDeleteStatement = (id: string) => {
    setStatements((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditStatement = (id: string, newFileName: string) => {
    setStatements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, fileName: newFileName } : item))
    );
  };

  const handleViewAnalytics = (statement: StatementItem) => {
    // Integration point: Route to analytics page or open modal
    console.log("Navigating to analytics for statement:", statement.fileName);
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

      <StatementUploadForm onUploadSuccess={handleUploadSuccess} />
      <StatementTable
        statements={statements}
        onDeleteStatement={handleDeleteStatement}
        onEditStatement={handleEditStatement}
        onViewAnalytics={handleViewAnalytics}
      />
    </div>
  );
}