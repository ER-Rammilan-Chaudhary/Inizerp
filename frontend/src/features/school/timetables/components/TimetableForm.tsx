"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSections } from "@/features/school/classes/hooks/useClasses";

import type {
    CreateTimetablePayload,
    Timetable,
    TimetableDay,
    TimetableTeacher,
    TimetableSubject,
    UpdateTimetablePayload,
} from "../types/timetables.types";

interface TimetableFormProps {
    timetable?: Timetable;
    academicYears: {
        id: string;
        name: string;
        code: string;
    }[];
    classes: {
        id: string;
        name: string;
    }[];
    sections?: {
        id: string;
        name: string;
    }[];
    subjects: TimetableSubject[];
    teachers: TimetableTeacher[];
    isSubmitting?: boolean;
    onSubmit: (
        payload: CreateTimetablePayload | UpdateTimetablePayload,
    ) => void | Promise<void>;
    onCancel?: () => void;
}

interface FormState {
    academicYearId: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    day: TimetableDay | "";
    startTime: string;
    endTime: string;
    period: string;
    roomNo: string;
}

const days: { value: TimetableDay; label: string }[] = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
];

const getInitialState = (timetable?: Timetable): FormState => ({
    academicYearId: timetable?.academicYearId ?? "",
    classId: timetable?.classId ?? "",
    sectionId: timetable?.sectionId ?? "",
    subjectId: timetable?.subjectId ?? "",
    teacherId: timetable?.teacherId ?? "",
    day: timetable?.day ?? "",
    startTime: timetable?.startTime ?? "",
    endTime: timetable?.endTime ?? "",
    period: timetable?.period ? String(timetable.period) : "",
    roomNo: timetable?.roomNo ?? "",
});

export default function TimetableForm({
    timetable,
    academicYears,
    classes,
    sections: fallbackSections = [],
    subjects,
    teachers,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: TimetableFormProps) {
    const [form, setForm] = useState<FormState>(getInitialState(timetable));
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Dynamically fetch sections for the currently selected class
    const sectionsQuery = useSections(form.classId);
    const availableSections =
        sectionsQuery.data?.data ?? fallbackSections;

    useEffect(() => {
        setForm(getInitialState(timetable));
        setErrors({});
    }, [timetable]);

    const updateField = <K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setErrors((current) => ({
            ...current,
            [key]: "",
        }));
    };

    const handleClassChange = (selectedClassId: string | null) => {
        setForm((current) => ({
            ...current,
            classId: selectedClassId ?? "",
            sectionId: "", // reset section when class changes to avoid mismatched section
        }));

        setErrors((current) => ({
            ...current,
            classId: "",
            sectionId: "",
        }));
    };

    const validate = (): boolean => {
        const nextErrors: Record<string, string> = {};

        if (!form.classId) {
            nextErrors.classId = "Class is required";
        }

        if (!form.subjectId) {
            nextErrors.subjectId = "Subject is required";
        }

        if (!form.teacherId) {
            nextErrors.teacherId = "Teacher is required";
        }

        if (!form.day) {
            nextErrors.day = "Day is required";
        }

        if (!form.period || Number(form.period) < 1) {
            nextErrors.period = "Valid period number is required";
        }

        if (!form.startTime) {
            nextErrors.startTime = "Start time is required";
        }

        if (!form.endTime) {
            nextErrors.endTime = "End time is required";
        }

        if (form.startTime && form.endTime && form.startTime >= form.endTime) {
            nextErrors.endTime = "End time must be after start time";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            academicYearId: form.academicYearId || null,
            classId: form.classId,
            sectionId: form.sectionId || null,
            subjectId: form.subjectId,
            teacherId: form.teacherId,
            day: form.day as TimetableDay,
            startTime: form.startTime,
            endTime: form.endTime,
            period: Number(form.period),
            roomNo: form.roomNo.trim() || null,
        };

        await onSubmit(payload);
    };

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            window.history.back();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Schedule Details
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure class, period, time, subject, and assigned teacher.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Academic Session */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Academic Session
                        </label>

                        <Select
                            value={form.academicYearId || "none"}
                            onValueChange={(value) =>
                                updateField(
                                    "academicYearId",
                                    value === "none" || value === null ? "" : value,
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Default (Current Academic Session)" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    Current Academic Session (Default)
                                </SelectItem>

                                {academicYears.map((academicYear) => (
                                    <SelectItem
                                        key={academicYear.id}
                                        value={academicYear.id}
                                    >
                                        {academicYear.name} ({academicYear.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Class */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Class <span className="text-destructive">*</span>
                        </label>

                        <Select
                            value={form.classId}
                            onValueChange={handleClassChange}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className={errors.classId ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>

                            <SelectContent>
                                {classes.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.classId && (
                            <p className="text-xs text-destructive">{errors.classId}</p>
                        )}
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Section
                            </label>
                            {sectionsQuery.isFetching && (
                                <span className="text-xs text-muted-foreground">
                                    Loading sections...
                                </span>
                            )}
                        </div>

                        <Select
                            value={form.sectionId || "none"}
                            onValueChange={(value) =>
                                updateField(
                                    "sectionId",
                                    value === "none" || value === null ? "" : value,
                                )
                            }
                            disabled={!form.classId || isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        !form.classId
                                            ? "Select class first"
                                            : "Whole Class (No section)"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    Whole Class (All sections)
                                </SelectItem>

                                {availableSections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        Section {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Subject <span className="text-destructive">*</span>
                        </label>

                        <Select
                            value={form.subjectId}
                            onValueChange={(value) =>
                                updateField("subjectId", value ?? "")
                            }
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className={errors.subjectId ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>

                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.subjectId && (
                            <p className="text-xs text-destructive">{errors.subjectId}</p>
                        )}
                    </div>

                    {/* Teacher */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Teacher <span className="text-destructive">*</span>
                        </label>

                        <Select
                            value={form.teacherId}
                            onValueChange={(value) =>
                                updateField("teacherId", value ?? "")
                            }
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className={errors.teacherId ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select teacher">
                                    {form.teacherId
                                        ? teachers.find((t) => t.id === form.teacherId)?.user.fullName ?? "Select teacher"
                                        : "Select teacher"}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.id}>
                                        {teacher.user.fullName}
                                        {teacher.designation ? ` (${teacher.designation})` : ` [${teacher.employeeId}]`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.teacherId && (
                            <p className="text-xs text-destructive">{errors.teacherId}</p>
                        )}
                    </div>

                    {/* Day */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Day <span className="text-destructive">*</span>
                        </label>

                        <Select
                            value={form.day}
                            onValueChange={(value) =>
                                updateField("day", value as TimetableDay)
                            }
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className={errors.day ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select day" />
                            </SelectTrigger>

                            <SelectContent>
                                {days.map((day) => (
                                    <SelectItem key={day.value} value={day.value}>
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.day && (
                            <p className="text-xs text-destructive">{errors.day}</p>
                        )}
                    </div>

                    {/* Period */}
                    <div className="space-y-2">
                        <label htmlFor="period" className="text-sm font-medium">
                            Period Number <span className="text-destructive">*</span>
                        </label>

                        <input
                            id="period"
                            type="number"
                            min={1}
                            max={20}
                            value={form.period}
                            onChange={(event) =>
                                updateField("period", event.target.value)
                            }
                            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                                errors.period ? "border-destructive" : ""
                            }`}
                            placeholder="e.g. 1"
                            disabled={isSubmitting}
                        />

                        {errors.period && (
                            <p className="text-xs text-destructive">{errors.period}</p>
                        )}
                    </div>

                    {/* Room Number */}
                    <div className="space-y-2">
                        <label htmlFor="roomNo" className="text-sm font-medium">
                            Room Number / Lab (Optional)
                        </label>

                        <input
                            id="roomNo"
                            type="text"
                            maxLength={50}
                            value={form.roomNo}
                            onChange={(event) =>
                                updateField("roomNo", event.target.value)
                            }
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Room 101 or Physics Lab"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                        <label htmlFor="startTime" className="text-sm font-medium">
                            Start Time <span className="text-destructive">*</span>
                        </label>

                        <input
                            id="startTime"
                            type="time"
                            value={form.startTime}
                            onChange={(event) =>
                                updateField("startTime", event.target.value)
                            }
                            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                                errors.startTime ? "border-destructive" : ""
                            }`}
                            disabled={isSubmitting}
                        />

                        {errors.startTime && (
                            <p className="text-xs text-destructive">{errors.startTime}</p>
                        )}
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                        <label htmlFor="endTime" className="text-sm font-medium">
                            End Time <span className="text-destructive">*</span>
                        </label>

                        <input
                            id="endTime"
                            type="time"
                            value={form.endTime}
                            onChange={(event) =>
                                updateField("endTime", event.target.value)
                            }
                            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                                errors.endTime ? "border-destructive" : ""
                            }`}
                            disabled={isSubmitting}
                        />

                        {errors.endTime && (
                            <p className="text-xs text-destructive">{errors.endTime}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {isSubmitting
                        ? timetable
                            ? "Updating..."
                            : "Creating..."
                        : timetable
                            ? "Update Timetable"
                            : "Create Timetable"}
                </button>
            </div>
        </form>
    );
}