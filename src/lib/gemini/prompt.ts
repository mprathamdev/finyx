import { Type, Schema } from "@google/genai";

export const BANK_STATEMENT_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    is_bank_statement: {
      type: Type.BOOLEAN,
      description: "True if the uploaded document is a valid bank statement, false otherwise.",
    },
    rejection_reason: {
      type: Type.STRING,
      description: "If is_bank_statement is false, provide a concise explanation why.",
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        bank_name: { type: Type.STRING },
        period: { type: Type.STRING },
        total_transactions: { type: Type.INTEGER },
        processed_at: { type: Type.STRING },
      },
      required: ["bank_name", "period", "total_transactions", "processed_at"],
    },
    kpis: {
      type: Type.OBJECT,
      properties: {
        total_income: { type: Type.NUMBER },
        total_expenses: { type: Type.NUMBER },
        total_savings: { type: Type.NUMBER },
        income_vs_expense_ratio: { type: Type.NUMBER },
        avg_daily_spending: { type: Type.NUMBER },
        avg_monthly_spending: { type: Type.NUMBER },
      },
      required: [
        "total_income",
        "total_expenses",
        "total_savings",
        "income_vs_expense_ratio",
        "avg_daily_spending",
        "avg_monthly_spending",
      ],
    },
    category_distribution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          percentage: { type: Type.NUMBER },
          color: { type: Type.STRING },
        },
        required: ["category", "amount", "percentage", "color"],
      },
    },
    top_5_categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
        },
        required: ["category", "amount"],
      },
    },
    highest_expense: {
      type: Type.OBJECT,
      properties: {
        merchant: { type: Type.STRING },
        amount: { type: Type.NUMBER },
        category: { type: Type.STRING },
        date: { type: Type.STRING },
      },
      required: ["merchant", "amount", "category", "date"],
    },
    top_vendors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          merchant: { type: Type.STRING },
          total_spent: { type: Type.NUMBER },
          transaction_count: { type: Type.INTEGER },
        },
        required: ["merchant", "total_spent", "transaction_count"],
      },
    },
    recurring_payments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          merchant: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          frequency: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["merchant", "amount", "frequency", "category"],
      },
    },
    discretionary_split: {
      type: Type.OBJECT,
      properties: {
        essential: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            percentage: { type: Type.NUMBER },
          },
          required: ["amount", "percentage"],
        },
        non_essential: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            percentage: { type: Type.NUMBER },
          },
          required: ["amount", "percentage"],
        },
      },
      required: ["essential", "non_essential"],
    },
    spending_trends: {
      type: Type.OBJECT,
      properties: {
        mom_change_percentage: { type: Type.NUMBER },
        spending_direction: { type: Type.STRING, enum: ["INCREASED", "DECREASED", "STABLE"] },
        daily_trend: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              cumulative_spend: { type: Type.NUMBER },
            },
            required: ["date", "cumulative_spend"],
          },
        },
      },
      required: ["mom_change_percentage", "spending_direction", "daily_trend"],
    },
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["OPPORTUNITY", "POSITIVE", "WARNING"] },
        },
        required: ["title", "description", "type"],
      },
    },
  },
  required: [
    "is_bank_statement",
    "metadata",
    "kpis",
    "category_distribution",
    "top_5_categories",
    "highest_expense",
    "top_vendors",
    "recurring_payments",
    "discretionary_split",
    "spending_trends",
    "insights",
  ],
};

export const BANK_STATEMENT_PROMPT = `
You are a financial analysis engine. Analyze the provided bank statement PDF document and calculate the following 15 metrics:

1. Total Income: Total credits received.
2. Total Expenses: Total debits/outflows.
3. Total Savings: Net remaining balance (Income - Expenses).
4. Income vs Expense Ratio: (Total Income / Total Expenses).
5. Avg Daily Spending: Total Expenses / total active days in period.
6. Avg Monthly Spending: Baseline monthly outflow.
7. Category Distribution: Breakdown of expenses into categories with amounts, percentages, and UI hex color codes.
8. Top 5 Expense Categories: Top 5 expense categories by spent amount.
9. Highest Single Expense: The largest single transaction (merchant, amount, category, date).
10. Top Vendors/Merchants: Top merchants by total spend and count.
11. Recurring Payments: Subscriptions, bills, or repeating fixed transactions.
12. Essential vs Non-Essential: Categorization split (Essential Needs vs Non-Essential Discretionary).
13. Monthly Spending Trend: Daily or weekly cumulative expenditure progression array.
14. Month-over-Month (MoM) Change: Percentage change in spending and direction ('INCREASED', 'DECREASED', or 'STABLE').
15. Actionable Insights: At least 3 structured financial insights or savings recommendations ('OPPORTUNITY', 'POSITIVE', or 'WARNING').

CRITICAL VERIFICATION REQUIREMENT:
If the document is NOT a valid financial bank statement (e.g. resume, invoice, receipt, generic document), set "is_bank_statement" to false and state the reason in "rejection_reason".
`;