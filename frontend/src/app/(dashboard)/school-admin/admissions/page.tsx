"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  User,
  Users,
  X,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useAdmissions,
  useDeleteAdmission,
  useUpdateAdmissionStatus,
} from "@/features/school/admissions/hooks/useAdmissions";
import type {
  Admission,
  AdmissionStatus,
} from "@/features/school/admissions/types/admissions.types";

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdmissionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [academicYearId, setAcademicYearId] = useState("ALL");
  const [classId, setClassId] = useState("ALL");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedAdmissionForDelete, setSelectedAdmissionForDelete] =
    useState<Admission | null>(null);

  const admissionsQuery = useAdmissions();
  const deleteAdmission = useDeleteAdmission();
  const updateStatus = useUpdateAdmissionStatus();

  const academicYearsQuery = useAcademicYears();
  const classesQuery = useClasses();

  const rawAdmissions = admissionsQuery.data?.data ?? [];
  const academicYears = academicYearsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  // Create lookup maps for fast resolution
  const yearMap = useMemo(
    () => new Map(academicYears.map((y) => [y.id, y.name])),
    [academicYears],
  );
  const classMap = useMemo(
    () => new Map(classes.map((c) => [c.id, c.name])),
    [classes],
  );

  // Statistics across all loaded admissions
  const totalCount = rawAdmissions.length;
  const pendingCount = rawAdmissions.filter(
    (a) => (a.status || "").toUpperCase() === "PENDING",
  ).length;
  const underReviewCount = rawAdmissions.filter(
    (a) => (a.status || "").toUpperCase() === "UNDER_REVIEW",
  ).length;
  const approvedCount = rawAdmissions.filter(
    (a) => (a.status || "").toUpperCase() === "APPROVED",
  ).length;
  const enrolledCount = rawAdmissions.filter(
    (a) => (a.status || "").toUpperCase() === "ENROLLED",
  ).length;
  const rejectedCount = rawAdmissions.filter(
    (a) => (a.status || "").toUpperCase() === "REJECTED",
  ).length;

  // Filtered dataset
  const filteredAdmissions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rawAdmissions.filter((admission) => {
      // Search matching
      const matchesSearch =
        !q ||
        admission.applicationNo.toLowerCase().includes(q) ||
        admission.studentName.toLowerCase().includes(q) ||
        (admission.guardianName ?? "").toLowerCase().includes(q) ||
        (admission.guardianPhone ?? "").toLowerCase().includes(q);

      // Status matching
      const matchesStatus =
        statusFilter === "ALL" ||
        admission.status.toUpperCase() === statusFilter.toUpperCase();

      // Academic Year matching
      const matchesYear =
        academicYearId === "ALL" ||
        admission.academicYearId === academicYearId;

      // Class matching
      const matchesClass =
        classId === "ALL" ||
        admission.appliedClassId === classId;

      return matchesSearch && matchesStatus && matchesYear && matchesClass;
    });
  }, [rawAdmissions, search, statusFilter, academicYearId, classId]);

  const handleQuickStatusChange = async (
    id: string,
    newStatus: AdmissionStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status: newStatus,
      });
      toast.success(`Application marked as ${newStatus.replace("_", " ")}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdmission.mutateAsync(deleteId);
      toast.success("Admission deleted successfully");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete admission";
      toast.error(msg);
    } finally {
      setDeleteId(null);
      setSelectedAdmissionForDelete(null);
    }
  };

  const copyApplicationNo = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("Application number copied to clipboard");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setAcademicYearId("ALL");
    setClassId("ALL");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    statusFilter !== "ALL" ||
    academicYearId !== "ALL" ||
    classId !== "ALL";

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Admissions & Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Track student intake applications, manage committee reviews, and transition approved candidates to enrolled students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => admissionsQuery.refetch()}
            disabled={admissionsQuery.isFetching}
            className="h-9"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${admissionsQuery.isFetching ? "animate-spin" : ""
                }`}
            />
            Refresh
          </Button>

          <Link href="/school-admin/enrollments">
            <Button variant="outline" size="sm" className="h-9">
              <GraduationCap className="mr-2 h-4 w-4 text-purple-600" />
              Enrollments View
            </Button>
          </Link>

          <Link href="/school-admin/admissions/new">
            <Button size="sm" className="h-9 shadow-sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Admission
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Applications */}
        <Card
          className={`cursor-pointer transition-all hover:border-primary/50 ${statusFilter === "ALL"
            ? "ring-2 ring-primary/20 border-primary"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("ALL")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total
              </span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">
              {totalCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              All applications
            </span>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card
          className={`cursor-pointer transition-all hover:border-amber-400 ${statusFilter === "PENDING"
            ? "ring-2 ring-amber-400/20 border-amber-500 bg-amber-50/20"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("PENDING")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Pending
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {pendingCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              Awaiting review
            </span>
          </CardContent>
        </Card>

        {/* Under Review */}
        <Card
          className={`cursor-pointer transition-all hover:border-blue-400 ${statusFilter === "UNDER_REVIEW"
            ? "ring-2 ring-blue-400/20 border-blue-500 bg-blue-50/20"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("UNDER_REVIEW")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                In Review
              </span>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {underReviewCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              Committee scrutiny
            </span>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card
          className={`cursor-pointer transition-all hover:border-emerald-400 ${statusFilter === "APPROVED"
            ? "ring-2 ring-emerald-400/20 border-emerald-500 bg-emerald-50/20"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("APPROVED")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Approved
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {approvedCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              Ready to enroll
            </span>
          </CardContent>
        </Card>

        {/* Enrolled */}
        <Card
          className={`cursor-pointer transition-all hover:border-purple-400 ${statusFilter === "ENROLLED"
            ? "ring-2 ring-purple-400/20 border-purple-500 bg-purple-50/20"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("ENROLLED")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                Enrolled
              </span>
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
              {enrolledCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              Official students
            </span>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card
          className={`cursor-pointer transition-all hover:border-rose-400 ${statusFilter === "REJECTED"
            ? "ring-2 ring-rose-400/20 border-rose-500 bg-rose-50/20"
            : "border-border/60"
            }`}
          onClick={() => setStatusFilter("REJECTED")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                Rejected
              </span>
              <XCircle className="h-4 w-4 text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {rejectedCount}
            </p>
            <span className="text-[11px] text-muted-foreground">
              Not admitted
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, application no, parent name, mobile..."
                className="pl-9 pr-8 h-10 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Academic Session Selector */}
            <div className="w-full lg:w-48">
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ALL">All Academic Years</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isCurrent ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Standard Selector */}
            <div className="w-full lg:w-44">
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ALL">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="w-full lg:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-10 text-muted-foreground hover:text-foreground shrink-0"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3.5 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              Applications List
            </span>
            <Badge variant="secondary" className="text-xs font-medium">
              {filteredAdmissions.length} of {totalCount}
            </Badge>
          </div>

          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground">
              Filters active • Showing matching records
            </span>
          )}
        </div>

        {admissionsQuery.isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading admissions applications...
              </p>
            </div>
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">No admissions found</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {hasActiveFilters
                ? "No applications matched your current filters. Try resetting search criteria."
                : "No student admission applications registered yet."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            ) : (
              <Link href="/school-admin/admissions/new">
                <Button size="sm" className="mt-4">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create First Admission
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Application No</th>
                  <th className="px-5 py-3.5">Candidate Name</th>
                  <th className="px-5 py-3.5">Academic Cohort</th>
                  <th className="px-5 py-3.5">Guardian Contact</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitted</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAdmissions.map((admission) => {
                  const resolvedYearName =
                    admission.academicYear?.name ||
                    yearMap.get(admission.academicYearId) ||
                    "Session";
                  const resolvedClassName =
                    admission.appliedClass?.name ||
                    (admission.appliedClassId
                      ? classMap.get(admission.appliedClassId) || "Standard"
                      : null);

                  const initials = admission.studentName
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("");

                  const enrollUrl = `/school-admin/students/new?fullName=${encodeURIComponent(
                    admission.studentName,
                  )}&academicYearId=${admission.academicYearId}${admission.appliedClassId
                    ? `&classId=${admission.appliedClassId}`
                    : ""
                    }${admission.guardianName
                      ? `&parentFullName=${encodeURIComponent(
                        admission.guardianName,
                      )}`
                      : ""
                    }${admission.guardianPhone
                      ? `&parentPhone=${encodeURIComponent(
                        admission.guardianPhone,
                      )}`
                      : ""
                    }&admissionId=${admission.id}`;

                  return (
                    <tr
                      key={admission.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Application No */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/school-admin/admissions/${admission.id}`}
                            className=" font-semibold text-primary hover:underline"
                          >
                            {admission.applicationNo}
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              copyApplicationNo(admission.applicationNo)
                            }
                            className="text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition-opacity"
                            title="Copy number"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>

                      {/* Candidate Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {initials || "ST"}
                          </div>
                          <div>
                            <Link
                              href={`/school-admin/admissions/${admission.id}`}
                              className="font-medium text-foreground hover:underline block leading-tight"
                            >
                              {admission.studentName}
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Academic Cohort */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                              {resolvedYearName}
                            </span>
                            {resolvedClassName && (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-normal"
                              >
                                {resolvedClassName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Guardian Contact */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {admission.guardianName || "-"}
                          </p>
                          {admission.guardianPhone && (
                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Phone className="h-2.5 w-2.5" />
                              <a href={`tel:${admission.guardianPhone}`}
                                className="hover:underline"
                              >
                                {admission.guardianPhone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <AdmissionStatusBadge status={admission.status} />
                      </td>

                      {/* Submitted Date */}
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {formatDate(admission.submittedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If Approved: Quick CTA to Enroll */}
                          {admission.status === "APPROVED" && (
                            <Link href={enrollUrl}>
                              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 font-medium" >
                                <GraduationCap className="mr-1 h-3.5 w-3.5" />
                                Enroll
                              </Button>
                            </Link>
                          )}

                          {/* If Pending: Quick Approve button */}
                          {admission.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs px-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              onClick={() =>
                                handleQuickStatusChange(admission.id, "APPROVED")
                              }
                              title="Approve Application"
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                              Approve
                            </Button>
                          )}

                          <Link
                            href={`/school-admin/admissions/${admission.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs px-2.5"
                            >
                              View
                            </Button>
                          </Link>

                          {/* Dropdown Menu for secondary actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <Link
                                href={`/school-admin/admissions/${admission.id}`}
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Full Details
                                </DropdownMenuItem>
                              </Link>

                              <Link
                                href={`/school-admin/admissions/${admission.id}/edit`}
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Edit Application
                                </DropdownMenuItem>
                              </Link>

                              <DropdownMenuSeparator />

                              {/* Status Change Shortcuts */}
                              {admission.status !== "APPROVED" && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-emerald-600"
                                  onClick={() =>
                                    handleQuickStatusChange(
                                      admission.id,
                                      "APPROVED",
                                    )
                                  }
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Approved
                                </DropdownMenuItem>
                              )}

                              {admission.status !== "UNDER_REVIEW" &&
                                admission.status !== "APPROVED" && (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-blue-600"
                                    onClick={() =>
                                      handleQuickStatusChange(
                                        admission.id,
                                        "UNDER_REVIEW",
                                      )
                                    }
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark Under Review
                                  </DropdownMenuItem>
                                )}

                              {admission.status !== "REJECTED" && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-rose-600"
                                  onClick={() =>
                                    handleQuickStatusChange(
                                      admission.id,
                                      "REJECTED",
                                    )
                                  }
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as Rejected
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedAdmissionForDelete(admission);
                                  setDeleteId(admission.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Application
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setSelectedAdmissionForDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admission Application?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete application #
              {selectedAdmissionForDelete?.applicationNo} for{" "}
              {selectedAdmissionForDelete?.studentName}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteId(null);
                setSelectedAdmissionForDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteAdmission.isPending}
            >
              {deleteAdmission.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}