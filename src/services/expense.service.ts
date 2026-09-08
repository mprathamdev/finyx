import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface ExpensePayload {
  description: string;
  amount: number;
  category_id?: string | null;
  payment_mode: string;
  expense_date: string;
  status?: string;
}

export const expenseService = {
  // Get expenses for current logged-in user
  async getUserExpenses() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("expenses")
      .select(`
        id,
        description,
        amount,
        payment_mode,
        expense_date,
        status,
        created_at,
        category_id,
        categories ( id, name )
      `)
      .eq("user_id", user.id)
      .order("expense_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Insert a new expense tied to logged-in user ID
  async createExpense(payload: ExpensePayload) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          ...payload,
          user_id: user.id, // Enforces user-ownership
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update existing expense
  async updateExpense(id: string, payload: Partial<ExpensePayload>) {
    const { data, error } = await supabase
      .from("expenses")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete expense
  async deleteExpense(id: string) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};