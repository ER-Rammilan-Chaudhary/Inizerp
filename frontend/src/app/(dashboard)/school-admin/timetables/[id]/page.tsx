"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Calendar,
    Clock,
    DoorOpen,
    GraduationCap,
    MapPin,
    Pencil,
    School,
    Trash2,
    UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TimetableDeleteDialog from "@/features/school/timetables/components/TimetableDeleteDialog";
import {
    useDeleteTimetable,
    useTimetable,
} from "@/features/school/timetables/hooks/useTimetables";
import { getErrorMessage } from "@/lib/error-message";

const dayLabels: Record<string, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
};

export default function TimetableDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const timetableId = params.id;

    const timetableQuery = useTimetable(timetableId);
    const deleteMutation = useDeleteTimetable();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const timetable = timetableQuery.data;

    if (timetableQuery.isLoading) {
        return <Loader text="Loading timetable schedule..." />;
    }

    if (timetableQuery.isError || !timetable) {
        return (
            <ErrorPage
                title="Timetable Schedule Not Found"
                message="The requested timetable schedule entry could not be found."
            />
        );
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteMutation.mutateAsync(timetableId);
            toast.success("Timetable schedule deleted successfully");
            setDeleteOpen(false);
            router.push("/school-admin/timetables");
            router.refresh();
        } catch (err) {
            toast.error(
                getErrorMessage(err, "Failed to delete timetable schedule"),
            );
        }
    };

    const dayName = dayLabels[timetable.day] ?? timetable.day;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs uppercase font-semibold">
                            {dayName}
                        </Badge>
                        <Badge className=" text-xs">
                            Period {timetable.period}
                        </Badge>
                    </div>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight">
                        {timetable.subject.name} ({timetable.subject.code})
                    </h1>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {timetable.class.name}
                        {timetable.section ? ` • Section ${timetable.section.name}` : ""} •{" "}
                        {timetable.startTime} to {timetable.endTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild size="sm">
                        <Link href={`/school-admin/timetables/${timetableId}/edit`}>
                            <Pencil className="mr-1.5 size-4" />
                            Edit Schedule
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="mr-1.5 size-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Time Slot</p>
                            <p className="mt-0.5 text-sm font-semibold">
                                {timetable.startTime} – {timetable.endTime}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <School className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Class & Section</p>
                            <p className="mt-0.5 text-sm font-semibold">
                                {timetable.class.name}
                                {timetable.section ? ` (${timetable.section.name})` : " (All)"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <GraduationCap className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Faculty In-Charge</p>
                            <p className="mt-0.5 truncate text-sm font-semibold">
                                {timetable.teacher.user.fullName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <MapPin className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Room / Venue</p>
                            <p className="mt-0.5 text-sm font-semibold">
                                {timetable.roomNo || "Not Specified"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Subject & Timing Information */}
                <div className="rounded-xl border bg-card p-6 shadow-xs">
                    <h2 className="text-base font-semibold">Subject & Period Details</h2>

                    <div className="mt-4 divide-y text-sm">
                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Subject Name</span>
                            <Link
                                href={`/school-admin/subjects/${timetable.subject.id}`}
                                className="font-medium text-primary hover:underline"
                            >
                                {timetable.subject.name}
                            </Link>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Subject Code</span>
                            <span className=" font-medium">
                                {timetable.subject.code}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Day of Week</span>
                            <span className="font-medium">{dayName}</span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Period Number</span>
                            <span className=" font-medium">
                                Period {timetable.period}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Time Window</span>
                            <span className=" font-medium">
                                {timetable.startTime} to {timetable.endTime}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Room Assignment</span>
                            <span className="font-medium">
                                {timetable.roomNo || "Unassigned"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Faculty & Academic Session */}
                <div className="rounded-xl border bg-card p-6 shadow-xs">
                    <h2 className="text-base font-semibold">Faculty & Session Context</h2>

                    <div className="mt-4 divide-y text-sm">
                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Teacher Name</span>
                            <span className="font-medium">
                                {timetable.teacher.user.fullName}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Employee ID</span>
                            <span className=" font-medium">
                                {timetable.teacher.employeeId}
                            </span>
                        </div>

                        {timetable.teacher.designation && (
                            <div className="flex justify-between py-2.5">
                                <span className="text-muted-foreground">Designation</span>
                                <span className="font-medium">
                                    {timetable.teacher.designation}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Teacher Email</span>
                            <span className="font-medium text-muted-foreground">
                                {timetable.teacher.user.email}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Academic Year</span>
                            <span className="font-medium">
                                {timetable.academicYear
                                    ? `${timetable.academicYear.name} (${timetable.academicYear.code})`
                                    : "Default Session"}
                            </span>
                        </div>

                        <div className="flex justify-between py-2.5">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span className="text-muted-foreground">
                                {new Date(timetable.updatedAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <TimetableDeleteDialog
                open={deleteOpen}
                timetable={timetable}
                isDeleting={deleteMutation.isPending}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteOpen(false)}
            />
        </div>
    );
}
