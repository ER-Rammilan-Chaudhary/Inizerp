"use client";

import { CalendarClock, Clock, MapPin, UserCheck } from "lucide-react";
import type { TodayScheduleItem } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface TodayScheduleProps {
  schedule: TodayScheduleItem[];
}

export default function TodaySchedule({ schedule }: TodayScheduleProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Today&apos;s Class Schedule
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active periods & live timetable allocation
          </p>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          {schedule.length} Periods Scheduled
        </span>
      </div>

      {schedule.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          No class periods scheduled for today.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schedule.map((item) => {
            const isOngoing = item.status?.toUpperCase() === "ONGOING";
            const isCompleted = item.status?.toUpperCase() === "COMPLETED";

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl border p-4 transition-all hover:border-border hover:shadow-xs ${
                  isOngoing
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/70 bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      P{item.period}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {item.subject?.name ?? "General Study"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.class?.name ?? "Class"}{" "}
                        {item.section?.name ? `(${item.section.name})` : ""}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-2 py-0.5 ${
                      isOngoing
                        ? "border-primary/40 bg-primary/10 text-primary animate-pulse"
                        : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border/80 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {item.status || "SCHEDULED"}
                  </Badge>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className=" text-[11px] text-foreground">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>

                  {item.roomNo && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Room {item.roomNo}</span>
                    </div>
                  )}
                </div>

                {item.teacher?.user?.fullName && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <UserCheck className="h-3 w-3 text-emerald-500" />
                    <span>Faculty: {item.teacher.user.fullName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}