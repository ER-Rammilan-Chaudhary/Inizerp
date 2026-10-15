"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Copy,
    Edit3,
    ExternalLink,
    GraduationCap,
    Loader2,
    Mail,
    Phone,
    School,
    Share2,
    Trash2,
    User,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses } from "@/features/school/classes/hooks/useClasses";
import { AdmissionStatusBadge } from "@/features/school/admissions/components/AdmissionStatusBadge";
import {
    useAdmission,
    useDeleteAdmission,
    useUpdateAdmissionStatus,
} from "@/features/school/admissions/hooks/useAdmissions";
import type { AdmissionStatus } from "@/features/school/admissions/types/admissions.types";

function formatDateTime(value: string | null) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatDate(value: string | null) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
    }).format(new Date(value));
}

export default function AdmissionDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const admissionQuery = useAdmission(id);
    const deleteAdmission = useDeleteAdmission();
    const updateStatus = useUpdateAdmissionStatus();

    const academicYearsQuery = useAcademicYears();
    const classesQuery = useClasses();

    const admission = admissionQuery.data?.data;

    // Fallback name resolution in case backend didn't enrich
    const academicYears = academicYearsQuery.data?.data ?? [];
    const classes = classesQuery.data?.data ?? [];

    const academicYearName =
        admission?.academicYear?.name ||
        academicYears.find((y) => y.id === admission?.academicYearId)?.name ||
        admission?.academicYearId;

    const isCurrentSession =
        admission?.academicYear?.isCurrent ||
        academicYears.find((y) => y.id === admission?.academicYearId)?.isCurrent;

    const appliedClassName =
        admission?.appliedClass?.name ||
        classes.find((c) => c.id === admission?.appliedClassId)?.name ||
        (admission?.appliedClassId ? "Class Standard" : "Not specified");

    const handleStatusChange = async (
        newStatus: AdmissionStatus,
        customRemarks?: string,
    ) => {
        if (!admission) return;
        try {
            await updateStatus.mutateAsync({
                id: admission.id,
                status: newStatus,
                remarks: customRemarks ?? admission.remarks ?? undefined,
            });
            toast.success(`Application marked as ${newStatus.replace("_", " ")}`);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to update status";
            toast.error(msg);
        }
    };

    const handleDelete = async () => {
        if (!admission) return;
        try {
            await deleteAdmission.mutateAsync(admission.id);
            toast.success("Admission deleted successfully");
            router.push("/school-admin/admissions");
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to delete admission";
            toast.error(msg);
        } finally {
            setDeleteOpen(false);
        }
    };

    const copyApplicationNo = () => {
        if (!admission) return;
        navigator.clipboard.writeText(admission.applicationNo);
        toast.success("Application number copied to clipboard");
    };

    if (admissionQuery.isLoading) {
        return (
            <div className="flex min-h-[350px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading admission details...
                    </p>
                </div>
            </div>
        );
    }

    if (admissionQuery.isError || !admission) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link
                        href="/school-admin/admissions"
                        className="hover:text-foreground transition-colors"
                    >
                        Admissions
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Not Found</span>
                </div>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                    <p className="text-base font-semibold text-destructive">
                        Admission application not found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        The requested admission could not be loaded or may have been removed.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/school-admin/admissions")}
                        className="mt-4"
                    >
                        Back to Admissions List
                    </Button>
                </div>
            </div>
        );
    }

    const enrollUrl = `/school-admin/students/new?fullName=${encodeURIComponent(
        admission.studentName,
    )}&academicYearId=${admission.academicYearId}${admission.appliedClassId ? `&classId=${admission.appliedClassId}` : ""
        }${admission.guardianName
            ? `&parentFullName=${encodeURIComponent(admission.guardianName)}`
            : ""
        }${admission.guardianPhone
            ? `&parentPhone=${encodeURIComponent(admission.guardianPhone)}`
            : ""
        }&admissionId=${admission.id}`;

    const initials = admission.studentName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    return (
        <div className="w-full space-y-6">
            {/* Main Header Banner */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-inner">
                        {initials || "ST"}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {admission.studentName}
                            </h1>
                            <AdmissionStatusBadge status={admission.status} size="md" />
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                                #{admission.applicationNo}
                                <button
                                    type="button"
                                    onClick={copyApplicationNo}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    title="Copy application number"
                                >
                                    <Copy className="h-3 w-3" />
                                </button>
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Submitted {formatDate(admission.submittedAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Button Bar */}
                <div className="flex flex-wrap items-center gap-2">
                    {admission.status === "APPROVED" && (
                        <Link href={enrollUrl}>
                            <Button className="bg-primary text-primary-foreground shadow-sm">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                Enroll as Student
                            </Button>
                        </Link>
                    )}

                    {admission.status === "PENDING" && (
                        <>
                            <Button
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                onClick={() => handleStatusChange("APPROVED")}
                                disabled={updateStatus.isPending}
                            >
                                <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                                Approve
                            </Button>

                            <Button
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                onClick={() => handleStatusChange("UNDER_REVIEW")}
                                disabled={updateStatus.isPending}
                            >
                                <Clock className="mr-1.5 h-4 w-4 text-blue-600" />
                                Review
                            </Button>

                            <Button
                                variant="outline"
                                className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                onClick={() => setRejectOpen(true)}
                                disabled={updateStatus.isPending}
                            >
                                <XCircle className="mr-1.5 h-4 w-4 text-rose-600" />
                                Reject
                            </Button>
                        </>
                    )}

                    {admission.status === "UNDER_REVIEW" && (
                        <>
                            <Button
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                onClick={() => handleStatusChange("APPROVED")}
                                disabled={updateStatus.isPending}
                            >
                                <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                                Approve Application
                            </Button>

                            <Button
                                variant="outline"
                                className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                onClick={() => setRejectOpen(true)}
                                disabled={updateStatus.isPending}
                            >
                                <XCircle className="mr-1.5 h-4 w-4 text-rose-600" />
                                Reject
                            </Button>
                        </>
                    )}

                    {admission.status === "REJECTED" && (
                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("UNDER_REVIEW")}
                            disabled={updateStatus.isPending}
                        >
                            Reopen Application
                        </Button>
                    )}

                    {admission.status === "ENROLLED" && (
                        <Link href="/school-admin/students">
                            <Button variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                View in Students
                            </Button>
                        </Link>
                    )}

                    <Link href={`/school-admin/admissions/${admission.id}/edit`}>
                        <Button variant="outline">
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid Content Split */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column (2 Cols): Information Cards */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Card 1: Academic & Application Info */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <School className="h-4 w-4 text-primary" />
                                    Academic & Intake Cohort
                                </CardTitle>
                                {isCurrentSession && (
                                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                        Current Active Session
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Academic Session
                                </span>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {academicYearName}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Applied Class Standard
                                </span>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {appliedClassName}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Application Number
                                </span>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {admission.applicationNo}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Submission Date & Time
                                </span>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {formatDateTime(admission.submittedAt)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Guardian & Parent Contact */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-600" />
                                Guardian & Parent Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Parent / Guardian Name
                                </span>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {admission.guardianName || "Not provided"}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/40 p-3.5">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Contact Mobile Number
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        {admission.guardianPhone || "Not provided"}
                                    </p>
                                    {admission.guardianPhone && (
                                        <a
                                            href={`tel:${admission.guardianPhone}`}
                                            className="inline-flex items-center text-xs text-primary hover:underline ml-1"
                                            title="Call guardian"
                                        >
                                            <Phone className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Remarks & Internal Committee Observations */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Edit3 className="h-4 w-4 text-amber-600" />
                                    Committee Remarks & Review Observations
                                </CardTitle>
                                {admission.reviewedAt && (
                                    <span className="text-xs text-muted-foreground">
                                        Reviewed {formatDateTime(admission.reviewedAt)}
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                            {admission.remarks ? (
                                <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                    {admission.remarks}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    No internal remarks or committee notes recorded for this application.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (1 Col): Lifecycle Stepper & Conversion CTA */}
                <div className="space-y-6">
                    {/* Conversion CTA Box (if Approved) */}
                    {admission.status === "APPROVED" && (
                        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <CardTitle className="text-base font-bold">
                                        Approved for Admission
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs text-emerald-600 dark:text-emerald-400">
                                    This candidate meets the school criteria and is cleared for enrollment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Proceeding to enrollment will create student credentials, assign class section cohort, roll number, and setup parent profile.
                                </p>
                                <Link href={enrollUrl} className="block w-full">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Complete Student Enrollment
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stepper Card */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base font-semibold">
                                Application Lifecycle
                            </CardTitle>
                            <CardDescription className="text-xs">
                                End-to-end admission intake journey.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                {/* Step 1: Application Received */}
                                <div className="relative">
                                    <div className="absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">
                                            Application Submitted
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {formatDate(admission.submittedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2: Under Review */}
                                <div className="relative">
                                    <div
                                        className={`absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background ${admission.status === "PENDING"
                                            ? "bg-amber-500 text-white"
                                            : "bg-emerald-500 text-white"
                                            }`}
                                    >
                                        {admission.status === "PENDING" ? (
                                            <Clock className="h-2.5 w-2.5" />
                                        ) : (
                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">
                                            Committee Review
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {admission.reviewedAt
                                                ? `Reviewed on ${formatDate(admission.reviewedAt)}`
                                                : admission.status === "PENDING"
                                                    ? "Pending review"
                                                    : "Completed"}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3: Decision */}
                                <div className="relative">
                                    <div
                                        className={`absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background ${admission.status === "APPROVED" || admission.status === "ENROLLED"
                                            ? "bg-emerald-500 text-white"
                                            : admission.status === "REJECTED"
                                                ? "bg-rose-500 text-white"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {admission.status === "APPROVED" || admission.status === "ENROLLED" ? (
                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                        ) : admission.status === "REJECTED" ? (
                                            <XCircle className="h-2.5 w-2.5" />
                                        ) : (
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">
                                            Admission Decision
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {admission.status === "APPROVED" || admission.status === "ENROLLED"
                                                ? "Candidate Approved"
                                                : admission.status === "REJECTED"
                                                    ? "Application Rejected"
                                                    : "Decision Awaiting"}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4: Official Enrollment */}
                                <div className="relative">
                                    <div
                                        className={`absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background ${admission.status === "ENROLLED"
                                            ? "bg-purple-600 text-white"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {admission.status === "ENROLLED" ? (
                                            <GraduationCap className="h-2.5 w-2.5" />
                                        ) : (
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">
                                            Official Student Enrollment
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {admission.status === "ENROLLED"
                                                ? "Student Registered & Enrolled"
                                                : "Pending student registration"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>



            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Admission Application?</DialogTitle>
                        <DialogDescription>
                            This will remove application #{admission.applicationNo} for{" "}
                            {admission.studentName}. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteAdmission.isPending}
                        >
                            {deleteAdmission.isPending ? "Deleting..." : "Delete Permanently"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Application Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Admission Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject application #{admission.applicationNo}? You can optional provide remarks explaining the decision.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <textarea
                            className="w-full rounded-md border border-input bg-background p-2.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                            rows={3}
                            placeholder="Reason for rejection (e.g. seats full, age criteria not met)..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="mt-2 gap-2">
                        <Button variant="outline" onClick={() => setRejectOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setRejectOpen(false);
                                handleStatusChange("REJECTED", rejectReason || undefined);
                            }}
                            disabled={updateStatus.isPending}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}