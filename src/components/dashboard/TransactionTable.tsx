import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Download } from "lucide-react";

const recentTransactions = [
  { id: "TX-9021", merchant: "AWS Cloud Services", category: "Infrastructure", date: "Aug 24, 2026", amount: "$4,250.00", status: "Completed", type: "expense" },
  { id: "TX-9022", merchant: "Apple Store", category: "Hardware", date: "Aug 24, 2026", amount: "$3,499.00", status: "Completed", type: "expense" },
  { id: "TX-9023", merchant: "Client Retainer (Acme)", category: "Income", date: "Aug 22, 2026", amount: "+$12,500.00", status: "Completed", type: "income" },
  { id: "TX-9024", merchant: "Uber Freight", category: "Logistics", date: "Aug 20, 2026", amount: "$1,640.00", status: "Pending", type: "expense" },
  { id: "TX-9025", merchant: "Stripe Processing Fee", category: "Finance", date: "Aug 19, 2026", amount: "$1,200.00", status: "Completed", type: "expense" },
];

export function TransactionTable() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground">Live transaction ledger and status tracking</p>
        </div>
        <button className="flex items-center gap-2 text-xs font-semibold text-foreground bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-lg border border-border transition-colors w-fit">
          <Download className="w-3.5 h-3.5" /> Export Ledger
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
              <th className="pb-3 px-2">Transaction</th>
              <th className="pb-3 px-2">Category</th>
              <th className="pb-3 px-2">Date</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Amount</th>
              <th className="pb-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-semibold text-foreground">{tx.merchant}</div>
                  <div className="text-[11px] text-muted-foreground">{tx.id}</div>
                </td>
                <td className="py-3 px-2 text-muted-foreground">{tx.category}</td>
                <td className="py-3 px-2 text-muted-foreground">{tx.date}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    tx.status === "Completed" ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`py-3 px-2 text-right font-numeric font-bold ${tx.type === "income" ? "text-[#16A34A]" : "text-foreground"}`}>
                  {tx.amount}
                </td>
                <td className="py-3 px-2 text-right">
                  <button className="text-muted-foreground hover:text-foreground p-1 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}