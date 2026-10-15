"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";

import { useFeatureList } from "../hooks/useFeatureList";
import { useSchoolFeatures } from "../hooks/useSchoolFeatures";

import AssignFeaturesDialog from "./AssignFeaturesDialog";
import FeatureCategory from "./FeatureCategory";

import type { ERPModule } from "../types/feature.types";

interface Props {
    schoolId: string;
}

const EMPTY_FEATURES: ERPModule[] = [];

export default function FeaturesPage({
    schoolId,
}: Props) {
    const router = useRouter();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useFeatureList({
        page: 1,
        limit: 100,
    });

    const features = data ?? EMPTY_FEATURES;
    console.log(features);


    const { data: schoolFeatures = [], } = useSchoolFeatures(schoolId);

    const groups = useMemo(() => {
        const result: Record<
            string,
            ERPModule[]
        > = {};

        for (const feature of features) {
            if (!result[feature.category]) {
                result[feature.category] = [];
            }

            result[feature.category].push(feature);
        }

        return result;
    }, [features]);

    if (isLoading) {
        return (
            <Loader text="Loading Features..." />
        );
    }

    if (isError) {
        return (
            <ErrorPage
                title="Unable to load Features"
                message={
                    error instanceof Error
                        ? error.message
                        : "Please try again in a moment."
                }
                onRetry={() =>
                    window.location.reload()
                }
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        School Features
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage ERP modules assigned to this
                        school.
                    </p>
                </div>

                <div className="flex gap-3">
                    <AssignFeaturesDialog
                        schoolId={schoolId}
                    />
                </div>
            </div>

            <div className="space-y-8">
                {Object.keys(groups).length === 0 ? (
                    <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
                        No features found.
                    </div>
                ) : (
                    Object.entries(groups).map(
                        ([category, items]) => (
                            <FeatureCategory
                                key={category}
                                category={category}
                                features={items}
                                assigned={schoolFeatures}
                                schoolId={schoolId}
                            />
                        ),
                    )
                )}
            </div>
        </div>
    );
}