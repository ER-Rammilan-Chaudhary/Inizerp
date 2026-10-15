"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ERPModule, SchoolModule, } from "../types/feature.types";
import FeatureToggle from "./FeatureToggle";



interface Props {
    feature: ERPModule;
    assigned?: SchoolModule;
    schoolId: string;
}

export default function FeatureCard({
    feature,
    assigned,
    schoolId,
}: Props) {
    return (
        <Card>
            <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">
                            {feature.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {feature.category}
                        </p>
                    </div>

                    {assigned && (
                        <FeatureToggle
                            schoolId={schoolId}
                            moduleId={feature.id}
                            enabled={assigned.enabled}
                        />
                    )}
                </div>

                <p className="text-sm text-muted-foreground">
                    {feature.description ??
                        "No description available."}
                </p>
            </CardContent>
        </Card>
    );
}