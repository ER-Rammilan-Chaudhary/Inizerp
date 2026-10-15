"use client";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import EditSchoolForm from "@/features/super-admin/schools/components/SchoolForm/EditSchoolForm";
import { useSchool } from "@/features/super-admin/schools/hooks/useSchool";

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;
  const {
    data: school,
    isLoading,
    isError,
  } = useSchool(schoolId);


  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader text="Loading school..." />
      </div>
    );
  }
  if (isError || !school) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold"> School not found </h2>
      </div>);
  }

  return (
    <div className="w-full space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit School: {school.name}
        </h1>
        <p className="text-xs text-muted-foreground">
          Update institutional details, admin credentials, and portal preferences.
        </p>
      </div>

      <EditSchoolForm schoolId={school.id} />
    </div>
  );

}