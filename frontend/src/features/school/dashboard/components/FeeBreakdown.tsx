"use client";

import type { FeeBreakdownItem } from "../types/school.types";

interface FeeBreakdownProps {
  data: FeeBreakdownItem[];
}

export default function FeeBreakdown({ data }: FeeBreakdownProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Fee Category Breakdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Collections categorized by fee ledger types
            </p>
          </div>

          <span className="text-xs font-semibold text-muted-foreground">
            {data.length} Categories
          </span>
        </div>

        {data.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground">
            No fee categories mapped yet.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {data.slice(0, 5).map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground ml-2 text-[11px]">
                      ₹{item.paid.toLocaleString("en-IN")} paid · ₹
                      {item.pending.toLocaleString("en-IN")} due
                    </span>
                  </div>

                  <span className=" font-bold text-foreground">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.max(item.percentage, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Verified against automated bank allocations</span>
        <span className="font-medium text-primary">View Ledger →</span>
      </div>
    </div>
  );
}