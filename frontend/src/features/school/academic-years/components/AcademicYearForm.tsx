"use client";

import { useEffect, useState } from "react";
import type {
    AcademicYear,
    CreateAcademicYearPayload,
    UpdateAcademicYearPayload,
} from "../types/academic-years.types";

interface AcademicYearFormProps {
    academicYear?: AcademicYear | null;
    isSubmitting: boolean;
    onSubmit: (
        payload:
            | CreateAcademicYearPayload
            | UpdateAcademicYearPayload,
    ) => void;
    onCancel: () => void;
}

const formatDateForInput = (value: string) => {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
};

export default function AcademicYearForm({
    academicYear,
    isSubmitting,
    onSubmit,
    onCancel,
}: AcademicYearFormProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState("");

    const isEdit = Boolean(academicYear);

    useEffect(() => {
        if (!academicYear) {
            setName("");
            setCode("");
            setStartDate("");
            setEndDate("");
            setIsActive(true);
            setError("");
            return;
        }

        setName(academicYear.name);
        setCode(academicYear.code);
        setStartDate(formatDateForInput(academicYear.startDate));
        setEndDate(formatDateForInput(academicYear.endDate));
        setIsActive(academicYear.isActive);
        setError("");
    }, [academicYear]);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Academic year name is required.");
            return;
        }

        if (!code.trim()) {
            setError("Academic year code is required.");
            return;
        }

        if (!startDate || !endDate) {
            setError("Start date and end date are required.");
            return;
        }

        if (startDate >= endDate) {
            setError("Start date must be before end date.");
            return;
        }

        if (isEdit) {
            onSubmit({
                name: name.trim(),
                code: code.trim(),
                startDate,
                endDate,
                isActive,
            });

            return;
        }

        onSubmit({
            name: name.trim(),
            code: code.trim(),
            startDate,
            endDate,
            isActive,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="academic-year-name"
                        className="text-sm font-medium"
                    >
                        Name
                    </label>

                    <input
                        id="academic-year-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Academic Year 2026-27"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="academic-year-code"
                        className="text-sm font-medium"
                    >
                        Code
                    </label>

                    <input
                        id="academic-year-code"
                        type="text"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder="2026-27"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="academic-year-start"
                        className="text-sm font-medium"
                    >
                        Start Date
                    </label>

                    <input
                        id="academic-year-start"
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="academic-year-end"
                        className="text-sm font-medium"
                    >
                        End Date
                    </label>

                    <input
                        id="academic-year-end"
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                    disabled={isSubmitting || academicYear?.isCurrent}
                    className="h-4 w-4 rounded border"
                />

                <span className="text-sm font-medium">
                    Active
                </span>
            </label>

            {academicYear?.isCurrent ? (
                <p className="text-xs text-muted-foreground">
                    The current academic year cannot be deactivated.
                </p>
            ) : null}

            <div className="flex justify-end gap-3 border-t pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEdit
                            ? "Update Academic Year"
                            : "Create Academic Year"}
                </button>
            </div>
        </form>
    );
}