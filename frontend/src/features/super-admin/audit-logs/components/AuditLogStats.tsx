// features/audit-logs/components/AuditLogStats.tsx
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { AuditStats } from "../types/audit-logs.types";

interface Props {
    stats?: AuditStats;
}

export default function AuditLogStats({ stats }: Props) {
    const items = [
        {
            label: "Total Logs",
            value: stats?.total ?? 0,
        },
        {
            label: "Today",
            value: stats?.today ?? 0,
        },
        {
            label: "This Week",
            value: stats?.thisWeek ?? 0,
        },
        {
            label: "This Month",
            value: stats?.thisMonth ?? 0,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {item.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {item.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}