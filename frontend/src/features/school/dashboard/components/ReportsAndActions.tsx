"use client";

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  IndianRupee,
  Megaphone,
  Plus,
  Receipt,
  School,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { DashboardReport, QuickAction } from "../types/school.types";

interface ReportsAndActionsProps {
  reports: DashboardReport[];
  quickActions: QuickAction[];
}

const reportIcons: Record<string, typeof FileText> = {
  ATTENDANCE_PDF: ClipboardCheck,
  FEE_DEFAULTER_EXCEL: FileSpreadsheet,
  ACADEMIC_CALENDAR: CalendarDays,
};

const reportRoutes: Record<string, string> = {
  ATTENDANCE_PDF: "/school-admin/attendance",
  FEE_DEFAULTER_EXCEL: "/school-admin/fees",
  ACADEMIC_CALENDAR: "/school-admin/academic-years",
};

const actionIcons: Record<string, typeof Plus> = {
  NEW_ADMISSION: UserPlus,
  COLLECT_FEE: IndianRupee,
  MARK_ATTENDANCE: ClipboardCheck,
  PUBLISH_NOTICE: Megaphone,
  SCHEDULE_EXAM: School,
  TRACK_BUSES: Receipt,
};

const actionRoutes: Record<string, string> = {
  NEW_ADMISSION: "/school-admin/admissions",
  COLLECT_FEE: "/school-admin/payments",
  MARK_ATTENDANCE: "/school-admin/attendance",
  PUBLISH_NOTICE: "/school-admin/announcements",
  SCHEDULE_EXAM: "/school-admin/exams",
  TRACK_BUSES: "/school-admin/transport",
};

export default function ReportsAndActions({
  reports,
  quickActions,
}: ReportsAndActionsProps) {
  const router = useRouter();

  const handleReport = (key: string, available: boolean) => {
    if (!available) return;
    const route = reportRoutes[key];
    if (route) router.push(route);
  };

  const handleQuickAction = (key: string) => {
    const route = actionRoutes[key];
    if (route) router.push(route);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Quick Actions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instant operational shortcuts
          </p>
        </div>

        {quickActions.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
            No quick actions configured.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {quickActions.map((action) => {
              const Icon = actionIcons[action.key] ?? Plus;
              const route = actionRoutes[action.key];

              return (
                <button
                  key={action.key}
                  type="button"
                  disabled={!route}
                  onClick={() => handleQuickAction(action.key)}
                  className="group flex flex-col items-start justify-between rounded-xl border border-border/70 bg-muted/20 p-3 text-left transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-foreground leading-tight">
                    {action.title}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Reports Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Standard Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            1-Click downloadable institutional sheets
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
            No standard reports available.
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {reports.map((report) => {
              const Icon = reportIcons[report.key] ?? BarChart3;
              const route = reportRoutes[report.key];

              return (
                <div
                  key={report.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-border"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {report.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {report.type}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!report.available || !route}
                    onClick={() => handleReport(report.key, report.available)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                  >
                    View
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
