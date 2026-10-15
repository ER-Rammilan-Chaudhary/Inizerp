"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses } from "@/features/school/classes/hooks/useClasses";
import {
  useDeleteEnrollment,
  useEnrollments,
  useUpdateEnrollment,
} from "@/features/school/enrollments/hooks/useEnrollments";
import { EnrollmentFilters } from "@/features/school/enrollments/components/EnrollmentFilters";
import { EnrollmentTable } from "@/features/school/enrollments/components/EnrollmentTable";
import { StudentPromotionModal } from "@/features/school/enrollments/components/StudentPromotionModal";
import { NewEnrollmentModal } from "@/features/school/enrollments/components/NewEnrollmentModal";
import type {
  EnrollmentListParams,
  EnrollmentStatus,
} from "@/features/school/enrollments/types/enrollments.types";

export default function EnrollmentsPage() {
  const [filters, setFilters] = useState<EnrollmentListParams>({});
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [newEnrollmentModalOpen, setNewEnrollmentModalOpen] = useState(false);

  // Queries
  const { data: yearsData } = useAcademicYears();
  const academicYears = yearsData?.data ?? [];

  const { data: classesData } = useClasses();
  const classes = classesData?.data ?? [];

  // Extract all sections from classes
  const allSections = useMemo(() => {
    return classes.flatMap((cls) =>
      (cls.sections ?? []).map((sec) => ({
        id: sec.id,
        name: sec.name,
        classId: cls.id,
      })),
    );
  }, [classes]);

  const { data: enrollmentsData, isLoading } = useEnrollments(filters);
  const enrollments = enrollmentsData?.data ?? [];

  // Mutations
  const updateMutation = useUpdateEnrollment();
  const deleteMutation = useDeleteEnrollment();

  const handleStatusChange = async (id: string, status: EnrollmentStatus) => {
    try {
      await updateMutation.mutateAsync({ id, payload: { status } });
      toast.success(`Enrollment marked as ${status}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to withdraw and remove this enrollment record?")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Enrollment removed");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove enrollment";
      toast.error(msg);
    }
  };

  // Metrics
  const activeCount = useMemo(
    () => enrollments.filter((e) => e.status === "ACTIVE").length,
    [enrollments],
  );
  const completedCount = useMemo(
    () => enrollments.filter((e) => e.status === "COMPLETED").length,
    [enrollments],
  );
  const currentSession = useMemo(
    () => academicYears.find((y) => y.isCurrent),
    [academicYears],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Student Enrollments & Promotion
            </h1>
            {currentSession && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <CalendarDays className="h-3 w-3" />
                {currentSession.code}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student session-wise grade placement and batch promotions to preserve full academic history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setNewEnrollmentModalOpen(true)}
            className="gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Student</span>
          </Button>

          <Button
            type="button"
            onClick={() => setPromotionModalOpen(true)}
            className="gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            <span>Promote Students</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Enrollments</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{enrollments.length}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active In Session</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">{activeCount}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Promoted / Completed</p>
              <h3 className="text-2xl font-bold mt-1 text-blue-600">{completedCount}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Academic Years</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{academicYears.length}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <EnrollmentFilters
        filters={filters}
        onChange={setFilters}
        academicYears={academicYears}
        classes={classes}
        sections={allSections}
      />

      {/* Main Table */}
      <EnrollmentTable
        enrollments={enrollments}
        loading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* Batch Student Promotion Modal */}
      <StudentPromotionModal
        open={promotionModalOpen}
        onOpenChange={setPromotionModalOpen}
        academicYears={academicYears}
        classes={classes}
        sections={allSections}
      />

      {/* New Individual Enrollment Modal */}
      <NewEnrollmentModal
        open={newEnrollmentModalOpen}
        onOpenChange={setNewEnrollmentModalOpen}
        academicYears={academicYears}
        classes={classes}
        sections={allSections}
      />
    </div>
  );
}
