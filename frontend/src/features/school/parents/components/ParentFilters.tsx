"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParentFilterParams } from "../types/parents.types";

interface ParentFiltersProps {
    filters: ParentFilterParams;
    onChange: (filters: ParentFilterParams) => void;
    onReset: () => void;
}

export default function ParentFilters({
    filters,
    onChange,
    onReset,
}: ParentFiltersProps) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 max-w-xs">
                    <select
                        value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
                        onChange={(event) => {
                            const [sortBy, sortOrder] = event.target.value.split(":");
                            onChange({
                                ...filters,
                                sortBy: sortBy as ParentFilterParams["sortBy"],
                                sortOrder: sortOrder as ParentFilterParams["sortOrder"],
                            });
                        }}
                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        <option value="createdAt:desc">Newest Registered</option>
                        <option value="createdAt:asc">Oldest Registered</option>
                        <option value="fullName:asc">Name: A to Z</option>
                        <option value="fullName:desc">Name: Z to A</option>
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
