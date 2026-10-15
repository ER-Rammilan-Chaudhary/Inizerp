"use client";

import {
    Building2,
    CheckCircle,
    Clock,
    Ban,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface SchoolOverviewStatsProps {
    total: number;
    active: number;
    trial: number;
    suspended: number;
}

export default function SchoolOverviewStats({
    total,
    active,
    trial,
    suspended,
}: SchoolOverviewStatsProps) {

    const stats = [
        {
            title: "Total Schools",
            value: total,
            icon: Building2,
        },
        {
            title: "Active",
            value: active,
            icon: CheckCircle,
        },
        {
            title: "Trial",
            value: trial,
            icon: Clock,
        },
        {
            title: "Suspended",
            value: suspended,
            icon: Ban,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <Card key={item.title}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {item.title}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {item.value}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-primary/10 p-3">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}