export interface StatementAnalytics {
  metadata: {
    statement_id: string;
    bank_name: string;
    period: string;
    total_transactions: number;
    processed_at: string;
  };

  // Metrics #1 - #6: Key Performance Indicators
  kpis: {
    total_income: number;            // 1. Total Income
    total_expenses: number;          // 2. Total Expenses
    total_savings: number;           // 3. Total Savings
    income_vs_expense_ratio: number; // 4. Income vs Expense Ratio (e.g. 1.85x)
    avg_daily_spending: number;      // 5. Average Daily Spending
    avg_monthly_spending: number;    // 6. Average Monthly Spending
  };

  // Metric #7: Category-wise Expense Distribution (Pie/Donut Chart)
  category_distribution: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;

  // Metric #8: Top 5 Expense Categories (Bar Chart)
  top_5_categories: Array<{
    category: string;
    amount: number;
  }>;

  // Metric #9: Highest Single Expense (Highlight Card)
  highest_expense: {
    date: string;
    merchant: string;
    amount: number;
    category: string;
  };

  // Metric #10: Top Vendors / Merchants (Ranked List)
  top_vendors: Array<{
    merchant: string;
    total_spent: number;
    transaction_count: number;
  }>;

  // Metric #11: Recurring Payments & Bills (Table)
  recurring_payments: Array<{
    merchant: string;
    amount: number;
    frequency: "Monthly" | "Weekly" | "Annual";
    category: string;
  }>;

  // Metric #12: Essential vs. Non-Essential Spending (Split Progress Bar)
  discretionary_split: {
    essential: { amount: number; percentage: number };
    non_essential: { amount: number; percentage: number };
  };

  // Metrics #13 & #14: Monthly Spending Trend & Month-over-Month Change (Area/Line Chart)
  spending_trends: {
    mom_change_percentage: number; // 14. MoM Change (-4.2% or +12.5%)
    spending_direction: "INCREASING" | "DECREASING" | "STABLE";
    daily_trend: Array<{           // 13. Monthly Spending Trend Timeline
      date: string;
      daily_spend: number;
      cumulative_spend: number;
    }>;
  };

  // Metric #15: Spending Insights & Savings Opportunities (Action Cards)
  insights: Array<{
    type: "CRITICAL" | "WARNING" | "OPPORTUNITY" | "POSITIVE";
    title: string;
    description: string;
  }>;
}