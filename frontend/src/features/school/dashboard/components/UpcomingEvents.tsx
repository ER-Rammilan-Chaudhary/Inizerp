"use client";

import { CalendarDays, MapPin } from "lucide-react";
import type { UpcomingEvent } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

const formatEventDate = (value: string) => {
  try {
    const d = new Date(value);
    const day = d.getDate();
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    return { day, month };
  } catch {
    return { day: "", month: "" };
  }
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Campus Events & Activities
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              School calendar extracurriculars & holidays
            </p>
          </div>

          <Badge variant="outline" className="text-xs">
            {events.length} Events
          </Badge>
        </div>

        {events.length === 0 ? (
          <div className="flex h-36 items-center justify-center text-xs text-muted-foreground">
            No upcoming events scheduled.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {events.slice(0, 4).map((event) => {
              const { day, month } = formatEventDate(event.startDate);

              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-muted/20 p-3.5 transition-colors hover:border-border"
                >
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <span className="text-xs font-bold leading-none">
                      {day}
                    </span>
                    <span className="text-[10px] font-semibold uppercase leading-none mt-0.5">
                      {month}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Full school events calendar</span>
        <span className="font-medium text-primary">View Calendar →</span>
      </div>
    </div>
  );
}