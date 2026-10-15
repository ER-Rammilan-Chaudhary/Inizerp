"use client";

import { useFeatureList } from "../hooks/useFeatureList";

import EditFeatureDialog from "./EditFeatureDialog";
import DeleteFeatureDialog from "./DeleteFeatureDialog";


interface Props {
    search: string;
    page: number;
    limit: number;
}

export default function FeatureTable({
    search,
    page,
    limit,
}: Props) {
    const {
        data,
        isLoading,
        isError,
    } = useFeatureList({
        page,
        limit,
        search,
    });
    const features = data ?? [];

    if (isLoading) {
        return (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
                Loading features...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border p-8 text-center text-destructive">
                Failed to load features.
            </div>
        );
    }

    if (features.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
                No features found.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Key
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Route
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {features.map((feature) => (

                            <tr
                                key={feature.id}
                                className="border-b last:border-b-0"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {feature.name}
                                </td>

                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {feature.key}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {feature.category}
                                </td>

                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {feature.route ?? "-"}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={
                                            feature.isActive
                                                ? "text-sm font-medium text-green-600"
                                                : "text-sm font-medium text-muted-foreground"
                                        }
                                    >
                                        {feature.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <EditFeatureDialog
                                            feature={feature}
                                        />

                                        <DeleteFeatureDialog
                                            feature={feature}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}