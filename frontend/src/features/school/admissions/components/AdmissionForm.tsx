"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  GraduationCap,
  Hash,
  Loader2,
  Phone,
  RefreshCw,
  Sparkles,
  User,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAcademicYears } from "@/features/school/academic-years/hooks/useAcademicYears";
import { useClasses } from "@/features/school/classes/hooks/useClasses";

import { admissionsApi } from "../api/admissions.api";
import type {
  Admission,
  AdmissionStatus,
  CreateAdmissionPayload,
  UpdateAdmissionPayload,
} from "../types/admissions.types";

interface AdmissionFormProps {
  admission?: Admission;
  loading?: boolean;
  onSubmit: (
    payload: CreateAdmissionPayload | UpdateAdmissionPayload,
  ) => void;
  onCancel?: () => void;
}

interface FormState {
  academicYearId: string;
  applicationNo: string;
  studentName: string;
  appliedClassId: string;
  guardianName: string;
  guardianPhone: string;
  remarks: string;
  status: AdmissionStatus;
}

const initialForm: FormState = {
  academicYearId: "",
  applicationNo: "",
  studentName: "",
  appliedClassId: "",
  guardianName: "",
  guardianPhone: "",
  remarks: "",
  status: "PENDING",
};

export default function AdmissionForm({
  admission,
  loading = false,
  onSubmit,
  onCancel,
}: AdmissionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);

  const academicYearsQuery = useAcademicYears();
  const classesQuery = useClasses();

  const academicYears = academicYearsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  const [loadingNextNo, setLoadingNextNo] = useState(false);

  const fetchSequentialApplicationNo = async (targetYearId?: string) => {
    try {
      setLoadingNextNo(true);
      const res = await admissionsApi.getNextApplicationNo(
        targetYearId || form.academicYearId,
      );
      if (res.data?.applicationNo) {
        setForm((prev) => ({
          ...prev,
          applicationNo: res.data.applicationNo,
        }));
      }
    } catch {
      const selectedYear = academicYears.find(
        (y) => y.id === (targetYearId || form.academicYearId),
      );
      const match =
        selectedYear?.name.match(/\d{4}/) || selectedYear?.code?.match(/\d{4}/);
      const yearStr = match ? match[0] : new Date().getFullYear().toString();
      setForm((prev) => ({
        ...prev,
        applicationNo: `APP-${yearStr}-001`,
      }));
    } finally {
      setLoadingNextNo(false);
    }
  };

  useEffect(() => {
    if (admission) {
      setForm({
        academicYearId: admission.academicYearId || "",
        applicationNo: admission.applicationNo || "",
        studentName: admission.studentName || "",
        appliedClassId: admission.appliedClassId ?? "",
        guardianName: admission.guardianName ?? "",
        guardianPhone: admission.guardianPhone ?? "",
        remarks: admission.remarks ?? "",
        status: (admission.status as AdmissionStatus) || "PENDING",
      });
    } else if (academicYears.length > 0 && !form.academicYearId) {
      const currentYear =
        academicYears.find((y) => y.isCurrent) || academicYears[0];
      if (currentYear) {
        setForm((prev) => ({
          ...prev,
          academicYearId: currentYear.id,
        }));
        fetchSequentialApplicationNo(currentYear.id);
      }
    }
  }, [admission, academicYears]);

  const handleAcademicYearChange = (yearId: string) => {
    setForm((prev) => ({
      ...prev,
      academicYearId: yearId,
    }));
    if (!admission) {
      fetchSequentialApplicationNo(yearId);
    }
  };

  const generateApplicationNo = () => {
    fetchSequentialApplicationNo(form.academicYearId);
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (admission) {
      const payload: UpdateAdmissionPayload = {
        academicYearId: form.academicYearId,
        applicationNo: form.applicationNo.trim(),
        studentName: form.studentName.trim(),
        appliedClassId: form.appliedClassId || null,
        guardianName: form.guardianName.trim() || null,
        guardianPhone: form.guardianPhone.trim() || null,
        remarks: form.remarks.trim() || null,
        status: form.status,
      };
      onSubmit(payload);
    } else {
      const payload: CreateAdmissionPayload = {
        academicYearId: form.academicYearId,
        applicationNo: form.applicationNo.trim(),
        studentName: form.studentName.trim(),
        appliedClassId: form.appliedClassId || null,
        guardianName: form.guardianName.trim() || null,
        guardianPhone: form.guardianPhone.trim() || null,
        remarks: form.remarks.trim() || null,
      };
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1: Academic & Cohort Allocation */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Academic & Intake Details
              </CardTitle>
              <CardDescription className="text-xs">
                Select target academic session and assigned class standard.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {/* Academic Year */}
          <div className="space-y-2">
            <Label htmlFor="academicYearId" className="text-xs font-semibold">
              Academic Session <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <select
                id="academicYearId"
                name="academicYearId"
                value={form.academicYearId}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                disabled={loading || academicYearsQuery.isLoading}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isCurrent ? "★ (Current Active Session)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Application Number */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="applicationNo" className="text-xs font-semibold">
                Application Number <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={generateApplicationNo}
                disabled={loading || loadingNextNo}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium disabled:opacity-50"
              >
                {loadingNextNo ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {loadingNextNo ? "Generating..." : "Next Sequence"}
              </button>
            </div>
            <div className="relative">
              <Input
                id="applicationNo"
                name="applicationNo"
                value={form.applicationNo}
                onChange={handleChange}
                disabled={loading || loadingNextNo}
                required
                maxLength={50}
                placeholder="e.g. APP-2026-001"
                className=" font-medium"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sequential format: <span className=" font-medium text-foreground">APP-YYYY-001</span>
            </p>
          </div>

          {/* Applied Class */}
          <div className="space-y-2">
            <Label htmlFor="appliedClassId" className="text-xs font-semibold">
              Applied Class Standard
            </Label>
            <select
              id="appliedClassId"
              name="appliedClassId"
              value={form.appliedClassId}
              onChange={handleChange}
              disabled={loading || classesQuery.isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Class Standard (Optional)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector (available if editing) */}
          {admission && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-semibold">
                Application Review Status <span className="text-destructive">*</span>
              </Label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
              >
                <option value="PENDING">Pending Initial Review</option>
                <option value="UNDER_REVIEW">Under Committee Review</option>
                <option value="APPROVED">Approved for Enrollment</option>
                <option value="ENROLLED">Enrolled as Student</option>
                <option value="REJECTED">Rejected / Cancelled</option>
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: Applicant Identity */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Candidate Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Candidate's legal identification details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-xs font-semibold">
              Student Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studentName"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              disabled={loading}
              required
              maxLength={100}
              placeholder="e.g. Aarav Sharma"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Guardian / Parent Details */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Guardian & Parent Contact
              </CardTitle>
              <CardDescription className="text-xs">
                Primary point of contact for admission correspondence.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="guardianName" className="text-xs font-semibold">
              Guardian / Parent Name
            </Label>
            <Input
              id="guardianName"
              name="guardianName"
              value={form.guardianName}
              onChange={handleChange}
              disabled={loading}
              maxLength={100}
              placeholder="e.g. Rajesh Sharma"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone" className="text-xs font-semibold">
              Guardian Mobile Number
            </Label>
            <div className="relative">
              <Input
                id="guardianPhone"
                name="guardianPhone"
                value={form.guardianPhone}
                onChange={handleChange}
                disabled={loading}
                maxLength={20}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: Remarks & Committee Notes */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Remarks & Committee Notes
              </CardTitle>
              <CardDescription className="text-xs">
                Add any special intake conditions, documents verified, or evaluation notes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            id="remarks"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            disabled={loading}
            maxLength={1000}
            rows={4}
            placeholder="Enter application observations, previous school details, fee scholarship notes, or internal remarks..."
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push("/school-admin/admissions");
            }
          }}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : admission ? (
            "Update Application"
          ) : (
            "Create Application"
          )}
        </Button>
      </div>
    </form>
  );
}