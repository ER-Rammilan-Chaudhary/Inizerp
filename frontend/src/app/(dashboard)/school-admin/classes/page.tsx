"use client";

import { Layers, Plus, School, Users, UserCheck } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ClassDeleteDialog from "@/features/school/classes/components/ClassDeleteDialog";
import ClassFilters from "@/features/school/classes/components/ClassFilters";
import ClassForm from "@/features/school/classes/components/ClassForm";
import ClassTable from "@/features/school/classes/components/ClassTable";
import {
    useClasses,
    useCreateClass,
    useDeleteClass,
} from "@/features/school/classes/hooks/useClasses";
import type {
    CreateClassPayload,
} from "@/features/school/classes/types/classes.types";
import type { Class } from "@/features/school/classes/types/classes.types";

export default function ClassesPage() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search")?.trim() ?? "";

    const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useClasses({
        search: search || undefined,
        sortBy,
        sortOrder,
    });

    const createMutation = useCreateClass();
    const deleteMutation = useDeleteClass();

    const classes = data?.data ?? [];

    const totalSections = classes.reduce((acc, c) => acc + (c.sections?.length || 0), 0);
    const totalStudents = classes.reduce((acc, c) => {
        return acc + (c.sections?.reduce((sAcc, s) => sAcc + (s.studentCount || 0), 0) || 0);
    }, 0);
    const assignedTeachers = classes.filter((c) => Boolean(c.classTeacherId)).length;

    const handleAdd = () => {
        setFormOpen(true);
    };

    const handleCreate = async (
        payload: CreateClassPayload,
    ) => {
        try {
            const response = await createMutation.mutateAsync(payload);

            toast.success(
                response.message || "Class created successfully",
            );

            setFormOpen(false);
        } catch (mutationError) {
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Failed to create class";

            toast.error(message);
        }
    };

    const handleDelete = (classItem: typeof classes[number]) => {
        setSelectedClass(classItem);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedClass) {
            return;
        }

        try {
            const response = await deleteMutation.mutateAsync(
                selectedClass.id,
            );

            toast.success(
                response.message || "Class deleted successfully",
            );

            setDeleteOpen(false);
            setSelectedClass(null);
        } catch (mutationError) {
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Failed to delete class";

            toast.error(message);
        }
    };

    const handleSortChange = (
        nextSortBy: "name" | "createdAt",
        nextSortOrder: "asc" | "desc",
    ) => {
        setSortBy(nextSortBy);
        setSortOrder(nextSortOrder);
    };

    if (isError) {
        return (
            <div className="space-y-6 w-full">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Classes & Cohorts
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage academic standards, sections and faculty leadership.
                    </p>
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive font-medium">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load classes."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <School className="h-6 w-6 text-primary" />
                        Classes
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage academic classes, sections, seat allocations, and designated class teachers.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <ClassFilters
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        disabled={isLoading}
                    />

                    <Button
                        type="button"
                        onClick={handleAdd}
                        className="shadow-sm font-medium"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <School className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Total Classes</p>
                            <p className="text-xl font-bold text-foreground">{classes.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Active Sections</p>
                            <p className="text-xl font-bold text-foreground">{totalSections}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Enrolled Students</p>
                            <p className="text-xl font-bold text-foreground">{totalStudents}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Class Teachers</p>
                            <p className="text-xl font-bold text-foreground">{assignedTeachers}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {search && (
                <div className="text-sm text-muted-foreground">
                    Search results for{" "}
                    <span className="font-medium text-foreground">
                        "{search}"
                    </span>
                </div>
            )}

            {isLoading ? (
                <div className="rounded-xl border bg-card">
                    <div className="space-y-4 p-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-12 animate-pulse rounded-md bg-muted"
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <ClassTable
                    classes={classes}
                    onDelete={handleDelete}
                />
            )}

            {/* Create Class Dialog */}
            <Dialog
                open={formOpen}
                onOpenChange={(open) => {
                    if (!createMutation.isPending) {
                        setFormOpen(open);
                    }
                }}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <School className="h-5 w-5 text-primary" />
                            Create New Class
                        </DialogTitle>
                        <DialogDescription>
                            Define a new academic standard and designate an optional faculty lead.
                        </DialogDescription>
                    </DialogHeader>

                    <ClassForm
                        loading={createMutation.isPending}
                        onSubmit={handleCreate}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ClassDeleteDialog
                open={deleteOpen}
                classItem={selectedClass}
                loading={deleteMutation.isPending}
                onOpenChange={(open) => {
                    if (deleteMutation.isPending) {
                        return;
                    }

                    setDeleteOpen(open);
                    if (!open) { setSelectedClass(null); }
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

