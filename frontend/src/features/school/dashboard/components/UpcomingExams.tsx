"use client";

import { CalendarDays, GraduationCap } from "lucide-react";
import type { UpcomingExam } from "../types/school.types";
import { Badge } from "@/components/ui/badge";

interface UpcomingExamsProps {
  exams: UpcomingExam[];
}

const formatDate = (value: string) => {
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

export default function UpcomingExams({ exams }: UpcomingExamsProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Upcoming Examinations
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scheduled term & unit assessments
            </p>
          </div>

          <Badge variant="outline" className="text-xs">
            {exams.length} Scheduled
          </Badge>
        </div>

        {exams.length === 0 ? (
          <div className="flex h-36 items-center justify-center text-xs text-muted-foreground">
            No examinations scheduled in the current calendar.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {exams.slice(0, 4).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5 transition-colors hover:border-border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {exam.name}
                    </p>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {exam.examType}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {formatDate(exam.startDate)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    to {formatDate(exam.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>View assessment weightages</span>
        <span className="font-medium text-primary">Exam Portal →</span>
      </div>
    </div>
  );
}