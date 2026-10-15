"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

import SubjectForm from "@/features/school/subjects/components/SubjectForm";
import {
    useSubject,
    useUpdateSubject,
} from "@/features/school/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/school/teachers/hooks/useTeachers";

export default function EditSubjectPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const subjectId = params.id;

    const subjectQuery = useSubject(subjectId);
    const updateSubject = useUpdateSubject();
    const teachersQuery = useTeachers();

    const subject = subjectQuery.data?.data;
    const teachers = teachersQuery.data?.data ?? [];

    const handleSubmit = async (
        payload: Parameters<typeof updateSubject.mutateAsync>[0]["payload"],
    ) => {
        try {
            await updateSubject.mutateAsync({
                id: subjectId,
                payload,
            });
            toast.success("Subject updated successfully");
            router.push(`/school-admin/subjects/${subjectId}`);
            router.refresh();
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to update subject"));
        }
    };

    if (subjectQuery.isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Subject</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update subject information and assigned teachers.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
                    Loading subject...
                </div>
            </div>
        );
    }

    if (subjectQuery.isError || !subject) {
        return (
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Subject</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update subject information and assigned teachers.
                    </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    Subject could not be loaded.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Subject</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update {subject.name} and its assigned teachers.
                    </p>
                </div>
            </div>

            {updateSubject.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {getErrorMessage(
                        updateSubject.error,
                        "Subject could not be updated.",
                    )}
                </div>
            )}

            <SubjectForm
                subject={subject}
                teachers={teachers}
                teachersLoading={teachersQuery.isLoading}
                loading={updateSubject.isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
}