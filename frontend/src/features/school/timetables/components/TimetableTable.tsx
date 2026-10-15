"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Timetable } from "../types/timetables.types";

interface TimetableTableProps {
    data: Timetable[];
    isLoading?: boolean;
    isFetching?: boolean;
    onEdit?: (timetable: Timetable) => void;
    onDelete?: (timetable: Timetable) => void;
}

const dayBadges: Record<
    Timetable["day"],
    { label: string; className: string }
> = {
    MONDAY: {
        label: "Monday",
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    TUESDAY: {
        label: "Tuesday",
        className: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    },
    WEDNESDAY: {
        label: "Wednesday",
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    THURSDAY: {
        label: "Thursday",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    FRIDAY: {
        label: "Friday",
        className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    },
    SATURDAY: {
        label: "Saturday",
        className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    },
};

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export default function TimetableTable({
    data,
    isLoading,
    isFetching,
    onEdit,
    onDelete,
}: TimetableTableProps) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">
                    Loading timetable schedules...
                </p>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="flex min-h-[320px] items-center justify-center rounded-lg border bg-card p-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-base font-semibold">No timetable entries found</p>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or create a new schedule entry.
                    </p>
                    <Button asChild size="sm" className="mt-3">
                        <Link href="/school-admin/timetables/new">
                            <Plus className="mr-1.5 size-4" />
                            Add Timetable
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-lg border bg-card">
            {isFetching && (
                <div className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary" />
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-5 py-3.5 text-left font-medium">Day</th>
                            <th className="px-4 py-3.5 text-center font-medium">Period</th>
                            <th className="px-4 py-3.5 text-left font-medium">Time Slot</th>
                            <th className="px-5 py-3.5 text-left font-medium">Class & Section</th>
                            <th className="px-5 py-3.5 text-left font-medium">Subject</th>
                            <th className="px-5 py-3.5 text-left font-medium">Assigned Teacher</th>
                            <th className="px-4 py-3.5 text-left font-medium">Room</th>
                            <th className="w-[100px] px-5 py-3.5 text-right font-medium">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {data.map((timetable) => {
                            const dayInfo = dayBadges[timetable.day] ?? {
                                label: timetable.day,
                                className: "bg-muted text-muted-foreground",
                            };

                            return (
                                <tr
                                    key={timetable.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {/* Day Badge */}
                                    <td className="px-5 py-3.5 font-medium">
                                        <span
                                            className={`inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${dayInfo.className}`}
                                        >
                                            {dayInfo.label}
                                        </span>
                                    </td>

                                    {/* Period */}
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                            P{timetable.period}
                                        </span>
                                    </td>

                                    {/* Time */}
                                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted-foreground">
                                        {timetable.startTime} - {timetable.endTime}
                                    </td>

                                    {/* Class & Section */}
                                    <td className="px-5 py-3.5">
                                        <div className="font-medium text-foreground">
                                            {timetable.class.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {timetable.section
                                                ? `Section ${timetable.section.name}`
                                                : "All sections"}
                                        </div>
                                    </td>

                                    {/* Subject */}
                                    <td className="px-5 py-3.5">
                                        <Link
                                            href={`/school-admin/subjects/${timetable.subjectId}`}
                                            className="font-medium text-foreground hover:underline"
                                        >
                                            {timetable.subject.name}
                                        </Link>
                                        <div className=" text-xs text-muted-foreground">
                                            {timetable.subject.code}
                                        </div>
                                    </td>

                                    {/* Teacher */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                {getInitials(timetable.teacher.user.fullName)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-medium text-foreground">
                                                    {timetable.teacher.user.fullName}
                                                </p>
                                                <p className="truncate text-[11px] text-muted-foreground">
                                                    {timetable.teacher.designation ||
                                                        timetable.teacher.employeeId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Room */}
                                    <td className="px-4 py-3.5">
                                        {timetable.roomNo ? (
                                            <Badge variant="outline" className="text-xs">
                                                {timetable.roomNo}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-3.5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className="inline-flex size-8 items-center justify-center rounded-md border hover:bg-muted"
                                                aria-label="Timetable actions"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/school-admin/timetables/$ { timetable.id }`,)}
                                                ><Eye className="mr-2 size-4" />View
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onEdit ? onEdit(timetable) : router.push(`/school-admin/timetables/${timetable.id}/edit`,)
                                                    }>
                                                    <Pencil className="mr-2 size-4" />
                                                    Edit
                                                </DropdownMenuItem>

                                                {onDelete && (
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => onDelete(timetable)}
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}