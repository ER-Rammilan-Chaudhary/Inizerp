"use client";

import { CheckCircle2, Circle, Edit, MoreHorizontal, Trash2, } from "lucide-react";
import { useState } from "react";
import type { AcademicYear } from "../types/academic-years.types";



interface AcademicYearListProps {
    academicYears: AcademicYear[];
    isUpdating: boolean;
    isDeleting: boolean;
    onEdit: (academicYear: AcademicYear) => void;
    onSetCurrent: (id: string) => void;
    onDelete: (id: string) => void;

}

const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", }
    ).format(new Date(value));
};

export default function AcademicYearList({ academicYears, isUpdating, isDeleting, onEdit, onSetCurrent, onDelete, }: AcademicYearListProps) {

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleDelete = (academicYear: AcademicYear) => {
        setOpenMenu(null);

        if (academicYear.isCurrent) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${academicYear.name}"?`,
        );

        if (confirmed) {
            onDelete(academicYear.id);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-225">
                    <thead>
                        <tr className="border-b bg-muted/40 text-left">
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Academic Year
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Code
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Duration
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Status
                            </th>

                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {academicYears.map((academicYear) => (
                            <tr
                                key={academicYear.id}
                                className="border-b last:border-b-0"
                            >
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {academicYear.name}
                                        </p>

                                        {academicYear.isCurrent ? (
                                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Current
                                            </span>
                                        ) : null}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                                        {academicYear.code}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="text-sm">
                                        <p>{formatDate(academicYear.startDate)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            to {formatDate(academicYear.endDate)}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <span className={academicYear.isActive ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600"
                                        : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                    }
                                    >
                                        {academicYear.isActive ? (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                            <Circle className="h-3.5 w-3.5" />
                                        )}

                                        {academicYear.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === academicYear.id
                                                            ? null
                                                            : academicYear.id,
                                                    )
                                                }
                                                disabled={isUpdating || isDeleting}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Academic year actions"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {openMenu === academicYear.id ? (
                                                <div className="absolute right-0 z-20 top-0 mt-2 w-48 rounded-lg border bg-card p-1 shadow-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenMenu(null);
                                                            onEdit(academicYear);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </button>

                                                    {!academicYear.isCurrent ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenMenu(null);
                                                                onSetCurrent(academicYear.id);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Set Current
                                                        </button>
                                                    ) : null}

                                                    {!academicYear.isCurrent ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(academicYear)
                                                            }
                                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}