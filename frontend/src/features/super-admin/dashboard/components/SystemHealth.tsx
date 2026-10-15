"use client";

import {
    Building2,
    CheckCircle2,
    Clock3,
    Database,
    Server,
    Users,
    Wifi,
} from "lucide-react";

interface SystemHealthData {
    database: string;
    platform: string;
    schools: {
        total: number;
        active: number;
        inactive: number;
    };
    users: {
        total: number;
        active: number;
        inactive: number;
    };
    subscriptions: {
        active: number;
    };
    notifications: {
        unread: number;
    };
    serverTime: string;
}

interface Props {
    data?: SystemHealthData;
    isLoading?: boolean;
}

export default function SystemHealth({
    data,
    isLoading,
}: Props) {
    if (isLoading) {
        return (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                Loading system health...
            </div>
        );
    }

    if (!data) return null;

    const cards = [
        {
            title: "Platform",
            value: data.platform,
            icon: Wifi,
            color: "bg-green-500",
        },
        {
            title: "Database",
            value: data.database,
            icon: Database,
            color: "bg-blue-500",
        },
        {
            title: "Schools",
            value: `${data.schools.active}/${data.schools.total}`,
            icon: Building2,
            color: "bg-indigo-500",
        },
        {
            title: "Users",
            value: `${data.users.active}/${data.users.total}`,
            icon: Users,
            color: "bg-purple-500",
        },
        {
            title: "Subscriptions",
            value: data.subscriptions.active,
            icon: CheckCircle2,
            color: "bg-emerald-500",
        },
        {
            title: "Unread Notifications",
            value: data.notifications.unread,
            icon: Server,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Server className="text-primary" />
                    <h2 className="text-lg font-semibold">
                        System Health
                    </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    Healthy
                </span>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="rounded-xl border p-5 transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {card.title}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold">
                                        {card.value}
                                    </h3>
                                </div>

                                <div
                                    className={`${card.color} flex h-12 w-12 items-center justify-center rounded-xl text-white`}
                                >
                                    <Icon size={22} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 size={16} />
                    Last Server Sync :
                    {new Date(data.serverTime).toLocaleString()}
                </div>
            </div>
        </div>
    );
}