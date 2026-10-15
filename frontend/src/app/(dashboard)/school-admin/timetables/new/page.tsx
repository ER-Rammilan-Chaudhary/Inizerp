"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CalendarDays,
    Clock3,
    GraduationCap,
    BookOpen,
} from "lucide-react";

import TimetableForm from "@/features/school/timetables/components/TimetableForm";
import { useCreateTimetable } from "@/features/school/timetables/hooks/useTimetables";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses } from "@/features/school/classes/hooks/useClasses";
import { useSubjects } from "@/features/school/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/school/teachers/hooks/useTeachers";

import type {
    CreateTimetablePayload,
    UpdateTimetablePayload,
} from "@/features/school/timetables/types/timetables.types";

import { getErrorMessage } from "@/lib/error-message";

export default function CreateTimetablePage() {
    const router = useRouter();
    const createMutation = useCreateTimetable();

    const academicYearsQuery = useAcademicYears();
    const classesQuery = useClasses();
    const subjectsQuery = useSubjects();
    const teachersQuery = useTeachers();

    const academicYears = academicYearsQuery.data?.data ?? [];
    const classes = classesQuery.data?.data ?? [];
    const subjects = subjectsQuery.data?.data ?? [];
    const teachers = teachersQuery.data?.data ?? [];

    const handleSubmit = async (
        payload: CreateTimetablePayload | UpdateTimetablePayload,
    ) => {
        try {
            await createMutation.mutateAsync(
                payload as CreateTimetablePayload,
            );

            toast.success("Timetable schedule created successfully");
            router.push("/school-admin/timetables");
            router.refresh();
        } catch (err) {
            toast.error(
                getErrorMessage(
                    err,
                    "Failed to create timetable schedule",
                ),
            );
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto  space-y-8 ">
                {/* Page Header */}
                <div className="space-y-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-background shadow-sm">
                                <CalendarDays className="size-7 text-primary" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Create Timetable
                                    </h1>

                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        New Schedule
                                    </span>
                                </div>

                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Organize class schedules
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Information */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <GraduationCap className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Academic Planning
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Select the academic year and class
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                            <BookOpen className="size-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Subject & Teacher
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Assign the right teaching resources
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Clock3 className="size-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Period & Room
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Keep your timetable organized
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {createMutation.isError && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                    >
                        <div className="min-w-0">
                            <p className="font-semibold">
                                Unable to create timetable
                            </p>
                            <p className="mt-1 leading-5">
                                {getErrorMessage(
                                    createMutation.error,
                                    "Timetable schedule could not be created.",
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Section */}
                <section className="overflow-hidden rounded-2xl border bg-background shadow-sm">
                    <div className="border-b bg-muted/20 px-5 py-5 sm:px-8">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Timetable Details
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete the information below to create a new
                            class schedule.
                        </p>
                    </div>

                    <div className="p-5 sm:p-8">
                        <TimetableForm
                            academicYears={academicYears}
                            classes={classes}
                            subjects={subjects}
                            teachers={teachers}
                            isSubmitting={createMutation.isPending}
                            onSubmit={handleSubmit}
                            onCancel={() =>
                                router.push("/school-admin/timetables")
                            }
                        />
                    </div>
                </section>

                <p className="text-center text-xs text-muted-foreground">
                    Please verify the assigned teacher, subject, time slot,
                    and room before saving the timetable.
                </p>
            </div>
        </div>
    );
}