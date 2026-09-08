"use client";

interface TopListsProps {
  topVendors?: Array<{ name: string; amount: string; percentage: number }>;
}

export function TopLists({ topVendors = [] }: TopListsProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-fin-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-foreground">Top 5 Vendors</h3>
        <p className="text-xs text-muted-foreground mb-4">Highest spending allocation by provider</p>
      </div>

      {topVendors.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">No vendor allocations in DB.</p>
      ) : (
        <div className="space-y-4">
          {topVendors.map((vendor, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground truncate max-w-[160px]">{vendor.name}</span>
                <span className="font-numeric text-foreground">{vendor.amount}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B63F6] rounded-full transition-all duration-500"
                  style={{ width: `${vendor.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}