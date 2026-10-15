"use client";

import type { AttendanceByClassItem } from "../types/school.types";

interface AttendanceByClassProps {
  data: AttendanceByClassItem[];
}

export default function AttendanceByClass({ data }: AttendanceByClassProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Class-wise Attendance Distribution
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Today&apos;s attendance breakdown per class batch
          </p>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          {data.length} Classes Active
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          No class attendance data available for today.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const pct = item.percentage ?? 0;
            const isHigh = pct >= 85;
            const isMedium = pct >= 70 && pct < 85;

            return (
              <div
                key={item.classId}
                className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2.5 transition-colors hover:border-border"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">
                    {item.className}
                  </span>
                  <span
                    className={` text-xs font-bold px-2 py-0.5 rounded-md ${
                      isHigh
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isMedium
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHigh
                        ? "bg-emerald-500"
                        : isMedium
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.max(pct, 0), 100)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.present} Present
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {item.absent} Absent
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
