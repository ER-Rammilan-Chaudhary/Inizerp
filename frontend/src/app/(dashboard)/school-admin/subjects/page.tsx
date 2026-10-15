"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DataTableSort from "@/components/common/DataTableSort";
import ErrorPage from "@/components/common/error/ErrorPage";
import Pagination from "@/components/tables/Pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

import {
    useDeleteSubject,
    useSubjects,
} from "@/features/school/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/school/teachers/hooks/useTeachers";
import Loader from "@/components/common/Loader";

function getInitials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}


export default function SubjectsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("search")?.trim() ?? "";

    const pageValue = Number(searchParams.get("page") ?? "1");
    const limitValue = Number(searchParams.get("limit") ?? "10");
    const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
    const limit = [10, 20, 50, 100].includes(limitValue) ? limitValue : 10;
    const teacherId = searchParams.get("teacherId") ?? "";
    const hasTeachersParam = searchParams.get("hasTeachers");

    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    const sortBy = sortByParam === "code" || sortByParam === "createdAt" ? sortByParam : "name";
    const sortOrder = sortOrderParam === "desc" ? "desc" : "asc";
    const subjectsQuery = useSubjects({
        search: search || undefined,
        page,
        limit,
        teacherId: teacherId || undefined,
        hasTeachers: hasTeachersParam === "true" ? true : hasTeachersParam === "false" ? false : undefined,
        sortBy,
        sortOrder,
    });

    const teachersQuery = useTeachers();
    const deleteSubject = useDeleteSubject();

    const subjects = subjectsQuery.data?.data ?? [];
    const pagination = subjectsQuery.data?.pagination;
    const teachers = teachersQuery.data?.data ?? [];

    const isInitialLoading =
        subjectsQuery.isLoading && !subjectsQuery.data;

    const isFiltering =
        subjectsQuery.isFetching && Boolean(subjectsQuery.data);

    const totalTeachers = useMemo(() => new Set(subjects.flatMap((subject) => subject.teachers.map((teacher) => teacher.id),),).size, [subjects],);
    const totalResults = useMemo(() => subjects.reduce((total, subject) => total + subject._count.results, 0,), [subjects],);
    const totalTimetables = useMemo(() => subjects.reduce((total, subject) => total + subject._count.timetables, 0,), [subjects],);


    const updateParams = (updates: Record<string, string | null>,) => {
        const params = new URLSearchParams(searchParams.toString(),);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") { params.delete(key); }
            else { params.set(key, value); }
        }
        ); params.set("page", "1"); const queryString = params.toString(); router.replace(queryString ? `${pathname}?${queryString}` : pathname,);
    };

    const handleDelete = async (
        subjectId: string,
        subjectName: string,
    ) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${subjectName}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteSubject.mutateAsync(subjectId);
            toast.success(`Subject "${subjectName}" deleted successfully`);
        } catch (err) {
            toast.error(
                getErrorMessage(err, `Failed to delete "${subjectName}"`),
            );
        }
    };

    const clearFilters = () => {
        const params = new URLSearchParams();

        if (search) {
            params.set("search", search);
        }

        params.set("page", "1");

        const queryString = params.toString();

        router.replace(
            queryString
                ? `${pathname}?${queryString}`
                : pathname,
        );
    };

    const hasFilters =
        Boolean(teacherId) ||
        Boolean(hasTeachersParam) ||
        sortBy !== "name" ||
        sortOrder !== "asc" ||
        limit !== 10;

    if (isInitialLoading) {
        return (
            <Loader text=" Loading subjects..." />
        );
    }

    if (subjectsQuery.isError && !subjectsQuery.data) {
        return (
            <ErrorPage
                title="Unable to load subjects"
                message="Something went wrong while loading subjects. Please try again."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Subjects
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage subjects and assign teachers for your school.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/school-admin/subjects/new">
                        <Plus className="mr-2 size-4" />
                        Add Subject
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                        Total Subjects
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {pagination?.total ?? 0}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                        Teachers
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {totalTeachers}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                        Results
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {totalResults}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                        Timetable Entries
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {totalTimetables}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-end items-center gap-3">
                <Select
                    value={teacherId || "all"}
                    onValueChange={(value) => {
                        updateParams({
                            teacherId: value === "all" ? null : value,
                        });
                    }}
                    disabled={teachersQuery.isLoading}
                >
                    <SelectTrigger className="w-[210px]">
                        <SelectValue placeholder="All teachers">
                            {teacherId
                                ? teachers.find((teacher) => teacher.id === teacherId)
                                    ?.user.fullName ?? "Teacher"
                                : "All teachers"}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All teachers
                        </SelectItem>

                        {teachers.map((teacher) => (
                            <SelectItem
                                key={teacher.id}
                                value={teacher.id}
                            >
                                {teacher.user.fullName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={hasTeachersParam ?? "all"}
                    onValueChange={(value) => {
                        updateParams({
                            hasTeachers: value === "all" ? null : value,
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Teacher assignment">
                            {hasTeachersParam === "true"
                                ? "Assigned"
                                : hasTeachersParam === "false"
                                    ? "Unassigned"
                                    : "All assignments"}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All assignments
                        </SelectItem>

                        <SelectItem value="true">
                            Assigned
                        </SelectItem>

                        <SelectItem value="false">
                            Unassigned
                        </SelectItem>
                    </SelectContent>
                </Select>

                <DataTableSort
                    value={`${sortBy}:${sortOrder}`}
                    options={[
                        {
                            value: "code:asc",
                            label: "Code A–Z",
                        },
                        {
                            value: "code:desc",
                            label: "Code Z–A",
                        },
                        {
                            value: "createdAt:desc",
                            label: "Newest first",
                        },
                        {
                            value: "createdAt:asc",
                            label: "Oldest first",
                        },
                    ]}
                    onChange={(value) => {
                        const [nextSortBy, nextSortOrder] = value.split(":") as [
                            "name" | "code" | "createdAt",
                            "asc" | "desc",
                        ];

                        updateParams({
                            sortBy: nextSortBy,
                            sortOrder: nextSortOrder,
                        });
                    }}
                    disabled={subjectsQuery.isFetching}
                    className="w-[190px]"
                />
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-card">
                {isFiltering && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
                            <Loader2 className="size-4 animate-spin" />
                            Updating...
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Subject
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Code
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Teachers
                                </th>

                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Results
                                </th>

                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Timetable
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {subjects.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="font-medium">
                                                No subjects found
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {search ||
                                                    teacherId ||
                                                    hasTeachersParam
                                                    ? "Try changing your filters."
                                                    : "Create your first subject to get started."}
                                            </p>

                                            {!search &&
                                                !teacherId &&
                                                !hasTeachersParam && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="mt-2"
                                                    >
                                                        <Link href="/school-admin/subjects/new">
                                                            <Plus className="mr-2 size-4" />
                                                            Add Subject
                                                        </Link>
                                                    </Button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                subjects.map((subject) => (
                                    <tr
                                        key={subject.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                    {getInitials(subject.name)}
                                                </div>

                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/school-admin/subjects/${subject.id}`}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {subject.name}
                                                    </Link>

                                                    {subject.description && (
                                                        <p className="max-w-[300px] truncate text-xs text-muted-foreground">
                                                            {subject.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                                                {subject.code}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            {subject.teachers.length === 0 ? (
                                                <span className="text-sm text-muted-foreground">
                                                    No teacher assigned
                                                </span>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {subject.teachers
                                                        .slice(0, 3)
                                                        .map((teacher) => (
                                                            <span
                                                                key={teacher.id}
                                                                className="inline-flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-xs">
                                                                {/* <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                                    {getInitials(
                                                                        // teacher.user.fullName,
                                                                    )}
                                                                </span> */}

                                                                {teacher.user.fullName}
                                                            </span>
                                                        ))}

                                                    {subject.teachers.length > 3 && (
                                                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                                            +{subject.teachers.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center text-sm">
                                            {subject._count.results}
                                        </td>

                                        <td className="px-6 py-4 text-center text-sm">
                                            {subject._count.timetables}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/school-admin/subjects/${subject.id}`}>
                                                        View
                                                    </Link>
                                                </Button>

                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/school-admin/subjects/${subject.id}/edit`}>Edit
                                                    </Link>
                                                </Button>

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="text-destructive hover:text-destructive"
                                                    disabled={deleteSubject.isPending}
                                                    onClick={() => handleDelete(subject.id, subject.name,)}
                                                    title={`Delete ${subject.name}`}>

                                                    {deleteSubject.isPending ? (<Loader2 className="size-4 animate-spin" />) : (
                                                        <Trash2 className="size-4" />
                                                    )}

                                                    <span className="sr-only">
                                                        Delete {subject.name}
                                                    </span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination && pagination.totalPages > 0 && (
                <Pagination pagination={pagination} />
            )}
        </div>
    );
}