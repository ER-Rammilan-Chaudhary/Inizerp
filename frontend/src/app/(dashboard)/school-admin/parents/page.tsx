"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Briefcase,
    GraduationCap,
    Plus,
    Search,
    UserCheck,
    UserRound,
    Users,
} from "lucide-react";
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
import ParentDeleteDialog from "@/features/school/parents/components/ParentDeleteDialog";
import ParentDetailsDialog from "@/features/school/parents/components/ParentDetailsDialog";
import ParentFilters from "@/features/school/parents/components/ParentFilters";
import ParentForm from "@/features/school/parents/components/ParentForm";
import ParentTable from "@/features/school/parents/components/ParentTable";
import {
    useCreateParent,
    useDeleteParent,
    useParents,
    useUpdateParent,
} from "@/features/school/parents/hooks/useParents";
import type {
    CreateParentPayload,
    Parent,
    ParentFilterParams,
    UpdateParentPayload,
} from "@/features/school/parents/types/parents.types";

const defaultFilters: ParentFilterParams = {
    sortBy: "createdAt",
    sortOrder: "desc",
};

export default function ParentsPage() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search")?.trim() ?? "";

    const [filters, setFilters] = useState<ParentFilterParams>(defaultFilters);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

    const { data, isLoading, isError, error } = useParents();
    const createMutation = useCreateParent();
    const updateMutation = useUpdateParent();
    const deleteMutation = useDeleteParent();

    const allParents = data?.data ?? [];

    // Filter and sort parents client-side using global header search
    const filteredParents = useMemo(() => {
        let list = [...allParents];

        if (search) {
            const query = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.user.fullName.toLowerCase().includes(query) ||
                    p.user.email.toLowerCase().includes(query) ||
                    (p.user.phone && p.user.phone.toLowerCase().includes(query)) ||
                    (p.occupation && p.occupation.toLowerCase().includes(query)),
            );
        }

        if (filters.sortBy === "fullName") {
            list.sort((a, b) => {
                const cmp = a.user.fullName.localeCompare(b.user.fullName);
                return filters.sortOrder === "desc" ? -cmp : cmp;
            });
        } else {
            list.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            });
        }

        return list;
    }, [allParents, filters, search]);

    // KPI Metrics
    const totalParents = allParents.length;
    const totalLinkedStudents = allParents.reduce(
        (acc, p) => acc + (p.students?.length ?? 0),
        0,
    );
    const activeParents = allParents.filter((p) => p.user.status === "ACTIVE").length;
    const employedParents = allParents.filter((p) => Boolean(p.occupation)).length;

    const handleCreate = () => {
        setSelectedParent(null);
        setFormOpen(true);
    };

    const handleView = (parent: Parent) => {
        setSelectedParent(parent);
        setViewOpen(true);
    };

    const handleEdit = (parent: Parent) => {
        setSelectedParent(parent);
        setFormOpen(true);
    };

    const handleDelete = (parent: Parent) => {
        setSelectedParent(parent);
        setDeleteOpen(true);
    };

    const handleFormSubmit = async (
        payload: CreateParentPayload | UpdateParentPayload,
    ) => {
        try {
            if (selectedParent) {
                await updateMutation.mutateAsync({
                    id: selectedParent.id,
                    payload: payload as UpdateParentPayload,
                });
                toast.success("Parent profile updated successfully");
            } else {
                await createMutation.mutateAsync(payload as CreateParentPayload);
                toast.success("Parent registered successfully");
            }

            setFormOpen(false);
            setSelectedParent(null);
        } catch (mutationError) {
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : selectedParent
                    ? "Failed to update parent"
                    : "Failed to create parent";
            toast.error(message);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedParent) return;

        try {
            await deleteMutation.mutateAsync(selectedParent.id);
            toast.success("Parent account deleted successfully");
            setDeleteOpen(false);
            setSelectedParent(null);
        } catch (mutationError) {
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Failed to delete parent";
            toast.error(message);
        }
    };

    if (isError) {
        return (
            <div className="w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Parents & Guardians
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage parent portal accounts and student-family linkages.
                    </p>
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive font-medium">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load parents directory."}
                    </p>
                </div>
            </div>
        );
    }

    const isFormPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <UserRound className="h-6 w-6 text-primary" />
                        Parents & Guardians
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage parent accounts, contact information, and student association records.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleCreate}
                    className="shadow-sm font-medium self-start sm:self-center"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Parent
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Total Parents</p>
                            <p className="text-xl font-bold text-foreground">{totalParents}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Active Accounts</p>
                            <p className="text-xl font-bold text-foreground">{activeParents}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Linked Students</p>
                            <p className="text-xl font-bold text-foreground">{totalLinkedStudents}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-medium">Occupations Listed</p>
                            <p className="text-xl font-bold text-foreground">{employedParents}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Global Header Search Active Pill */}
            {search && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3.5 py-2 rounded-lg border border-border/60">
                    <Search className="h-4 w-4 text-primary shrink-0" />
                    <span>
                        Searching parent records matching:{" "}
                        <strong className="text-foreground">"{search}"</strong>
                    </span>
                </div>
            )}

            {/* Filter Controls (Sort & Reset) */}
            <ParentFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
            />

            {/* Table */}
            {isLoading ? (
                <div className="rounded-xl border bg-card p-8">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
                        ))}
                    </div>
                </div>
            ) : (
                <ParentTable
                    parents={filteredParents}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Create / Edit Dialog */}
            <Dialog
                open={formOpen}
                onOpenChange={(open) => {
                    if (!isFormPending) {
                        setFormOpen(open);
                        if (!open) setSelectedParent(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <UserRound className="h-5 w-5 text-primary" />
                            {selectedParent ? "Edit Parent Details" : "Register New Parent"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedParent
                                ? "Update contact credentials, profession, or linked students."
                                : "Create a parent portal account and link enrolled students."}
                        </DialogDescription>
                    </DialogHeader>

                    <ParentForm
                        parentItem={selectedParent}
                        loading={isFormPending}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setFormOpen(false);
                            setSelectedParent(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Details View Dialog */}
            <ParentDetailsDialog
                open={viewOpen}
                parentItem={selectedParent}
                onOpenChange={(open) => {
                    setViewOpen(open);
                    if (!open) setSelectedParent(null);
                }}
                onEdit={handleEdit}
            />

            {/* Delete Confirmation Dialog */}
            <ParentDeleteDialog
                open={deleteOpen}
                parentItem={selectedParent}
                loading={deleteMutation.isPending}
                onOpenChange={(open) => {
                    if (!deleteMutation.isPending) {
                        setDeleteOpen(open);
                        if (!open) setSelectedParent(null);
                    }
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
