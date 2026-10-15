"use client";

import { X } from "lucide-react";

import type { Timetable } from "../types/timetables.types";

interface TimetableDeleteDialogProps {
    open: boolean;
    timetable?: Timetable | null;
    isDeleting?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function TimetableDeleteDialog({
    open,
    timetable,
    isDeleting = false,
    onConfirm,
    onClose,
}: TimetableDeleteDialogProps) {
    if (!open || !timetable) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        Delete Timetable
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="space-y-4 p-6">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this timetable?
                        This action cannot be undone.
                    </p>

                    <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Class
                                </p>
                                <p className="font-medium">
                                    {timetable.class.name}
                                    {timetable.section
                                        ? ` - ${timetable.section.name}`
                                        : ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">
                                    Subject
                                </p>
                                <p className="font-medium">
                                    {timetable.subject.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">
                                    Teacher
                                </p>
                                <p className="font-medium">
                                    {timetable.teacher.user.fullName}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">
                                    Schedule
                                </p>
                                <p className="font-medium">
                                    Period {timetable.period},{" "}
                                    {timetable.startTime} - {timetable.endTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}