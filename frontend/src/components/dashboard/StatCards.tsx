import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Expenses",
    value: "$24,580.00",
    change: "+12.4%",
    isPositive: false,
    icon: DollarSign,
  },
  {
    title: "Total Transactions",
    value: "1,429",
    change: "+8.2%",
    isPositive: true,
    icon: CreditCard,
  },
  {
    title: "Net Balance",
    value: "$84,210.50",
    change: "+4.1%",
    isPositive: true,
    icon: Wallet,
  },
  {
    title: "Savings Rate",
    value: "34.8%",
    change: "-2.3%",
    isPositive: false,
    icon: TrendingUp,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm hover:shadow-fin-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</span>
              <div className="w-9 h-9 rounded-lg bg-[#0B63F6]/10 text-[#0B63F6] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold font-numeric text-foreground tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {stat.isPositive ? (
                  <span className="flex items-center text-[#16A34A] font-semibold bg-[#16A34A]/10 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> {stat.change}
                  </span>
                ) : (
                  <span className="flex items-center text-[#EF4444] font-semibold bg-[#EF4444]/10 px-1.5 py-0.5 rounded">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {stat.change}
                  </span>
                )}
                <span className="text-muted-foreground">vs. last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}