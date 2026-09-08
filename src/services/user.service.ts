import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const userService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    const supabase = createClient();

    // Fetch user session/auth context
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Failed to fetch current user:", error);
      return null;
    }

    // Extract user metadata (full_name, avatar_url if logged in via OAuth/Google or metadata)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

    return {
      id: user.id,
      name: fullName,
      email: user.email || "",
      avatar: avatarUrl,
    };
  },
};