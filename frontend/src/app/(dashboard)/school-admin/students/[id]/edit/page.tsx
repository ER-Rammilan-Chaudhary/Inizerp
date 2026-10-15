"use client";

import { UserCog } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses, useSections } from "@/features/school/classes/hooks/useClasses";
import StudentForm from "@/features/school/students/components/StudentForm";
import { useStudent, useUpdateStudent } from "@/features/school/students/hooks/useStudents";
import type { UpdateStudentPayload } from "@/features/school/students/types/students.types";

export default function EditStudentPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const studentId = params.id;

    const [error, setError] = useState("");
    const [classId, setClassId] = useState("");

    const studentQuery = useStudent(studentId);
    const updateStudent = useUpdateStudent();
    const academicYearsQuery = useAcademicYears();
    const classesQuery = useClasses();

    const student = studentQuery.data?.data;

    const activeEnrollment =
        student?.enrollments?.find(
            (enrollment) =>
                enrollment.status === "ACTIVE" && enrollment.academicYear.isCurrent,
        ) ??
        student?.enrollments?.find((enrollment) => enrollment.status === "ACTIVE") ??
        student?.enrollments?.[0];

    useEffect(() => {
        const currentClassId = activeEnrollment?.class?.id ?? "";
        setClassId(currentClassId);
    }, [activeEnrollment?.class?.id]);

    const sectionsQuery = useSections(classId);

    const academicYears =
        academicYearsQuery.data?.data?.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.code,
        })) ?? [];

    const classes =
        classesQuery.data?.data?.map((item) => ({
            id: item.id,
            name: item.name,
        })) ?? [];

    const sections =
        sectionsQuery.data?.data?.map((item) => ({
            id: item.id,
            name: item.name,
            capacity: item.capacity ?? null,
            classId: item.classId,
        })) ?? [];

    const handleSubmit = async (payload: UpdateStudentPayload) => {
        if (!studentId) {
            setError("Invalid student ID.");
            return;
        }

        try {
            setError("");
            await updateStudent.mutateAsync({
                id: studentId,
                payload,
            });

            toast.success("Student updated successfully");
            router.push("/school-admin/students");
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to update student. Please check the entered data.";
            setError(message);
            toast.error(message);
        }
    };

    if (studentQuery.isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 h-96 rounded-xl border bg-card animate-pulse" />
                    <div className="lg:col-span-4 h-96 rounded-xl border bg-card animate-pulse" />
                </div>
            </div>
        );
    }

    if (studentQuery.isError || !student) {
        return (
            <div className="w-full space-y-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h3 className="font-semibold text-destructive">Student Not Found</h3>
                    <p className="text-sm text-destructive/80 mt-1">
                        Could not load student information or the record has been deleted.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <UserCog className="h-6 w-6 text-primary" />
                            Edit Student: {student.user.fullName}
                        </h1>
                        <Badge variant={student.user.status === "ACTIVE" ? "default" : "outline"} className="text-xs">
                            {student.user.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Update identity, academic enrollment, session standard, and contact details.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/school-admin/students/${student.id}`)}
                        className="text-xs sm:text-sm"
                    >
                        View Profile
                    </Button>
                </div>
            </div>

            <StudentForm<UpdateStudentPayload>
                student={student}
                loading={
                    academicYearsQuery.isLoading ||
                    classesQuery.isLoading ||
                    sectionsQuery.isLoading ||
                    updateStudent.isPending
                }
                onSubmit={handleSubmit}
                onCancel={() => router.push("/school-admin/students")}
                academicYears={academicYears}
                classes={classes}
                sections={sections}
                onClassChange={setClassId}
                error={error}
            />
        </div>
    );
}
