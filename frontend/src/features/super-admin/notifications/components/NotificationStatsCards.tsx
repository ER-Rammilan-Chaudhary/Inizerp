"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Bell,
    CalendarDays,
    Globe,
    School,
    AlertTriangle,
    Megaphone,
} from "lucide-react";

import type {
    NotificationStats,
} from "../types/notification.types";

interface Props {
    stats?: NotificationStats;
}

export default function NotificationStatsCards({
    stats,
}: Props) {

    const cards = [
        {
            title: "Total",
            value: stats?.total ?? 0,
            icon: Bell,
        },
        {
            title: "Today",
            value: stats?.today ?? 0,
            icon: CalendarDays,
        },
        {
            title: "Global",
            value: stats?.byScope?.global ?? 0,
            icon: Globe,
        },
        {
            title: "School",
            value: stats?.byScope?.school ?? 0,
            icon: School,
        },
        {
            title: "High Priority",
            value: stats?.byPriority?.high ?? 0,
            icon: AlertTriangle,
        },
        {
            title: "Announcement",
            value: stats?.byType?.announcement ?? 0,
            icon: Megaphone,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {card.value}
                        </div>
                    </CardContent>
                </Card>
            ))}

        </div>
    );

}