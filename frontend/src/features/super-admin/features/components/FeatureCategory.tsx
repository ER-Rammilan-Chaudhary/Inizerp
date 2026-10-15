"use client";

import FeatureGrid from "./FeatureGrid";

import type {
    ERPModule,
    SchoolModule,
} from "../types/feature.types";

interface Props {
    category: string;
    features: ERPModule[];
    assigned: SchoolModule[];
    schoolId: string;
}

export default function FeatureCategory({
    category,
    features,
    assigned,
    schoolId,
}: Props) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">
                {category}
            </h2>

            <FeatureGrid
                features={features}
                assigned={assigned}
                schoolId={schoolId}
            />
        </section>
    );
}