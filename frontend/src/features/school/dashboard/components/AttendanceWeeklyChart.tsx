"use client";

import type { AttendanceWeeklyItem } from "../types/school.types";

interface AttendanceWeeklyChartProps {
  weekly: AttendanceWeeklyItem[];
}

export default function AttendanceWeeklyChart({
  weekly,
}: AttendanceWeeklyChartProps) {
  const data = [...weekly];

  const maxTotal = Math.max(
    ...data.map((item) => item.total),
    1
  );

  const avgPercentage =
    weekly.length > 0
      ? (
          weekly.reduce((sum, item) => sum + item.percentage, 0) / weekly.length
        ).toFixed(1)
      : "0";

  const highestDay =
    weekly.length > 0
      ? Math.max(...weekly.map((item) => item.percentage))
      : 0;

  const totalPresent = weekly.reduce((sum, item) => sum + item.present, 0);
  const totalAbsent = weekly.reduce((sum, item) => sum + item.absent, 0);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Weekly Attendance Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily turnout performance (Past 7 days)
            </p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground">
            No weekly attendance records logged yet.
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex h-40 items-end gap-2.5 sm:gap-3.5">
              {data.map((item) => {
                const height =
                  item.total > 0
                    ? Math.max((item.total / maxTotal) * 100, 12)
                    : 6;

                return (
                  <div
                    key={item.date}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-full max-w-9 rounded-t-lg bg-primary/75 group-hover:bg-primary transition-all duration-300"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-foreground">
                        {item.day}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">
            Average
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {avgPercentage}%
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">
            Highest
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {highestDay}%
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">
            Total Present
          </p>
          <p className="mt-1 text-sm font-bold text-primary">
            {totalPresent.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">
            Total Absent
          </p>
          <p className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-400">
            {totalAbsent.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
