"use client";

import { useEffect, useState } from "react";
import { Loader2, School, UserCheck, ShieldAlert, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTeachers } from "../../teachers/hooks/useTeachers";
import type { Class } from "../types/classes.types";

export interface ClassFormPayload {
    name: string;
    classTeacherId: string | null;
}

interface ClassFormProps {
    classItem?: Class;
    loading?: boolean;
    onSubmit: (payload: ClassFormPayload) => void | Promise<void>;
    onCancel?: () => void;
}

export default function ClassForm({
    classItem,
    loading = false,
    onSubmit,
    onCancel,
}: ClassFormProps) {
    const [name, setName] = useState("");
    const [classTeacherId, setClassTeacherId] = useState("");

    const {
        data: teachersData,
        isLoading: teachersLoading,
    } = useTeachers();

    const teachers = teachersData?.data ?? [];

    useEffect(() => {
        setName(classItem?.name ?? "");
        setClassTeacherId(classItem?.classTeacherId ?? "");
    }, [classItem]);

    const selectedTeacher = teachers.find((t) => t.id === classTeacherId);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName) return;

        await onSubmit({
            name: trimmedName,
            classTeacherId: classTeacherId || null,
        });
    };

    const isSubmitting = loading || teachersLoading;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
                {/* Class Name Input */}
                <div className="space-y-2">
                    <Label htmlFor="class-name" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <School className="h-4 w-4 text-primary" />
                        Class Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="class-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Grade 10, Class 8-A, Nursery"
                        maxLength={100}
                        disabled={isSubmitting}
                        required
                        className="h-10 text-sm bg-background border-input focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                        Provide a distinctive name representing this standard or academic level.
                    </p>
                </div>

                {/* Class Teacher Select */}
                <div className="space-y-2">
                    <Label htmlFor="class-teacher" className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <UserCheck className="h-4 w-4 text-primary" />
                        Class Teacher <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <select
                        id="class-teacher"
                        value={classTeacherId}
                        onChange={(e) => setClassTeacherId(e.target.value)}
                        disabled={isSubmitting}
                        className="border-input bg-background ring-offset-background focus-visible:ring-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">
                            {teachersLoading ? "Loading faculty members..." : "-- Select Class Teacher (Optional) --"}
                        </option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.user.fullName} ({teacher.employeeId}) {teacher.designation ? `• ${teacher.designation}` : ""}
                            </option>
                        ))}
                    </select>

                    {selectedTeacher && (
                        <div className="mt-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center">
                                    {selectedTeacher.user.fullName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{selectedTeacher.user.fullName}</p>
                                    <p className="text-muted-foreground">{selectedTeacher.user.email} • ID: {selectedTeacher.employeeId}</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-medium">
                                Assigned
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="min-w-[120px] shadow-sm font-medium"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {classItem ? "Update Class" : "Create Class"}
                </Button>
            </div>
        </form>
    );
}
