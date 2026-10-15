"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  DoorClosed,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  User,
  Utensils,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type {
  PeriodMasterItem,
  Timetable,
  TimetableDay,
} from "../types/timetables.types";
import AssignPeriodModal from "./AssignPeriodModal";
import { useDeleteTimetable } from "../hooks/useTimetables";
import { getErrorMessage } from "@/lib/error-message";

interface SubjectOption {
  id: string;
  name: string;
  code?: string;
}

interface TeacherOption {
  id: string;
  employeeId?: string;
  designation?: string | null;
  user: {
    fullName: string;
    email: string;
  };
}

interface TimetableScheduleViewProps {
  periods: PeriodMasterItem[];
  timetables: Timetable[];
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId?: string | null;
  sectionName?: string | null;
  subjects: SubjectOption[];
  teachers: TeacherOption[];
  isLoading?: boolean;
}

const DAYS: { key: TimetableDay; label: string; short: string }[] = [
  { key: "MONDAY", label: "Monday", short: "Mon" },
  { key: "TUESDAY", label: "Tuesday", short: "Tue" },
  { key: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { key: "THURSDAY", label: "Thursday", short: "Thu" },
  { key: "FRIDAY", label: "Friday", short: "Fri" },
  { key: "SATURDAY", label: "Saturday", short: "Sat" },
];

export default function TimetableScheduleView({
  periods,
  timetables,
  academicYearId,
  academicYearName,
  classId,
  className,
  sectionId,
  sectionName,
  subjects,
  teachers,
  isLoading = false,
}: TimetableScheduleViewProps) {
  // Default to today's day of week or MONDAY
  const [selectedDay, setSelectedDay] = useState<TimetableDay>(() => {
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
    const map: Record<number, TimetableDay> = {
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
    };
    return map[todayIndex] ?? "MONDAY";
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodMasterItem | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Timetable | null>(null);

  const deleteMutation = useDeleteTimetable();

  // Index existing assignments for the selected class, section, and day
  // Key format: periodNumber (number)
  const assignmentsByPeriod = useMemo(() => {
    const map = new Map<number, Timetable>();

    for (const item of timetables) {
      if (item.day !== selectedDay) continue;
      if (item.classId !== classId) continue;
      if (sectionId && item.sectionId && item.sectionId !== sectionId) continue;

      map.set(item.period, item);
    }

    return map;
  }, [timetables, selectedDay, classId, sectionId]);

  // Regular lecture periods count
  const regularPeriods = useMemo(
    () => periods.filter((p) => p.type === "REGULAR" && p.periodNumber !== null),
    [periods],
  );

  const totalPeriodsCount = regularPeriods.length;

  const assignedCount = useMemo(() => {
    let count = 0;
    for (const p of regularPeriods) {
      if (p.periodNumber && assignmentsByPeriod.has(p.periodNumber)) {
        count++;
      }
    }
    return count;
  }, [regularPeriods, assignmentsByPeriod]);

  const unassignedCount = Math.max(0, totalPeriodsCount - assignedCount);
  const completionPercentage =
    totalPeriodsCount > 0 ? Math.round((assignedCount / totalPeriodsCount) * 100) : 0;

  // Day counts for tabs badge
  const dayStats = useMemo(() => {
    const stats: Record<TimetableDay, number> = {
      MONDAY: 0,
      TUESDAY: 0,
      WEDNESDAY: 0,
      THURSDAY: 0,
      FRIDAY: 0,
      SATURDAY: 0,
    };

    for (const item of timetables) {
      if (item.classId !== classId) continue;
      if (sectionId && item.sectionId && item.sectionId !== sectionId) continue;
      if (stats[item.day] !== undefined) {
        stats[item.day]++;
      }
    }

    return stats;
  }, [timetables, classId, sectionId]);

  // Handlers
  const handleAssignClick = (period: PeriodMasterItem) => {
    setActivePeriod(period);
    setActiveAssignment(null);
    setModalOpen(true);
  };

  const handleEditClick = (period: PeriodMasterItem, assignment: Timetable) => {
    setActivePeriod(period);
    setActiveAssignment(assignment);
    setModalOpen(true);
  };

  const handleDeleteAssignment = async (assignmentId: string, periodName: string) => {
    if (!window.confirm(`Are you sure you want to clear assignment for ${periodName}?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(assignmentId);
      toast.success(`${periodName} schedule cleared`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to clear assignment"));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Periods */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Periods
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {totalPeriodsCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Fixed lecture slots per day
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Assigned */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Assigned
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                {assignedCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Subject & teacher assigned
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Unassigned */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Unassigned
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
                {unassignedCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Requires assignment
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
              <HelpCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress Bar */}
      <div className="rounded-xl border bg-card/60 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>
              {DAYS.find((d) => d.key === selectedDay)?.label} Schedule Completion
            </span>
          </span>
          <span className=" font-bold text-foreground">
            {assignedCount} / {totalPeriodsCount} Periods ({completionPercentage}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. DAY TABS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border bg-muted/40">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day.key;
          const assignedOnDay = dayStats[day.key];
          const isComplete = assignedOnDay === totalPeriodsCount && totalPeriodsCount > 0;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDay(day.key)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isSelected
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
            >
              <span>{day.label}</span>
              <span
                className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] ${isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : isComplete
                    ? "bg-emerald-500/15 text-emerald-600 font-bold"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {assignedOnDay}/{totalPeriodsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. TIMETABLE SCHEDULE TABLE */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        {/* Table Header Summary */}
        <div className="px-5 py-3.5 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {DAYS.find((d) => d.key === selectedDay)?.label} Timetable
            </span>
            <Badge variant="outline" className="text-xs font-normal">
              Class {className || "Selected Class"} {sectionName ? `(${sectionName})` : ""}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Selected day ka timetable show ho raha hai
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-16">No.</th>
                <th className="px-4 py-3.5 w-36">Time</th>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Teacher</th>
                <th className="px-4 py-3.5">Room</th>
                <th className="px-4 py-3.5 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {periods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                    No periods configured in Period Master. Click &quot; Add Period&quot; at the top.
                  </td>
                </tr>
              ) : (
                periods.map((item) => {
                  const isBreak = item.type === "BREAK";
                  const isLunch = item.type === "LUNCH";
                  const isRegular = item.type === "REGULAR";

                  // Check if assignment exists
                  const assignment =
                    item.periodNumber !== null && item.periodNumber !== undefined
                      ? assignmentsByPeriod.get(item.periodNumber)
                      : null;

                  const isAssigned = Boolean(assignment);

                  // Row: Break / Lunch Row
                  if (isBreak || isLunch) {
                    return (
                      <tr
                        key={item.id}
                        className={`${isBreak
                          ? "bg-amber-500/10 dark:bg-amber-950/20"
                          : "bg-orange-500/10 dark:bg-orange-950/20"
                          } font-medium`}
                      >
                        {/* No. */}
                        <td className="px-4 py-3 text-center">
                          {isBreak ? (
                            <span className="text-sm">☕</span>
                          ) : (
                            <span className="text-sm">🍱</span>
                          )}
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3 text-xs font-bold text-foreground">
                          {item.startTime} – {item.endTime}
                        </td>

                        {/* Subject (Break Label) */}
                        <td className="px-4 py-3 font-bold text-foreground tracking-wide">
                          {isBreak ? `☕ ${item.name.toUpperCase()}` : `🍱 ${item.name.toUpperCase()}`}
                        </td>

                        {/* Teacher */}
                        <td className="px-4 py-3 text-muted-foreground text-xs">—</td>

                        {/* Room */}
                        <td className="px-4 py-3 text-muted-foreground text-xs">—</td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-semibold ${isBreak
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                              : "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30"
                              }`}
                          >
                            {isBreak ? "Recess" : "Lunch"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  }

                  // Row: Regular Lecture Row
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-muted/30 transition-colors ${isAssigned ? "bg-card" : "bg-muted/5"
                        }`}
                    >
                      {/* No. */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary font-bold text-xs shadow-2xs">
                          {item.periodNumber ? `P${item.periodNumber}` : "•"}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3.5 text-xs text-foreground font-semibold">
                        {item.startTime} – {item.endTime}
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5">
                        {isAssigned && assignment ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm">
                              {assignment.subject.name}
                            </span>
                            {assignment.subject.code && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {assignment.subject.code}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs italic">
                            <span>— Not Assigned</span>
                          </div>
                        )}
                      </td>

                      {/* Teacher */}
                      <td className="px-4 py-3.5">
                        {isAssigned && assignment ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {assignment.teacher.user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {assignment.teacher.user.fullName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Room */}
                      <td className="px-4 py-3.5">
                        {isAssigned && assignment?.roomNo ? (
                          <Badge variant="secondary" className=" text-[11px] gap-1">
                            <DoorClosed className="h-3 w-3 text-muted-foreground" />
                            <span>{assignment.roomNo}</span>
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        {isAssigned && assignment ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(item, assignment)}
                              className="h-8 px-2 text-xs text-primary hover:bg-primary/10"
                              title="Edit Assignment"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteAssignment(
                                  assignment.id,
                                  `Period ${item.periodNumber}`,
                                )
                              }
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                              title="Clear / Unassign"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignClick(item)}
                            className="h-7 px-2.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground gap-1 transition-all"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>+ Assign</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN PERIOD MODAL */}
      <AssignPeriodModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        period={activePeriod}
        day={selectedDay}
        academicYearId={academicYearId}
        academicYearName={academicYearName}
        classId={classId}
        className={className}
        sectionId={sectionId}
        sectionName={sectionName}
        currentAssignment={activeAssignment}
        subjects={subjects}
        teachers={teachers}
      />
    </div>
  );
}
