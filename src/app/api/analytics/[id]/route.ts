import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // 1. Resolve user session via Auth Header or Cookies
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const { data: { user }, error: authError } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch record for the statement
    const { data, error } = await supabase
      .from("statement_analytics")
      .select("analytics_data")
      .eq("statement_id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Analytics record not found" }, { status: 404 });
    }

    // 3. Ensure analytics_data is parsed if stored as a string
    const parsedData = typeof data.analytics_data === "string"
      ? JSON.parse(data.analytics_data)
      : data.analytics_data;

    return NextResponse.json(parsedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}