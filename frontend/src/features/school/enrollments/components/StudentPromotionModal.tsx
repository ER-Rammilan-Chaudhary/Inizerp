"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, Sparkles, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrollments, usePromoteStudents } from "../hooks/useEnrollments";

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

interface StudentPromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYears: AcademicYearOption[];
  classes: ClassOption[];
  sections: SectionOption[];
}

export function StudentPromotionModal({
  open,
  onOpenChange,
  academicYears,
  classes,
  sections,
}: StudentPromotionModalProps) {
  // Source Session & Class
  const [sourceYearId, setSourceYearId] = useState<string>("");
  const [sourceClassId, setSourceClassId] = useState<string>("");
  const [sourceSectionId, setSourceSectionId] = useState<string>("");

  // Target Session & Class
  const [targetYearId, setTargetYearId] = useState<string>("");
  const [targetClassId, setTargetClassId] = useState<string>("");
  const [targetSectionId, setTargetSectionId] = useState<string>("");

  // Selected student IDs for promotion
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Fetch students currently enrolled in the source session/class
  const { data: sourceEnrollmentsData, isLoading: loadingSourceStudents } =
    useEnrollments(
      sourceYearId && sourceClassId
        ? {
            academicYearId: sourceYearId,
            classId: sourceClassId,
            sectionId: sourceSectionId || undefined,
            status: "ACTIVE",
          }
        : undefined,
    );

  const sourceEnrollments = sourceEnrollmentsData?.data ?? [];

  // Filter sections for target class
  const targetClassSections = useMemo(
    () => sections.filter((s) => s.classId === targetClassId),
    [sections, targetClassId],
  );

  // Filter sections for source class
  const sourceClassSections = useMemo(
    () => sections.filter((s) => s.classId === sourceClassId),
    [sections, sourceClassId],
  );

  const promoteMutation = usePromoteStudents();

  const handleSelectAll = () => {
    if (selectedStudentIds.length === sourceEnrollments.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(sourceEnrollments.map((e) => e.studentId));
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handlePromote = async () => {
    if (!sourceYearId || !targetYearId) {
      toast.error("Please select both source and target academic sessions");
      return;
    }

    if (sourceYearId === targetYearId) {
      toast.error("Source and target academic sessions must be different");
      return;
    }

    if (!targetClassId) {
      toast.error("Please select the target class to promote into");
      return;
    }

    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least one student to promote");
      return;
    }

    try {
      const promotions = selectedStudentIds.map((studentId) => {
        const enrollment = sourceEnrollments.find(
          (e) => e.studentId === studentId,
        );
        return {
          studentId,
          targetClassId,
          targetSectionId: targetSectionId || null,
          rollNo: enrollment?.rollNo || null,
        };
      });

      const response = await promoteMutation.mutateAsync({
        sourceAcademicYearId: sourceYearId,
        targetAcademicYearId: targetYearId,
        promotions,
      });

      toast.success(
        response.message ||
          `Successfully promoted ${selectedStudentIds.length} student(s)!`,
      );
      setSelectedStudentIds([]);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to promote students";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Promote Students to Next Session</DialogTitle>
              <DialogDescription className="text-xs">
                Batch promote students from current academic session to new session without altering past records.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Two-Column Promotion Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/20">
            {/* FROM: SOURCE */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                From (Current Record)
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Current Session *
                </label>
                <select
                  value={sourceYearId}
                  onChange={(e) => {
                    setSourceYearId(e.target.value);
                    setSelectedStudentIds([]);
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select Source Session</option>
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} ({y.code}) {y.isCurrent ? "★ Current" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Current Class *
                </label>
                <select
                  value={sourceClassId}
                  onChange={(e) => {
                    setSourceClassId(e.target.value);
                    setSourceSectionId("");
                    setSelectedStudentIds([]);
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select Source Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Class {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Current Section (Optional)
                </label>
                <select
                  value={sourceSectionId}
                  onChange={(e) => {
                    setSourceSectionId(e.target.value);
                    setSelectedStudentIds([]);
                  }}
                  disabled={!sourceClassId}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs disabled:opacity-50"
                >
                  <option value="">All Sections</option>
                  {sourceClassSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TO: TARGET */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                To (New Placement)
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Target Session *
                </label>
                <select
                  value={targetYearId}
                  onChange={(e) => setTargetYearId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select Target Session</option>
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} ({y.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Promoted Class *
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => {
                    setTargetClassId(e.target.value);
                    setTargetSectionId("");
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select Target Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Class {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Target Section (Optional)
                </label>
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  disabled={!targetClassId}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs disabled:opacity-50"
                >
                  <option value="">Assign Later / None</option>
                  {targetClassSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Selection List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">
                  Students Available ({sourceEnrollments.length})
                </span>
                {selectedStudentIds.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedStudentIds.length} Selected
                  </Badge>
                )}
              </div>

              {sourceEnrollments.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {selectedStudentIds.length === sourceEnrollments.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              )}
            </div>

            {loadingSourceStudents ? (
              <div className="p-8 text-center text-sm text-muted-foreground border rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                Loading students from selected class...
              </div>
            ) : !sourceYearId || !sourceClassId ? (
              <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                Select both a Current Session and Current Class above to load eligible students.
              </div>
            ) : sourceEnrollments.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                No active students found in the selected session and class.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto rounded-lg border divide-y">
                {sourceEnrollments.map((item) => {
                  const isSelected = selectedStudentIds.includes(item.studentId);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/40 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStudent(item.studentId)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {item.student?.user?.fullName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="">{item.student?.admissionNo}</span>
                            <span>•</span>
                            <span>Roll: {item.rollNo || "-"}</span>
                            <span>•</span>
                            <span>{item.section ? `Sec ${item.section.name}` : "No Sec"}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="text-emerald-600 flex items-center gap-1 text-xs font-medium">
                          <Check className="h-3.5 w-3.5" />
                          <span>Will be promoted</span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={promoteMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handlePromote}
            disabled={
              promoteMutation.isPending ||
              selectedStudentIds.length === 0 ||
              !targetYearId ||
              !targetClassId
            }
            className="gap-2"
          >
            {promoteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Promoting...
              </>
            ) : (
              <>
                <span>Promote {selectedStudentIds.length} Student(s)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
