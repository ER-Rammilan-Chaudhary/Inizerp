"use client";

import { useSearchParams } from "next/navigation";

import CreateFeatureDialog from "@/features/super-admin/features/components/CreateFeatureDialog";
import FeatureTable from "@/features/super-admin/features/components/FeatureTable";

import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useFeatureList } from "@/features/super-admin/features/hooks/useFeatureList";


export default function Page() {
    const { search } = useGlobalSearch();
    const searchParams = useSearchParams();

    const page =
        Number(searchParams.get("page")) || 1;

    const limit =
        Number(searchParams.get("limit")) || 5;

    useFeatureList({
        page,
        limit,
        search,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Feature Management
                    </h1>

                    <p className="text-muted-foreground">
                        Manage ERP modules available in the
                        platform.
                    </p>
                </div>

                <CreateFeatureDialog />
            </div>

            <FeatureTable
                search={search}
                page={page}
                limit={limit}
            />

        </div>
    );
}