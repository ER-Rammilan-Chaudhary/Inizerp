"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
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
import { formatClassName, formatSectionName } from "@/lib/utils";
import { useStudents } from "@/features/school/students/hooks/useStudents";
import { useCreateEnrollment } from "../hooks/useEnrollments";

interface AcademicYearOption {
  id: string;
  name: string;
  code: string;
  isCurrent: boolean;
}

interface ClassOption {
  id: string;
  name: string;
}

interface SectionOption {
  id: string;
  name: string;
  classId: string;
}

interface NewEnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYears: AcademicYearOption[];
  classes: ClassOption[];
  sections: SectionOption[];
}

export function NewEnrollmentModal({
  open,
  onOpenChange,
  academicYears,
  classes,
  sections,
}: NewEnrollmentModalProps) {
  const [studentId, setStudentId] = useState("");
  const [academicYearId, setAcademicYearId] = useState(
    academicYears.find((y) => y.isCurrent)?.id ?? "",
  );
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [rollNo, setRollNo] = useState("");

  const { data: studentsData, isLoading: loadingStudents } = useStudents({
    limit: 100,
  });
  const students = studentsData?.data?.items ?? [];

  const availableSections = useMemo(
    () => sections.filter((s) => s.classId === classId),
    [sections, classId],
  );

  const createMutation = useCreateEnrollment();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toast.error("Please select a student");
      return;
    }
    if (!academicYearId) {
      toast.error("Please select an academic session");
      return;
    }
    if (!classId) {
      toast.error("Please select a class");
      return;
    }

    try {
      await createMutation.mutateAsync({
        studentId,
        academicYearId,
        classId,
        sectionId: sectionId || null,
        rollNo: rollNo.trim() || null,
      });

      toast.success("Student enrolled successfully!");
      onOpenChange(false);
      setStudentId("");
      setClassId("");
      setSectionId("");
      setRollNo("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to enroll student";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleEnroll}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">Enroll Existing Student</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a session-specific enrollment for a registered student.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Student selection */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Select Student *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="">
                  {loadingStudents ? "Loading students..." : "Choose a student"}
                </option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user.fullName} ({st.admissionNo})
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Session */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Academic Session *
              </label>
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Choose session</option>
                {academicYears.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} ({y.code}) {y.isCurrent ? "★ Current" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Class & Section */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Class *
                </label>
                <select
                  value={classId}
                  onChange={(e) => {
                    setClassId(e.target.value);
                    setSectionId("");
                  }}
                  required
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {formatClassName(c.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Section
                </label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  disabled={!classId}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs disabled:opacity-50"
                >
                  <option value="">No Section</option>
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {formatSectionName(s.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Roll Number
              </label>
              <Input
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 12"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enrolling...
                </>
              ) : (
                "Save Enrollment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
