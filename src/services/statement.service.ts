import { createClient } from "@/lib/supabase/client";

export interface StatementRecord {
  id: string;
  user_id: string;
  original_file_name: string;
  server_file_name: string;
  file_path: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}

export const statementService = {
  /**
   * Get all statements for current authenticated user from Supabase DB
   */
  async getUserStatements(): Promise<StatementRecord[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("statements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Send file to Next.js API route handler to store locally and log to database
   */
  async uploadStatement(file: File): Promise<StatementRecord> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/statements/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to upload file");
    }

    return data.statement;
  },

  /**
   * Update statement original name in Supabase database
   */
  async updateStatementName(id: string, newFileName: string): Promise<StatementRecord> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("statements")
      .update({ original_file_name: newFileName })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Delete statement entry from Supabase database
   */
  async deleteStatement(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("statements")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};