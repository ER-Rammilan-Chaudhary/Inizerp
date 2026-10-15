"use client";

import { useParams, useRouter } from "next/navigation";
import { Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AdmissionForm from "@/features/school/admissions/components/AdmissionForm";
import {
  useAdmission,
  useUpdateAdmission,
} from "@/features/school/admissions/hooks/useAdmissions";
import type { UpdateAdmissionPayload } from "@/features/school/admissions/types/admissions.types";

export default function EditAdmissionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const admissionQuery = useAdmission(id);
  const updateAdmission = useUpdateAdmission();

  const admission = admissionQuery.data?.data;

  const handleSubmit = async (payload: UpdateAdmissionPayload) => {
    try {
      await updateAdmission.mutateAsync({
        id,
        payload,
      });
      toast.success("Admission application updated successfully");
      router.push(`/school-admin/admissions/${id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update admission";
      toast.error(message);
    }
  };

  if (admissionQuery.isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
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
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load admission details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-primary" />
            Edit Application #{admission.applicationNo}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update candidate profile, contact details, or committee decision status.
          </p>
        </div>
      </div>

      <AdmissionForm
        admission={admission}
        loading={updateAdmission.isPending}
        onSubmit={(payload) => handleSubmit(payload as UpdateAdmissionPayload)}
        onCancel={() => router.push(`/school-admin/admissions/${id}`)}
      />
    </div>
  );
}