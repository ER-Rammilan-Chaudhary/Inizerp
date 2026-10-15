"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses, useSections } from "@/features/school/classes/hooks/useClasses";
import StudentForm from "@/features/school/students/components/StudentForm";
import { useCreateStudent } from "@/features/school/students/hooks/useStudents";
import type { CreateStudentPayload } from "@/features/school/students/types/students.types";

import { useSearchParams } from "next/navigation";
import { admissionsApi } from "@/features/school/admissions/api/admissions.api";

export default function NewStudentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const admissionId = searchParams.get("admissionId");

    const createStudent = useCreateStudent();

    const [error, setError] = useState("");
    const [classId, setClassId] = useState("");

    const academicYearsQuery = useAcademicYears();
    const classesQuery = useClasses();
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

    const handleSubmit = async (payload: CreateStudentPayload) => {
        try {
            setError("");
            await createStudent.mutateAsync(payload);
            if (admissionId) {
                try {
                    await admissionsApi.updateAdmission(admissionId, {
                        status: "ENROLLED",
                    });
                } catch {
                    // non-fatal if status update fails
                }
            }
            toast.success(
                admissionId
                    ? "Student registered and marked as Enrolled in Admissions!"
                    : "Student registered successfully",
            );
            router.push("/school-admin/students");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to create student";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <UserPlus className="h-6 w-6 text-primary" />
                        Enroll New Student
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create student credentials, allocate standard & section cohort, and capture demographic details.
                    </p>
                </div>
            </div>

            <StudentForm<CreateStudentPayload>
                loading={
                    createStudent.isPending ||
                    academicYearsQuery.isLoading ||
                    classesQuery.isLoading ||
                    sectionsQuery.isLoading
                }
                onCancel={() => router.push("/school-admin/students")}
                onSubmit={handleSubmit}
                academicYears={academicYears}
                classes={classes}
                sections={sections}
                onClassChange={setClassId}
                error={error}
            />
        </div>
    );
}
