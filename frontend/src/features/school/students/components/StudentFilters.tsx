"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentListParams, StudentStatus } from "../types/students.types";

interface StudentFiltersProps {
    filters: StudentListParams;
    onChange: (filters: StudentListParams) => void;
    onReset: () => void;
}

const statuses: StudentStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function StudentFilters({
    filters,
    onChange,
    onReset,
}: StudentFiltersProps) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
                    <select
                        value={filters.status ?? ""}
                        onChange={(event) =>
                            onChange({
                                ...filters,
                                status: event.target.value
                                    ? (event.target.value as StudentStatus)
                                    : undefined,
                                page: 1,
                            })
                        }
                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        <option value="">All Enrollment Statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
                        onChange={(event) => {
                            const [sortBy, sortOrder] = event.target.value.split(":");
                            onChange({
                                ...filters,
                                sortBy: sortBy as StudentListParams["sortBy"],
                                sortOrder: sortOrder as StudentListParams["sortOrder"],
                                page: 1,
                            });
                        }}
                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        <option value="createdAt:desc">Newest Admissions</option>
                        <option value="createdAt:asc">Oldest Admissions</option>
                        <option value="name:asc">Name: A to Z</option>
                        <option value="name:desc">Name: Z to A</option>
                        <option value="admissionNo:asc">Admission No: Ascending</option>
                        <option value="admissionNo:desc">Admission No: Descending</option>
                    </select>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="h-10 text-sm font-medium self-end sm:self-auto"
                >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
