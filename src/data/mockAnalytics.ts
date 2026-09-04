import { StatementAnalytics } from "@/types/analytics";

export const mockAnalyticsData: StatementAnalytics = {
  metadata: {
    statement_id: "stmt_8f92a10c",
    bank_name: "HDFC Bank Ltd",
    period: "July 2026",
    total_transactions: 342,
    processed_at: "2026-08-01T10:30:00Z",
  },
  kpis: {
    total_income: 145000.0,
    total_expenses: 78450.0,
    total_savings: 66550.0,
    income_vs_expense_ratio: 1.85,
    avg_daily_spending: 2530.64,
    avg_monthly_spending: 78450.0,
  },
  category_distribution: [
    { category: "Housing & Rent", amount: 28000, percentage: 35.7, color: "#3B82F6" },
    { category: "Food & Dining", amount: 16200, percentage: 20.7, color: "#10B981" },
    { category: "Shopping", amount: 12500, percentage: 15.9, color: "#F59E0B" },
    { category: "Utilities & Bills", amount: 8400, percentage: 10.7, color: "#8B5CF6" },
    { category: "Transport & Fuel", amount: 6850, percentage: 8.7, color: "#EC4899" },
    { category: "Entertainment", amount: 6500, percentage: 8.3, color: "#6366F1" },
  ],
  top_5_categories: [
    { category: "Housing & Rent", amount: 28000 },
    { category: "Food & Dining", amount: 16200 },
    { category: "Shopping", amount: 12500 },
    { category: "Utilities & Bills", amount: 8400 },
    { category: "Transport & Fuel", amount: 6850 },
  ],
  highest_expense: {
    date: "2026-07-03",
    merchant: "Prestige Estates Ltd (Rent)",
    amount: 28000.0,
    category: "Housing & Rent",
  },
  top_vendors: [
    { merchant: "Prestige Estates Ltd", total_spent: 28000, transaction_count: 1 },
    { merchant: "Swiggy / Zomato", total_spent: 8450, transaction_count: 18 },
    { merchant: "Amazon India", total_spent: 7200, transaction_count: 5 },
    { merchant: "Shell Fuel Station", total_spent: 4500, transaction_count: 3 },
    { merchant: "Zepto / Blinkit", total_spent: 4150, transaction_count: 12 },
  ],
  recurring_payments: [
    { merchant: "Netflix India", amount: 649, frequency: "Monthly", category: "Entertainment" },
    { merchant: "Spotify Premium", amount: 119, frequency: "Monthly", category: "Entertainment" },
    { merchant: "Airtel Broadband", amount: 1179, frequency: "Monthly", category: "Utilities & Bills" },
    { merchant: "Cult.fit Membership", amount: 1499, frequency: "Monthly", category: "Health & Fitness" },
  ],
  discretionary_split: {
    essential: { amount: 53250.0, percentage: 67.9 },
    non_essential: { amount: 25200.0, percentage: 32.1 },
  },
  spending_trends: {
    mom_change_percentage: -5.4,
    spending_direction: "DECREASING",
    daily_trend: [
      { date: "Jul 01", daily_spend: 2500, cumulative_spend: 2500 },
      { date: "Jul 05", daily_spend: 31000, cumulative_spend: 33500 },
      { date: "Jul 10", daily_spend: 4200, cumulative_spend: 37700 },
      { date: "Jul 15", daily_spend: 12400, cumulative_spend: 50100 },
      { date: "Jul 20", daily_spend: 8500, cumulative_spend: 58600 },
      { date: "Jul 25", daily_spend: 9400, cumulative_spend: 68000 },
      { date: "Jul 31", daily_spend: 10450, cumulative_spend: 78450 },
    ],
  },
  insights: [
    {
      type: "OPPORTUNITY",
      title: "High Online Food Spend",
      description: "You spent ₹8,450 on food delivery across 18 transactions. Preparing meals at home 2 extra days/week could save roughly ₹3,500/month.",
    },
    {
      type: "POSITIVE",
      title: "Healthy Savings Rate",
      description: "Your savings rate for July reached 45.9% of total income, well above the recommended 20% baseline.",
    },
    {
      type: "WARNING",
      title: "Non-Essential Spend Threshold",
      description: "32.1% of expenses fell into discretionary categories. Consider capping dining out and entertainment at 25%.",
    },
  ],
};