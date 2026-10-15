"use client";

import { ArrowRight, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import type { AdmissionsData } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface AdmissionsOverviewProps {
  admissions: AdmissionsData;
}

export default function AdmissionsOverview({
  admissions,
}: AdmissionsOverviewProps) {
  const pending = admissions.pending ?? 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Admissions Pipeline
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              New enrollment applications review
            </p>
          </div>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary font-bold text-xs"
          >
            Session 2026-27
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Pending Applications
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-foreground">
              {pending.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/60">
        <Link
          href="/school-admin/admissions"
          className="flex items-center justify-between text-xs font-semibold text-primary hover:underline"
        >
          <span>Review Application Desk</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}