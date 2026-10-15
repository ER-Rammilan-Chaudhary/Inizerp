"use client";

import { Pencil, Plus, Layers, School } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import ErrorPage from "@/components/common/error/ErrorPage";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClassDetails from "@/features/school/classes/components/ClassDetails";
import SectionForm from "@/features/school/classes/components/SectionForm";
import SectionTable from "@/features/school/classes/components/SectionTable";
import { useClass, useCreateSection, useDeleteSection, useSections, useUpdateSection } from "@/features/school/classes/hooks/useClasses";
import type { ClassSection } from "@/features/school/classes/types/classes.types";
import type { SectionFormPayload } from "@/features/school/classes/components/SectionForm";

export default function ClassViewPage() {
    const params = useParams();
    const router = useRouter();

    const classId = typeof params.id === "string" ? params.id : "";

    const [sectionFormOpen, setSectionFormOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<ClassSection | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data, isLoading, isError } = useClass(classId);
    const { data: sectionsData, isLoading: sectionsLoading, isError: sectionsError } = useSections(classId);

    const createMutation = useCreateSection();
    const updateMutation = useUpdateSection();
    const deleteMutation = useDeleteSection();

    const classItem = data?.data;
    const sections = sectionsData?.data ?? [];

    const handleAddSection = () => {
        setSelectedSection(null);
        setSectionFormOpen(true);
    };

    const handleEditSection = (section: ClassSection) => {
        setSelectedSection(section);
        setSectionFormOpen(true);
    };

    const handleSubmitSection = async (payload: SectionFormPayload) => {
        try {
            if (selectedSection) {
                const response = await updateMutation.mutateAsync({
                    classId,
                    sectionId: selectedSection.id,
                    payload: { name: payload.name, capacity: payload.capacity },
                });
                toast.success(response.message || "Section updated successfully");
            } else {
                const response = await createMutation.mutateAsync({
                    classId,
                    payload: { name: payload.name, capacity: payload.capacity },
                });
                toast.success(response.message || "Section created successfully");
            }

            setSectionFormOpen(false);
            setSelectedSection(null);
        } catch (mutationError) {
            const message = mutationError instanceof Error ? mutationError.message : selectedSection ? "Failed to update section" : "Failed to create section";
            toast.error(message);
        }
    };

    const handleDeleteSection = async () => {
        if (!selectedSection) return;
        try {
            const response = await deleteMutation.mutateAsync({ classId, sectionId: selectedSection.id });
            toast.success(response.message || "Section deleted successfully");
            setDeleteOpen(false);
            setSelectedSection(null);
        } catch (mutationError) {
            const message = mutationError instanceof Error ? mutationError.message : "Failed to delete section";
            toast.error(message);
        }
    };

    if (isLoading) {
        return
        <Loader text="Class Details Loading..." />;
    }

    if (isError || !classItem) {
        return (
            <div className="space-y-4 w-full">
                <ErrorPage title="Class Details" message="Class not found or could not be loaded." />
            </div>
        );
    }

    const sectionMutationLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <School className="h-6 w-6 text-primary" />
                            {classItem.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View class metadata, faculty leadership, and section cohorts.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => router.push(`/school-admin/classes/${classItem.id}/edit`)}
                            className="shadow-sm">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Class
                        </Button>
                    </div>
                </div>

            {/* KPI Cards & Meta */}
            <ClassDetails classItem={classItem} />

            {/* Sections Management Section */}
            <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            Class Sections
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage sections, capacities, and division rosters for {classItem.name}.
                        </p>
                    </div>

                    <Button type="button" onClick={handleAddSection} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                    </Button>
                </div>

                {sectionsLoading ? (
                    <div className="rounded-xl border bg-card p-8">
                        <div className="space-y-3">
                            <div className="h-10 animate-pulse rounded-md bg-muted" />
                            <div className="h-10 animate-pulse rounded-md bg-muted" />
                            <div className="h-10 animate-pulse rounded-md bg-muted" />
                        </div>
                    </div>
                ) : sectionsError ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                        <p className="text-sm text-destructive">
                            Failed to load sections.
                        </p>
                    </div>
                ) : (
                    <SectionTable
                        sections={sections}
                        onEdit={handleEditSection}
                        onDelete={(section) => {
                            setSelectedSection(section);
                            setDeleteOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Section Form Dialog */}
            <Dialog
                open={sectionFormOpen}
                onOpenChange={(open) => {
                    if (!sectionMutationLoading) {
                        setSectionFormOpen(open);
                        if (!open) setSelectedSection(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSection ? "Edit Section" : "Add Section"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSection
                                ? "Update section details and seat capacity."
                                : `Add a new section division to ${classItem.name}.`}
                        </DialogDescription>
                    </DialogHeader>

                    <SectionForm
                        section={selectedSection}
                        loading={sectionMutationLoading}
                        onSubmit={handleSubmitSection}
                        onCancel={() => {
                            setSectionFormOpen(false);
                            setSelectedSection(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Section Dialog */}
            <Dialog
                open={deleteOpen}
                onOpenChange={(open) => {
                    if (!deleteMutation.isPending) {
                        setDeleteOpen(open);
                        if (!open) setSelectedSection(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">
                            Delete Section
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete section{" "}
                            <strong className="text-foreground">
                                {selectedSection?.name}
                            </strong>
                            ? This action will detach this section and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setDeleteOpen(false);
                                setSelectedSection(null);
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteSection}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                            Delete Section
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
