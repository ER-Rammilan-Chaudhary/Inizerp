"use client";

import {
  Activity,
  CreditCard,
  FileText,
  Megaphone,
  UserPlus,
} from "lucide-react";
import type { LiveFeedItem } from "../types/school.types";

interface LiveFeedProps {
  data: LiveFeedItem[];
}

const getFeedIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "payment":
      return {
        icon: CreditCard,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
      };
    case "admission":
      return {
        icon: UserPlus,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
      };
    case "announcement":
      return {
        icon: Megaphone,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
      };
    case "notice":
      return {
        icon: FileText,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
      };
    default:
      return {
        icon: Activity,
        color: "text-primary",
        bg: "bg-primary/10",
      };
  }
};

const formatTimestamp = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function LiveFeed({ data }: LiveFeedProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Live Activity Feed
          </h2>
        </div>

        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {data.length === 0 ? (
        <div className="mt-4 flex h-24 items-center justify-center text-xs text-muted-foreground">
          No recent campus activities logged.
        </div>
      ) : (
        <div className="mt-4 space-y-3.5">
          {data.slice(0, 5).map((item) => {
            const config = getFeedIcon(item.type);
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {item.description}
                  </p>

                  {item.amount !== undefined && (
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      +₹{item.amount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}