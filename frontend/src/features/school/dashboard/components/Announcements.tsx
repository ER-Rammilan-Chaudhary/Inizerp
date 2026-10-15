"use client";

import { Bell, Calendar, Megaphone } from "lucide-react";
import type { Announcement } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface AnnouncementsProps {
  announcements: Announcement[];
}

const formatDate = (value: string | null) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Campus Announcements
          </h2>
        </div>

        <Badge variant="outline" className="text-xs">
          {announcements.length} Active
        </Badge>
      </div>

      {announcements.length === 0 ? (
        <div className="mt-4 flex h-24 items-center justify-center text-xs text-muted-foreground">
          No active announcements.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {announcements.slice(0, 3).map((item) => {
            const publishedAt = formatDate(item.publishedAt);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1.5 transition-colors hover:border-border"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground truncate">
                    {item.title}
                  </p>
                  {publishedAt && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {publishedAt}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {item.message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}