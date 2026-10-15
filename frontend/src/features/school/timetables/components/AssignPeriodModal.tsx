"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarDays,
  Clock,
  DoorClosed,
  GraduationCap,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import type {
  CreateTimetablePayload,
  PeriodMasterItem,
  Timetable,
  TimetableDay,
} from "../types/timetables.types";
import { useUpsertTimetable } from "../hooks/useTimetables";
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

interface AssignPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: PeriodMasterItem | null;
  day: TimetableDay;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId?: string | null;
  sectionName?: string | null;
  currentAssignment?: Timetable | null;
  subjects: SubjectOption[];
  teachers: TeacherOption[];
  onSuccess?: () => void;
}

export default function AssignPeriodModal({
  open,
  onOpenChange,
  period,
  day,
  academicYearId,
  academicYearName,
  classId,
  className,
  sectionId,
  sectionName,
  currentAssignment,
  subjects,
  teachers,
  onSuccess,
}: AssignPeriodModalProps) {
  const upsertMutation = useUpsertTimetable();

  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [roomNo, setRoomNo] = useState("");

  useEffect(() => {
    if (open) {
      if (currentAssignment) {
        setSubjectId(currentAssignment.subjectId);
        setTeacherId(currentAssignment.teacherId);
        setRoomNo(currentAssignment.roomNo ?? "");
      } else {
        setSubjectId("");
        setTeacherId("");
        setRoomNo("");
      }
    }
  }, [open, currentAssignment]);

  if (!period) return null;

  const isEditing = Boolean(currentAssignment);
  const periodLabel = period.periodNumber ? `Period ${period.periodNumber}` : period.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId) {
      toast.error("Please select a subject");
      return;
    }

    if (!teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    if (!classId) {
      toast.error("Class is required");
      return;
    }

    if (!period.periodNumber) {
      toast.error("Cannot assign lecture to a Break or Lunch period");
      return;
    }

    const payload: CreateTimetablePayload = {
      academicYearId: academicYearId || null,
      classId,
      sectionId: sectionId || null,
      day,
      period: period.periodNumber,
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId,
      teacherId,
      roomNo: roomNo.trim() || null,
    };

    try {
      await upsertMutation.mutateAsync(payload);
      toast.success(
        isEditing
          ? `${periodLabel} updated successfully!`
          : `${periodLabel} assigned successfully!`,
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save timetable assignment"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                {period.periodNumber ? `P${period.periodNumber}` : "•"}
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {isEditing ? `Edit ${periodLabel}` : `Assign ${periodLabel}`}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Configure the subject, teacher, and room for this schedule slot.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Context Badges */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3 text-xs">
            <Badge variant="outline" className="bg-background gap-1 font-normal">
              <CalendarDays className="h-3 w-3 text-primary" />
              <span className="capitalize">{day.toLowerCase()}</span>
            </Badge>

            <Badge variant="outline" className="bg-background gap-1 font-normal">
              <Clock className="h-3 w-3 text-primary" />
              <span>
                {period.startTime} – {period.endTime}
              </span>
            </Badge>

            <Badge variant="outline" className="bg-background gap-1 font-normal">
              <GraduationCap className="h-3 w-3 text-primary" />
              <span>Class {className || "-"}</span>
              {sectionName && <span className="text-muted-foreground">({sectionName})</span>}
            </Badge>

            {academicYearName && (
              <span className="text-[11px] text-muted-foreground ml-auto">
                Session: {academicYearName}
              </span>
            )}
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Subject Field */}
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-semibold flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>Subject</span>
                <span className="text-destructive">*</span>
              </Label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.code ? `(${sub.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Field */}
            <div className="space-y-1.5">
              <Label htmlFor="teacher" className="text-xs font-semibold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Teacher</span>
                <span className="text-destructive">*</span>
              </Label>
              <select
                id="teacher"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((tch) => (
                  <option key={tch.id} value={tch.id}>
                    {tch.user.fullName} {tch.designation ? `• ${tch.designation}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Number Field */}
            <div className="space-y-1.5">
              <Label htmlFor="roomNo" className="text-xs font-semibold flex items-center gap-1.5">
                <DoorClosed className="h-3.5 w-3.5 text-primary" />
                <span>Room / Classroom / Lab</span>
                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="roomNo"
                placeholder="e.g. Room 101, Lab 1, Library"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                maxLength={50}
                className="h-9"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={upsertMutation.isPending}
              className="gap-1.5"
            >
              {upsertMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{isEditing ? "Save Changes" : "Assign Period"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
