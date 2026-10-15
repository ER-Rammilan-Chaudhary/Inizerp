"use client";
import Link from "next/link";
import { Plus, School2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import SchoolTable from "@/features/super-admin/schools/components/SchoolTable";
import SchoolOverviewStats from "@/features/super-admin/schools/components/SchoolOverviewStats";
import { useSchools } from "@/features/super-admin/schools/hooks/useSchools";
import { useSearchStore } from "@/store/search.store";
import type { School } from "@/features/super-admin/schools/types/school";

import Pagination from "@/components/tables/Pagination";

export default function SchoolsPage() {
    const searchParams = useSearchParams();
    const search = useSearchStore((state) => state.search);
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;


    const { data, isLoading, error } = useSchools({ page, limit, search, });


    const schools = data?.schools ?? [];
    const pagination = data?.pagination;

    const active = schools.filter(
        (school: School) => school.status === "ACTIVE"
    ).length;

    const trial = schools.filter(
        (school: School) => school.status === "TRIAL"
    ).length;

    const suspended = schools.filter(
        (school: School) => school.status === "SUSPENDED"
    ).length;

    if (isLoading && !data) {
        return <Loader text="Loading schools..." />;
    }

    if (error) {
        return (
            <Card className="border-red-200">
                <CardContent className="flex h-72 items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-red-600">
                            Failed to load schools
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            {(error as Error).message}
                        </p>

                        <Button
                            className="mt-5"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <School2 className="h-7 w-7 text-primary" />
                            </div>

                            <div>
                                <CardTitle className="text-3xl">
                                    Schools
                                </CardTitle>

                                <CardDescription>
                                    Manage all registered schools from one place.
                                </CardDescription>
                            </div>
                        </div>

                        <Button asChild>
                            <Link href="/super-admin/schools/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add School
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <SchoolOverviewStats
                total={pagination?.total ?? 0}
                active={active}
                trial={trial}
                suspended={suspended}
            />

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            School Directory
                        </CardTitle>

                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            {pagination?.total ?? 0} Records
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="px-0! overflow-x-auto">
                    <SchoolTable
                        schools={schools}
                        loading={isLoading}
                    />
                </CardContent>

                {/* Pagination */}
                {pagination && (
                    <div className="px-6">
                        <Pagination pagination={pagination} />
                    </div>
                )}
            </Card>
        </div>
    );
}