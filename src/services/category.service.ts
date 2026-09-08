import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface CategoryInput {
  name: string;
  type?: "expense" | "income" | "both";
}

export const categoryService = {
  // Create Category (Injects currently logged-in user_id)
  async createCategory(data: CategoryInput) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User must be logged in to create a category.");
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert([
        {
          name: data.name,
          type: data.type || "expense",
          user_id: user.id, // Inserts logged-in user's UUID
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return category;
  },

  // Get only the logged-in user's categories
  async getUserCategories() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User must be logged in to view categories.");
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Delete category belonging to the logged-in user
  async deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
  },

  async updateCategory(id: string, data: { name: string; type?: string }) {
    const { data: updated, error } = await supabase
      .from("categories")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },
};