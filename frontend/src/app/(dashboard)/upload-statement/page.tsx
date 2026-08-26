import type { Metadata } from "next";
import { StatementContainer } from "@/components/upload-statement/StatementContainer";

export const metadata: Metadata = {
  title: "Upload Statement - FinYX Financial Dashboard",
  description: "Upload and analyze PDF bank statements for automated ledger parsing.",
};

export default function UploadStatementPage() {
  return <StatementContainer />;
}