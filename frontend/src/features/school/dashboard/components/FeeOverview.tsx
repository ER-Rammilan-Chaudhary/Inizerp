"use client";

import { AlertCircle, IndianRupee, Wallet, Clock3 } from "lucide-react";
import type { FeeData } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface FeeOverviewProps {
  fees: FeeData;
}

export default function FeeOverview({ fees }: FeeOverviewProps) {
  const realization = fees.summary?.realizationPercentage ?? 0;
  const paidPercentage =
    fees.total > 0 ? Math.min((fees.paid / fees.total) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Fee Collections
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Financial realization & outstanding balance
            </p>
          </div>

          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 text-xs"
          >
            {realization}% Realized
          </Badge>
        </div>

        {/* 3 Metric Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total Target
              </span>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">
              ₹{fees.total.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Collected
              </span>
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{fees.paid.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Pending
              </span>
              <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">
              ₹{fees.pending.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall Collection Progress</span>
            <span className="font-semibold text-foreground">
              {paidPercentage.toFixed(1)}% Completed
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overdue Banner */}
      <div className="mt-6 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
            <div>
              <span className="font-semibold text-foreground">
                Overdue Defaulters:
              </span>
              <span className="text-muted-foreground ml-1">
                {fees.summary?.overdueCount ?? 0} invoices past due date
              </span>
            </div>
          </div>

          <span className=" font-bold text-rose-600 dark:text-rose-400 shrink-0">
            ₹{(fees.summary?.overdue ?? 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}