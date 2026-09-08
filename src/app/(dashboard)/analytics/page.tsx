"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AnalyticsReport from "@/components/analytics/AnalyticsReport";
import { StatementAnalytics } from "@/types/analytics";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statementId = searchParams.get("statementId");

  const [analyticsData, setAnalyticsData] = useState<StatementAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!statementId) {
      setError("No Statement ID provided.");
      setLoading(false);
      return;
    }

    async function fetchAnalyticsFromSupabase() {
      try {
        setLoading(true);
        setError(null);

        // Uses NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY from environment
        const supabase = createClient();

        // 1. Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User authentication required to view analytics.");
        }

        // 2. Fetch directly from the Supabase database table
        const { data, error: dbError } = await supabase
          .from("statement_analytics")
          .select("analytics_data")
          .eq("statement_id", statementId)
          .eq("user_id", user.id)
          .single();

        if (dbError || !data) {
          throw new Error("Analytics record not found in database.");
        }

        // 3. Parse JSON string if stored as an escaped string in Supabase
        const parsed: StatementAnalytics = typeof data.analytics_data === "string"
          ? JSON.parse(data.analytics_data)
          : data.analytics_data;

        setAnalyticsData(parsed);
      } catch (err: any) {
        setError(err.message || "Failed to fetch analytics record.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsFromSupabase();
  }, [statementId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B63F6]" />
        <p className="text-sm font-medium text-muted-foreground">
          Fetching financial analytics directly from Supabase...
        </p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="mx-auto max-w-2xl mt-12 p-6 bg-card border border-border rounded-xl shadow-sm text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-2">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Analytics Unavailable</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {error || "Analytics record for this bank statement could not be found."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Statement Upload
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <AnalyticsReport data={analyticsData} />
    </div>
  );
}