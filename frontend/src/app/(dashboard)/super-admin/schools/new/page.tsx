"use client";

import CreateSchoolForm from "@/features/super-admin/schools/components/SchoolForm/CreateSchoolForm";

export default function CreateSchoolPage() {

  return (
    <div className="w-full space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create School
        </h1>
        <p className="text-xs text-muted-foreground">
          Register a new institution, assign primary administrator, and configure branding.
        </p>
      </div>

      <CreateSchoolForm />
    </div>
  );
}