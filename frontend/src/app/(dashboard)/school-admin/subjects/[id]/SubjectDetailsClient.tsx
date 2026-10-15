"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import { Button } from "@/components/ui/button";
import { useDeleteSubject, useSubject, } from "@/features/school/subjects/hooks/useSubjects";
import { getErrorMessage } from "@/lib/error-message";

function getInitials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export default function SubjectDetailsClient({ id }: { id: string }) {
    const router = useRouter();
    const subjectQuery = useSubject(id);
    const deleteSubject = useDeleteSubject();

    const subject = subjectQuery.data?.data;

    const handleDelete = async () => {
        if (!subject) return;
        const confirmed = window.confirm(
            `Are you sure you want to delete "${subject.name}"? This action cannot be undone.`,
        );
        if (!confirmed) return;

        try {
            await deleteSubject.mutateAsync(subject.id);
            toast.success(`Subject "${subject.name}" deleted successfully`);
            router.push("/school-admin/subjects");
            router.refresh();
        } catch (err) {
            toast.error(
                getErrorMessage(err, `Failed to delete "${subject.name}"`),
            );
        }
    };

    if (subjectQuery.isLoading) {
        return <Loader text="Loading subject details..." />;
    }

    if (subjectQuery.isError || !subject) {
        return (
            <ErrorPage
                title="Subject Details"
                message="Subject could not be found."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link href="/school-admin/subject" className="hover:text-foreground transition">
                    Subject
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{subject.name}</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold flex gap-1 items-center">
                                {subject.name}
                                <span className="rounded-md bg-primary px-1 py-1 text-primary-foreground text-xs flex items-center leading-none">
                                    {subject.code}
                                </span>
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Subject details and teacher assignments.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href={`/school-admin/subjects/${subject.id}/edit`}>Edit Subject</Link>
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteSubject.isPending}
                    >
                        {deleteSubject.isPending ? (<Loader2 className="mr-1.5 size-4 animate-spin" />) : (
                            <Trash2 className="mr-1.5 size-4" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Teachers</p>
                    <p className="mt-2 text-2xl font-semibold">
                        {subject.teachers.length}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Result Records</p>
                    <p className="mt-2 text-2xl font-semibold">
                        {subject._count.results}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Timetable Records</p>
                    <p className="mt-2 text-2xl font-semibold">
                        {subject._count.timetables}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Subject Information */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b p-6">
                        <h2 className="text-lg font-semibold">Subject Information</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Details and information about this subject.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 lg:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Subject Name
                            </p>
                            <p className="mt-1 text-sm font-medium">{subject.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Description
                            </p>
                            <p className="mt-1 text-sm">
                                {subject.description || "No description added."}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Created
                            </p>
                            <p className="mt-1 text-sm">
                                {new Date(subject.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Last Updated
                            </p>
                            <p className="mt-1 text-sm">
                                {new Date(subject.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assigned Teachers */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b p-6">
                        <h2 className="text-lg font-semibold">Assigned Teachers</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Teachers currently assigned to this subject.
                        </p>
                    </div>

                    {subject.teachers.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="font-medium">No teachers assigned</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Edit this subject to assign teachers.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {subject.teachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                            {getInitials(teacher.user.fullName)}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {teacher.user.fullName}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {teacher.employeeId}
                                                {teacher.designation
                                                    ? ` • ${teacher.designation}`
                                                    : ""}
                                            </p>
                                            <p className="mt-1 break-all text-xs text-muted-foreground">
                                                {teacher.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}