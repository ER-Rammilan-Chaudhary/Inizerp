"use client";

import { useMemo } from "react";

import FeatureCard from "./FeatureCard";

import type {
    ERPModule,
    SchoolModule,
} from "../types/feature.types";

interface Props {
    features: ERPModule[];
    assigned: SchoolModule[];
    schoolId: string;
}

export default function FeatureGrid({
    features,
    assigned,
    schoolId,
}: Props) {
    const assignedMap = useMemo(() => new Map(assigned.map((item) => [item.module.id, item,]),), [assigned],);

    return (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-6">
            {features.map((feature) => (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    assigned={assignedMap.get(feature.id)}
                    schoolId={schoolId}
                />
            ))}
        </div>
    );
}