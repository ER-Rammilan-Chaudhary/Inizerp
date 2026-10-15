"use client";

import type { Student } from "../types/students.types";

interface StudentDeleteDialogProps {
    student: Student | null;
    open: boolean;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function StudentDeleteDialog({ student, open, loading = false, onCancel, onConfirm, }: StudentDeleteDialogProps) {

    if (!open || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Delete Student</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">
                        {student.user.fullName}
                    </span>
                    ? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

