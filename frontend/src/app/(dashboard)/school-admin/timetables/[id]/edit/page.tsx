"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import TimetableForm from "@/features/school/timetables/components/TimetableForm";
import {
    useTimetable,
    useUpdateTimetable,
} from "@/features/school/timetables/hooks/useTimetables";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses } from "@/features/school/classes/hooks/useClasses";
import { useSubjects } from "@/features/school/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/school/teachers/hooks/useTeachers";
import { getErrorMessage } from "@/lib/error-message";

export default function EditTimetablePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const timetableId = params.id;

    const timetableQuery = useTimetable(timetableId);
    const updateMutation = useUpdateTimetable();

    const academicYearsQuery = useAcademicYears();
    const classesQuery = useClasses();
    const subjectsQuery = useSubjects();
    const teachersQuery = useTeachers();

    const timetable = timetableQuery.data;
    const academicYears = academicYearsQuery.data?.data ?? [];
    const classes = classesQuery.data?.data ?? [];
    const subjects = subjectsQuery.data?.data ?? [];
    const teachers = teachersQuery.data?.data ?? [];

    if (timetableQuery.isLoading) {
        return <Loader text="Loading timetable schedule..." />;
    }

    if (timetableQuery.isError || !timetable) {
        return (
            <ErrorPage
                title="Timetable Schedule Not Found"
                message="The timetable entry you are attempting to edit could not be found."
            />
        );
    }

    const handleSubmit = async (
        payload: Parameters<typeof updateMutation.mutateAsync>[0]["payload"],
    ) => {
        try {
            await updateMutation.mutateAsync({
                id: timetableId,
                payload,
            });
            toast.success("Timetable schedule updated successfully");
            router.push(`/school-admin/timetables/${timetableId}`);
            router.refresh();
        } catch (err) {
            toast.error(
                getErrorMessage(err, "Failed to update timetable schedule"),
            );
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Timetable Schedule
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update class, timing, subject or teacher allocation for this slot.
                    </p>
                </div>
            </div>

            {updateMutation.isError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {getErrorMessage(
                        updateMutation.error,
                        "Timetable schedule could not be updated.",
                    )}
                </div>
            )}

            <TimetableForm
                timetable={timetable}
                academicYears={academicYears}
                classes={classes}
                subjects={subjects}
                teachers={teachers}
                isSubmitting={updateMutation.isPending}
                onSubmit={handleSubmit}
                onCancel={() => router.push(`/school-admin/timetables/${timetableId}`)}
            />
        </div>
    );
}
