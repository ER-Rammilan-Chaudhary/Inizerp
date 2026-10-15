"use client";

import { CreditCard, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPlan } from "../types/plan.types";

interface PlanStatsProps {
  plans: SubscriptionPlan[];
  total: number;
}

export default function PlanStats({ plans, total }: PlanStatsProps) {
  const activeCount = plans.filter((p) => p.isActive).length;
  const inactiveCount = plans.filter((p) => !p.isActive).length;

  const avgPrice =
    plans.length > 0
      ? (
          plans.reduce((sum, p) => sum + Number(p.price || 0), 0) / plans.length
        ).toFixed(0)
      : "0";

  const stats = [
    {
      title: "Total Plans",
      value: total,
      description: "Active & drafted tiers",
      icon: CreditCard,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Active Tiers",
      value: activeCount,
      description: "Available for new schools",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Inactive Plans",
      value: inactiveCount,
      description: "Archived / hidden tiers",
      icon: XCircle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Average Price",
      value: `₹${avgPrice}`,
      description: "Per billing cycle",
      icon: TrendingUp,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="overflow-hidden border border-border/80 shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
