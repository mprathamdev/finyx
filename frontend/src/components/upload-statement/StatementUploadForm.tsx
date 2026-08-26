"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface StatementUploadFormProps {
  onUploadSuccess: (file: File) => void;
}

export function StatementUploadForm({ onUploadSuccess }: StatementUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Only PDF files are supported for bank statement processing.");
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds maximum limit of 10MB.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    onUploadSuccess(selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-6 shadow-fin-card hover:shadow-fin-floating transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-finyx-accent-gradient opacity-10 blur-2xl pointer-events-none rounded-full" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-finyx-accent-gradient p-0.5 shadow-fin-sm">
          <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
            <UploadCloud className="w-5 h-5 text-[#0B63F6]" />
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            Upload Bank Statement
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20" />
          </h2>
          <p className="text-xs text-muted-foreground">Import your PDF bank statements to auto-generate analytics and insights.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? "border-[#0B63F6] bg-[#0B63F6]/5"
              : selectedFile
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-border/80 bg-background/50 hover:bg-secondary/50 hover:border-border"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-secondary rounded-full border border-border">
                <FileText className="w-6 h-6 text-[#0B63F6]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  <span className="text-[#0B63F6] underline">Click to upload</span> or drag and drop your file here
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supported format: PDF only (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedFile}
            className="inline-flex items-center justify-center gap-2 h-10 px-6 text-xs font-bold text-white bg-finyx-accent-gradient hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-fin-md transition-all duration-200 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            Process Statement
          </button>
        </div>
      </form>
    </div>
  );
}