"use client";

import { BookOpen, School, Users, DoorOpen, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassForm from "@/features/school/classes/components/ClassForm";
import {
    useClass,
    useUpdateClass,
} from "@/features/school/classes/hooks/useClasses";
import type { UpdateClassPayload } from "@/features/school/classes/types/classes.types";

export default function EditClassPage() {
    const params = useParams();
    const router = useRouter();

    const classId =
        typeof params.id === "string"
            ? params.id
            : "";

    const {
        data,
        isLoading,
        isError,
        error,
    } = useClass(classId);

    const updateMutation = useUpdateClass();

    const classItem = data?.data;

    const handleSubmit = async (
        payload: UpdateClassPayload,
    ) => {
        if (!classId) {
            toast.error("Invalid class ID");
            return;
        }

        try {
            const response =
                await updateMutation.mutateAsync({
                    id: classId,
                    payload,
                });

            toast.success(
                response.message ||
                "Class updated successfully",
            );

            router.push("/school-admin/classes");
        } catch (mutationError) {
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Failed to update class";

            toast.error(message);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 w-full">
                <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 rounded-xl border bg-card p-6 space-y-4">
                        <div className="h-10 animate-pulse rounded-md bg-muted" />
                        <div className="h-10 animate-pulse rounded-md bg-muted" />
                        <div className="h-10 w-32 animate-pulse rounded-md bg-muted ml-auto" />
                    </div>
                    <div className="lg:col-span-4 rounded-xl border bg-card p-6 space-y-4">
                        <div className="h-24 animate-pulse rounded-md bg-muted" />
                        <div className="h-32 animate-pulse rounded-md bg-muted" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !classItem) {
        return (
            <div className="space-y-6 w-full">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Class
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update academic standard settings.
                    </p>
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive font-medium">
                        {error instanceof Error
                            ? error.message
                            : "Class not found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Class: {classItem.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update class information
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/school-admin/classes/${classItem.id}`)}
                        className="text-xs sm:text-sm"
                    >
                        View Class
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                    <Card className="shadow-sm border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <School className="h-5 w-5 text-primary" />
                                Class Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ClassForm
                                classItem={classItem}
                                loading={updateMutation.isPending}
                                onSubmit={handleSubmit}
                                onCancel={() => router.push("/school-admin/classes")}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">

                    {/* Snapshot Card */}
                    <Card className="shadow-sm border-border bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                <DoorOpen className="h-4 w-4 text-primary" />
                                Class Snapshot
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3.5 text-xs">
                            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                                <span className="text-muted-foreground">Class Standard</span>
                                <span className="font-semibold text-foreground">{classItem.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                                <span className="text-muted-foreground">Total Sections</span>
                                <span className="font-semibold text-foreground">{classItem.sections?.length ?? 0} Sections</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                                <span className="text-muted-foreground">Enrolled Students</span>
                                <span className="font-semibold text-foreground">{classItem.studentCount ?? 0} Students</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                                <span className="text-muted-foreground">Current Teacher</span>
                                <span className="font-semibold text-foreground">
                                    {classItem.classTeacher?.user.fullName ?? "None Assigned"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                                <span className="text-muted-foreground">Created On</span>
                                <span className="text-foreground">
                                    {new Date(classItem.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Management Card */}
                    <Card className="shadow-sm border-border bg-muted/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Academic Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-xs text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p>
                                    Assigning a <strong>Class Teacher</strong> designates primary responsibility for student attendance, report cards, and discipline logs.
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p>
                                    Individual student enrollment is mapped to specific <strong>Sections</strong> within this class.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}