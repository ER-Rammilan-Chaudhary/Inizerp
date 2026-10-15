"use client";

import { CalendarCheck, Clock3, UserCheck, UserX } from "lucide-react";
import type { AttendanceData } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface AttendanceOverviewProps {
  attendance: AttendanceData;
}

const stats = [
  {
    key: "present",
    label: "Present",
    icon: UserCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    key: "absent",
    label: "Absent",
    icon: UserX,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    key: "late",
    label: "Late Arrival",
    icon: Clock3,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    key: "leave",
    label: "Approved Leave",
    icon: CalendarCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
] as const;

export default function AttendanceOverview({
  attendance,
}: AttendanceOverviewProps) {
  const percentage = attendance.percentage ?? 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Today&apos;s Attendance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live campus presence ratio
            </p>
          </div>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
          >
            {percentage}% Present
          </Badge>
        </div>

        {/* 4 Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((item) => {
            const Icon = item.icon;
            const value = attendance[item.key] ?? 0;

            return (
              <div
                key={item.key}
                className={`rounded-xl border p-3.5 ${item.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                  {value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Footer */}
      <div className="mt-6 pt-4 border-t border-border/60">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Total Attendance Recorded
          </span>
          <span className="font-semibold text-foreground">
            {attendance.total.toLocaleString()} Students
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(percentage, 0), 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
