"use client";

import { Calendar, CheckCircle2, Clock, Globe } from "lucide-react";
import type { AcademicYear, SchoolInfo } from "../types/school.types";
import { getImageUrl } from "@/lib/image-url";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  school: SchoolInfo;
  academicYear: AcademicYear | null;
}

export default function DashboardHeader({
  school,
  academicYear,
}: DashboardHeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      {/* Subtle decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: School Identity */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background shadow-xs">
            {school.logo ? (
              <img
                src={getImageUrl(school.logo)}
                alt={school.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
                {school.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {school.name}
              </h1>
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
              >
                <CheckCircle2 className="h-3 w-3" />
                {school.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className=" font-medium text-foreground">
                Code: {school.code}
              </span>
              {/* <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Currency: {school.currency}
              </span>
              {school.timezone && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {school.timezone}
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* Right: Academic Context & Date */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{todayFormatted}</span>
          </div>

          {academicYear && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Academic Session
                  </p>
                  <p className="text-xs text-center font-bold text-foreground">
                    {academicYear.code}
                  </p>
                </div>
                {/* <div className="text-right text-[11px] text-muted-foreground">
                  // {academicYear.startDate.slice(0, 4)} - {academicYear.endDate.slice(0, 4)}
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
