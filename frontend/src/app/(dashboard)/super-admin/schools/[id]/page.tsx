"use client";

import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import { useSchool } from "@/features/super-admin/schools/hooks/useSchool";
import SchoolHeader from "@/features/super-admin/schools/components/SchoolHeader";
import SchoolStats from "@/features/super-admin/schools/components/SchoolDetailStats";
import SchoolInformation from "@/features/super-admin/schools/components/SchoolInformation";
import SchoolOwnerCard from "@/features/super-admin/schools/components/SchoolOwnerCard";
import SchoolQuickActions from "@/features/super-admin/schools/components/SchoolQuickActions";
import SchoolStatusActions from "@/features/super-admin/schools/components/SchoolStatusActions";
import SchoolDangerZone from "@/features/super-admin/schools/components/SchoolDangerZone";

export default function SchoolDetailsPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const { data: school, isLoading, isError, error, } = useSchool(schoolId);



    if (isLoading) {
        return <Loader text="Loading School..." />;
    }

    if (isError || !school) {
        return (
            <ErrorPage
                title="Unable to load school details"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }
    return (
        <div className="w-full space-y-6 pb-12">
            {/* HEADER */}
            <SchoolHeader school={school} />

            {/* STATS */}
            <SchoolStats
                students={school._count?.students ?? 0}
                teachers={school._count?.teachers ?? 0}
                users={school._count?.users ?? 0}
            />

            {/* 2-COLUMN ENTERPRISE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Main Column: Institutional Info & Administrator (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <SchoolInformation school={school} />
                    <SchoolOwnerCard school={school} />
                </div>

                {/* Right/Sidebar Column: Quick Actions, Status & Danger Zone (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <SchoolQuickActions schoolId={school.id} />
                    <SchoolStatusActions
                        schoolId={school.id}
                        currentStatus={school.status}
                    />
                    <SchoolDangerZone
                        schoolId={school.id}
                        schoolName={school.name}
                    />
                </div>
            </div>
        </div>
    );
}