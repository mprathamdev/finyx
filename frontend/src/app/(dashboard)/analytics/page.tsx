import AnalyticsReport from "@/components/analytics/AnalyticsReport";
import { mockAnalyticsData } from "@/data/mockAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <AnalyticsReport data={mockAnalyticsData} />
    </div>
  );
}