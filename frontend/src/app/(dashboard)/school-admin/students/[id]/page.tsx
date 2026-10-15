"use client";

import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Pencil,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import StudentDetails from "@/features/school/students/components/StudentDetails";
import {
    studentKeys,
    useStudent,
} from "@/features/school/students/hooks/useStudents";
import {
    enrollmentKeys,
    useUpdateEnrollment,
} from "@/features/school/enrollments/hooks/useEnrollments";

export default function StudentDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const studentId = params.id;

    const queryClient = useQueryClient();
    const studentQuery = useStudent(studentId);
    const updateEnrollment = useUpdateEnrollment();

    const handleBack = () => {
        router.push("/school-admin/students");
    };

    const handleEdit = () => {
        if (!studentId) return;
        router.push(`/school-admin/students/${studentId}/edit`);
    };

    const handleReactivate = async () => {
        const targetEnrollment = studentQuery.data?.data?.enrollments?.[0];
        if (!targetEnrollment?.id || !studentId) return;
        try {
            await updateEnrollment.mutateAsync({
                id: targetEnrollment.id,
                payload: { status: "ACTIVE" },
            });
            await queryClient.invalidateQueries({
                queryKey: studentKeys.detail(studentId),
            });
            await queryClient.invalidateQueries({
                queryKey: studentKeys.lists(),
            });
            await queryClient.invalidateQueries({
                queryKey: enrollmentKeys.all,
            });
            toast.success("Student successfully reactivated!");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to reactivate student";
            toast.error(message);
        }
    };

    if (studentQuery.isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
                <div className="h-64 rounded-xl border bg-card animate-pulse" />
            </div>
        );
    }

    if (studentQuery.isError || !studentQuery.data?.data) {
        return (
            <div className="w-full space-y-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h3 className="font-semibold text-destructive">
                        Student Profile Not Found
                    </h3>
                    <p className="text-sm text-destructive/80 mt-1">
                        Student record not found or could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const student = studentQuery.data.data;
    const hasActiveEnrollment = Boolean(
        student.enrollments?.some((item) => item.status === "ACTIVE"),
    );
    const latestEnrollment = student.enrollments?.[0];
    const isWithdrawn =
        !hasActiveEnrollment && latestEnrollment?.status === "WITHDRAWN";

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {student.user.fullName}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Admission No: {student.admissionNo}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={handleEdit}
                        className="shadow-sm font-medium"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Student
                    </Button>
                </div>
            </div>

            {isWithdrawn && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/15 rounded-lg text-destructive shrink-0">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-destructive">
                                Student is Withdrawn
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                This student is currently withdrawn. You can reactivate their
                                enrollment to restore active status.
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={handleReactivate}
                        disabled={updateEnrollment.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shrink-0 gap-1.5 shadow-sm"
                    >
                        {updateEnrollment.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span>
                            {updateEnrollment.isPending
                                ? "Reactivating..."
                                : "Reactivate Student"}
                        </span>
                    </Button>
                </div>
            )}

            <StudentDetails student={student} />
        </div>
    );
}
