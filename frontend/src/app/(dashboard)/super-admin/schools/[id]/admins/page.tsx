"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import SchoolHeader from "@/features/super-admin/schools/components/SchoolHeader";
import { AdminInfoCard } from "@/features/super-admin/schools/components/admin/AdminInfoCard";
import { useSchool } from "@/features/super-admin/schools/hooks/useSchool";
import { useSchoolAdmin } from "@/features/super-admin/schools/hooks/useSchoolAdmin";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function SchoolAdminPage({
    params,
}: PageProps) {
    const { id: schoolId } = use(params);

    const {
        data: school,
        isLoading: schoolLoading,
        isError: schoolError,
    } = useSchool(schoolId);

    const {
        data: admin,
        isLoading: adminLoading,
        isError: adminError,
    } = useSchoolAdmin(schoolId);

    if (schoolLoading || adminLoading) {
        return (
            <div className="container mx-auto space-y-6 p-6">

                <Skeleton className="h-10 w-48" />

                <Skeleton className="h-24 w-full rounded-xl" />

                <Skeleton className="h-[420px] w-full rounded-xl" />

            </div>
        );
    }

    if (schoolError || adminError) {
        return (
            <div className="container mx-auto p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    Failed to load school administrator.
                </div>
            </div>
        );
    }

    if (!school || !admin) {
        notFound();
    }

    return (
        <div className="container mx-auto space-y-6">
            <SchoolHeader school={school} />
            <AdminInfoCard
                schoolId={schoolId}
                admin={admin}
            />

        </div>
    );
}