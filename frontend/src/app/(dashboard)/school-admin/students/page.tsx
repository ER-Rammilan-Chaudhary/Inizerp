"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Plus, Search, UserCheck, Users, UserX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StudentDeleteDialog from "@/features/school/students/components/StudentDeleteDialog";
import StudentFilters from "@/features/school/students/components/StudentFilters";
import StudentTable from "@/features/school/students/components/StudentTable";
import {
    useDeleteStudent,
    useStudents,
} from "@/features/school/students/hooks/useStudents";
import type {
    Student,
    StudentListParams,
} from "@/features/school/students/types/students.types";

import Pagination from "@/components/tables/Pagination";

const defaultFilters: StudentListParams = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
};

export default function StudentsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search")?.trim() ?? "";

    const [filters, setFilters] = useState<StudentListParams>(defaultFilters);
    const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

    // Combine local filters with the global header search query
    const effectiveFilters: StudentListParams = {
        ...filters,
        search: search || undefined,
    };

    const studentsQuery = useStudents(effectiveFilters);
    const deleteMutation = useDeleteStudent();

    const students = studentsQuery.data?.data.items ?? [];
    const pagination = studentsQuery.data?.data.pagination;

    // Quick metric estimations
    const totalCount = pagination?.total ?? students.length;
    const activeCount = students.filter((s) => s.user.status === "ACTIVE").length;
    const inactiveCount = students.filter((s) => s.user.status === "INACTIVE").length;

    const handleView = (student: Student) => {
        router.push(`/school-admin/students/${student.id}`);
    };

    const handleEdit = (student: Student) => {
        router.push(`/school-admin/students/${student.id}/edit`);
    };

    const handleDelete = async () => {
        if (!deleteStudent) return;

        try {
            await deleteMutation.mutateAsync(deleteStudent.id);
            toast.success("Student removed successfully");
            setDeleteStudent(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete student";
            toast.error(message);
        }
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Students Directory
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage student profiles, academic enrollments, attendance rosters, and guardian associations.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => router.push("/school-admin/students/new")}
                    className="shadow-sm font-medium self-start sm:self-center"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Enroll Student
                </Button>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Total Registered</p>
                            <p className="text-xl font-bold text-foreground">{totalCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Active Enrolled</p>
                            <p className="text-xl font-bold text-foreground">{activeCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">On Current Page</p>
                            <p className="text-xl font-bold text-foreground">{students.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <UserX className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Inactive / On Leave</p>
                            <p className="text-xl font-bold text-foreground">{inactiveCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Global Header Search Active Pill */}
            {search && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3.5 py-2 rounded-lg border border-border/60">
                    <Search className="h-4 w-4 text-primary shrink-0" />
                    <span>
                        Searching student records matching:{" "}
                        <strong className="text-foreground">"{search}"</strong>
                    </span>
                </div>
            )}

            {/* Filter Controls (Status & Sort) */}
            <StudentFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleReset}
            />

            {/* Data Table */}
            {studentsQuery.isLoading ? (
                <div className="rounded-xl border bg-card p-8">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
                        ))}
                    </div>
                </div>
            ) : studentsQuery.isError ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive font-medium">
                        Failed to load students. Please check your network and retry.
                    </p>
                </div>
            ) : (
                <>
                    <StudentTable
                        students={students}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={setDeleteStudent}
                    />

                    {pagination && pagination.totalPages > 1 && (
                        <div className="pt-2">
                            <Pagination pagination={pagination} />
                        </div>
                    )}
                </>
            )}

            <StudentDeleteDialog
                student={deleteStudent}
                open={Boolean(deleteStudent)}
                loading={deleteMutation.isPending}
                onCancel={() => setDeleteStudent(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
