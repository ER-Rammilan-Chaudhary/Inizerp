"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

import SubjectForm from "@/features/school/subjects/components/SubjectForm";
import { useCreateSubject } from "@/features/school/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/school/teachers/hooks/useTeachers";

export default function CreateSubjectPage() {
    const router = useRouter();
    const createSubject = useCreateSubject();
    const teachersQuery = useTeachers();

    const teachers = teachersQuery.data?.data ?? [];

    const handleSubmit = async (payload: Parameters<typeof createSubject.mutateAsync>[0]) => {
        try {
            await createSubject.mutateAsync(payload);
            toast.success("Subject created successfully");
            router.push("/school-admin/subjects");
            router.refresh();
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to create subject"));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Create Subject</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a subject and assign teachers.
                    </p>
                </div>
            </div>

            {createSubject.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {getErrorMessage(
                        createSubject.error,
                        "Subject could not be created.",
                    )}
                </div>
            )}

            <SubjectForm
                teachers={teachers}
                teachersLoading={teachersQuery.isLoading}
                loading={createSubject.isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
}