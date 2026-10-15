"use client";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import AdmissionForm from "@/features/school/admissions/components/AdmissionForm";
import { useCreateAdmission } from "@/features/school/admissions/hooks/useAdmissions";
import type { CreateAdmissionPayload } from "@/features/school/admissions/types/admissions.types";

export default function CreateAdmissionPage() {
  const router = useRouter();
  const createAdmission = useCreateAdmission();

  const handleSubmit = async (payload: CreateAdmissionPayload) => {
    try {
      await createAdmission.mutateAsync(payload);
      toast.success("Admission application registered successfully");
      router.push("/school-admin/admissions");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create admission";
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            New Admission Application
          </h1>
          <p className="text-sm text-muted-foreground">
            Register a student inquiry or application and allocate target academic cohort.
          </p>
        </div>
      </div>

      <AdmissionForm
        loading={createAdmission.isPending}
        onSubmit={(payload) => handleSubmit(payload as CreateAdmissionPayload)}
        onCancel={() => router.push("/school-admin/admissions")}
      />
    </div>
  );
}