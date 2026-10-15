"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import AcademicYearForm from "@/features/school/academic-years/components/AcademicYearForm";
import AcademicYearList from "@/features/school/academic-years/components/AcademicYearList";
import {
    useAcademicYears,
    useCreateAcademicYear,
    useDeleteAcademicYear,
    useSetCurrentAcademicYear,
    useUpdateAcademicYear,
} from "@/features/school/academic-years/hooks/useAcademicYears";
import type {
    AcademicYear,
    CreateAcademicYearPayload,
    UpdateAcademicYearPayload,
} from "@/features/school/academic-years/types/academic-years.types";

export default function AcademicYearsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingAcademicYear, setEditingAcademicYear] =
        useState<AcademicYear | null>(null);

    const {
        data,
        isLoading,
        isError,
    } = useAcademicYears();

    const createMutation = useCreateAcademicYear();
    const updateMutation = useUpdateAcademicYear();
    const currentMutation = useSetCurrentAcademicYear();
    const deleteMutation = useDeleteAcademicYear();

    if (isLoading) {
        return <Loader text="Academic Years Loading..." />;
    }

    if (isError) {
        return <ErrorPage />;
    }

    const academicYears = data?.data ?? [];

    const handleCreate = (
        payload:
            | CreateAcademicYearPayload
            | UpdateAcademicYearPayload,
    ) => {
        createMutation.mutate(
            payload as CreateAcademicYearPayload,
            {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingAcademicYear(null);
                },
            },
        );
    };

    const handleUpdate = (
        payload:
            | CreateAcademicYearPayload
            | UpdateAcademicYearPayload,
    ) => {
        if (!editingAcademicYear) {
            return;
        }

        updateMutation.mutate(
            {
                id: editingAcademicYear.id,
                payload: payload as UpdateAcademicYearPayload,
            },
            {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingAcademicYear(null);
                },
            },
        );
    };

    const handleEdit = (academicYear: AcademicYear) => {
        setEditingAcademicYear(academicYear);
        setShowForm(true);
    };

    const handleCreateClick = () => {
        setEditingAcademicYear(null);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAcademicYear(null);
    };

    const handleSetCurrent = (id: string) => {
        currentMutation.mutate(id);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const isSubmitting =
        createMutation.isPending ||
        updateMutation.isPending;

    const mutationError =
        createMutation.error ??
        updateMutation.error ??
        currentMutation.error ??
        deleteMutation.error;

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Academic Years
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage academic years and select the current academic
                        year.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreateClick}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Add Academic Year
                </button>
            </div>

            {mutationError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {mutationError instanceof Error
                        ? mutationError.message
                        : "Something went wrong. Please try again."}
                </div>
            ) : null}

            {showForm ? (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">
                            {editingAcademicYear
                                ? "Edit Academic Year"
                                : "Create Academic Year"}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {editingAcademicYear
                                ? "Update academic year information."
                                : "Add a new academic year for your school."}
                        </p>
                    </div>

                    <AcademicYearForm
                        academicYear={editingAcademicYear}
                        isSubmitting={isSubmitting}
                        onSubmit={
                            editingAcademicYear
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={handleCancel}
                    />
                </div>
            ) : null}

            {academicYears.length === 0 ? (
                <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border bg-card px-6 text-center shadow-sm">
                    <h2 className="text-lg font-semibold">
                        No academic years
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Create your first academic year to start managing
                        school academic data.
                    </p>

                    <button
                        type="button"
                        onClick={handleCreateClick}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Create Academic Year
                    </button>
                </div>
            ) : (
                <AcademicYearList
                    academicYears={academicYears}
                    isUpdating={
                        updateMutation.isPending ||
                        currentMutation.isPending
                    }
                    isDeleting={deleteMutation.isPending}
                    onEdit={handleEdit}
                    onSetCurrent={handleSetCurrent}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}