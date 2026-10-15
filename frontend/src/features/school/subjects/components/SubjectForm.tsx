"use client";

import { useEffect, useMemo, useState } from "react";

import type {
    CreateSubjectPayload,
    Subject,
    UpdateSubjectPayload,
} from "../types/subjects.types";

interface TeacherOption {
    id: string;
    employeeId: string;
    designation: string | null;
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}

interface SubjectFormProps {
    subject?: Subject;
    teachers: TeacherOption[];
    teachersLoading?: boolean;
    loading?: boolean;
    onSubmit: (
        payload: CreateSubjectPayload,
    ) => void | Promise<void>;
}

interface FormState {
    name: string;
    code: string;
    description: string;
    teacherIds: string[];
}

const getInitialState = (subject?: Subject): FormState => ({
    name: subject?.name ?? "",
    code: subject?.code ?? "",
    description: subject?.description ?? "",
    teacherIds: subject?.teachers.map((teacher) => teacher.id) ?? [],
});

export default function SubjectForm({
    subject,
    teachers,
    teachersLoading = false,
    loading = false,
    onSubmit,
}: SubjectFormProps) {
    const [form, setForm] = useState<FormState>(
        getInitialState(subject),
    );

    const [teacherSearch, setTeacherSearch] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setForm(getInitialState(subject));
    }, [subject]);

    const filteredTeachers = useMemo(() => {
        const search = teacherSearch.trim().toLowerCase();

        if (!search) {
            return teachers;
        }

        return teachers.filter((teacher) => {
            const name = teacher.user.fullName.toLowerCase();
            const employeeId = teacher.employeeId.toLowerCase();
            const email = teacher.user.email.toLowerCase();

            return (
                name.includes(search) ||
                employeeId.includes(search) ||
                email.includes(search)
            );
        });
    }, [teachers, teacherSearch]);

    const selectedTeachers = useMemo(
        () =>
            teachers.filter((teacher) =>
                form.teacherIds.includes(teacher.id),
            ),
        [teachers, form.teacherIds],
    );

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const toggleTeacher = (teacherId: string) => {
        setForm((current) => {
            const exists = current.teacherIds.includes(teacherId);

            return {
                ...current,
                teacherIds: exists
                    ? current.teacherIds.filter((id) => id !== teacherId)
                    : [...current.teacherIds, teacherId],
            };
        });
    };

    const removeTeacher = (teacherId: string) => {
        setForm((current) => ({
            ...current,
            teacherIds: current.teacherIds.filter(
                (id) => id !== teacherId,
            ),
        }));
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            nextErrors.name = "Subject name is required";
        } else if (form.name.trim().length > 100) {
            nextErrors.name =
                "Subject name cannot exceed 100 characters";
        }

        if (!form.code.trim()) {
            nextErrors.code = "Subject code is required";
        } else if (form.code.trim().length > 50) {
            nextErrors.code =
                "Subject code cannot exceed 50 characters";
        }

        if (form.description.trim().length > 500) {
            nextErrors.description =
                "Description cannot exceed 500 characters";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const payload: CreateSubjectPayload = {
            name: form.name.trim(),
            code: form.code.trim().toUpperCase(),
            description: form.description.trim() || null,
            teacherIds: form.teacherIds,
        };

        await onSubmit(payload);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Subject Information
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the basic subject information.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="subject-name"
                            className="text-sm font-medium"
                        >
                            Subject Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="subject-name"
                            type="text"
                            value={form.name}
                            onChange={(event) =>
                                setField("name", event.target.value)
                            }
                            placeholder="e.g. Mathematics"
                            maxLength={100}
                            disabled={loading}
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {errors.name && (
                            <p className="text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="subject-code"
                            className="text-sm font-medium"
                        >
                            Subject Code <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="subject-code"
                            type="text"
                            value={form.code}
                            onChange={(event) =>
                                setField("code", event.target.value)
                            }
                            placeholder="e.g. MATH"
                            maxLength={50}
                            disabled={loading}
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm uppercase outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {errors.code && (
                            <p className="text-xs text-red-600">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label
                            htmlFor="subject-description"
                            className="text-sm font-medium"
                        >
                            Description
                        </label>

                        <textarea
                            id="subject-description"
                            value={form.description}
                            onChange={(event) =>
                                setField("description", event.target.value)
                            }
                            placeholder="Enter subject description"
                            maxLength={500}
                            rows={4}
                            disabled={loading}
                            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <div className="flex items-center justify-between">
                            {errors.description ? (
                                <p className="text-xs text-red-600">
                                    {errors.description}
                                </p>
                            ) : (
                                <span />
                            )}

                            <span className="text-xs text-muted-foreground">
                                {form.description.length}/500
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Assign Teachers
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select one or more teachers for this subject.
                    </p>
                </div>

                {selectedTeachers.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedTeachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-sm"
                            >
                                <span>{teacher.user.fullName}</span>

                                <button
                                    type="button"
                                    onClick={() => removeTeacher(teacher.id)}
                                    disabled={loading}
                                    aria-label={`Remove ${teacher.user.fullName}`}
                                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        type="search"
                        value={teacherSearch}
                        onChange={(event) =>
                            setTeacherSearch(event.target.value)
                        }
                        placeholder="Search teacher by name, employee ID or email..."
                        disabled={loading || teachersLoading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="max-h-72 overflow-y-auto rounded-lg border">
                        {teachersLoading ? (
                            <div className="p-4 text-sm text-muted-foreground">
                                Loading teachers...
                            </div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground">
                                No teachers found.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredTeachers.map((teacher) => {
                                    const selected = form.teacherIds.includes(
                                        teacher.id,
                                    );

                                    return (
                                        <label
                                            key={teacher.id}
                                            className="flex cursor-pointer items-center gap-3 p-3 transition hover:bg-muted/50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    toggleTeacher(teacher.id)
                                                }
                                                disabled={loading}
                                                className="h-4 w-4 rounded border-input accent-primary"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {teacher.user.fullName}
                                                </p>

                                                <p className="truncate text-xs text-muted-foreground">
                                                    {teacher.employeeId}
                                                    {teacher.designation
                                                        ? ` • ${teacher.designation}`
                                                        : ""}
                                                </p>
                                            </div>

                                            <span className="hidden text-xs text-muted-foreground sm:block">
                                                {teacher.user.email}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {form.teacherIds.length} teacher
                        {form.teacherIds.length === 1 ? "" : "s"} selected
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={loading}
                    className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? subject
                            ? "Updating..."
                            : "Creating..."
                        : subject
                            ? "Update Subject"
                            : "Create Subject"}
                </button>
            </div>
        </form>
    );
}