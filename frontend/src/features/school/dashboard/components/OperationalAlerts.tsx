"use client";

import { AlertCircle, Bell, CircleAlert, Info } from "lucide-react";
import type { OperationalAlert } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface OperationalAlertsProps {
  alerts: OperationalAlert[];
}

const getAlertConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case "critical":
    case "error":
      return {
        icon: CircleAlert,
        border: "border-rose-500/30",
        bg: "bg-rose-500/5",
        text: "text-rose-600 dark:text-rose-400",
        badge: "bg-rose-500/10 text-rose-600 border-rose-500/30",
      };
    case "warning":
      return {
        icon: AlertCircle,
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        text: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      };
    default:
      return {
        icon: Info,
        border: "border-blue-500/30",
        bg: "bg-blue-500/5",
        text: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      };
  }
};

export default function OperationalAlerts({ alerts }: OperationalAlertsProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Operational Alerts
          </h2>
        </div>

        {alerts.length > 0 && (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
          >
            {alerts.length} Pending
          </Badge>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="mt-4 flex h-24 items-center justify-center text-xs text-muted-foreground">
          All systems & parameters running normally.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {alerts.map((alert, index) => {
            const config = getAlertConfig(alert.type);
            const Icon = config.icon;

            return (
              <div
                key={`${alert.type}-${alert.title}-${index}`}
                className={`rounded-xl border p-3.5 ${config.border} ${config.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.text}`} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground">
                        {alert.title}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${config.badge}`}
                      >
                        {alert.priority}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                      <span>Count: {alert.count}</span>
                      {alert.amount !== undefined && (
                        <span>Amount: ₹{alert.amount.toLocaleString("en-IN")}</span>
                      )}
                      {alert.percentage !== undefined && (
                        <span>Impact: {alert.percentage}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}