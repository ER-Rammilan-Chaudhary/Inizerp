"use client";

import { Switch } from "@/components/ui/switch";

import { useToggleFeature } from "../hooks/useToggleFeature";

interface Props {
    schoolId: string;
    moduleId: string;
    enabled: boolean;
}

export default function FeatureToggle({
    schoolId,
    moduleId,
    enabled,
}: Props) {
    const { mutate, isPending } =
        useToggleFeature(schoolId);

    return (
        <Switch
            checked={enabled}
            disabled={isPending}
            onCheckedChange={(checked) => {
                mutate({
                    moduleId,
                    enabled: checked,
                });
            }}
        />
    );
}