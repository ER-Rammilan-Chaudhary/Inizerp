"use client";

import Link from "next/link";
import { Bell, Megaphone, ShieldCheck, Sparkles } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    scope: string;
    createdAt: string;
}

interface Props {
    data?: Notification[];
}

export default function RecentNotifications({ data = [] }: Props) {
    return (
        <div className="flex h-[390px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-3">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Recent Notifications
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Latest platform updates
                    </p>
                </div>

                <Link
                    href="/super-admin/notifications"
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                    View All
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No Notifications
                    </div>
                ) : (
                    data.slice(0, 5).map((item) => (
                        <NotificationRow key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>
    );
}

function NotificationRow({ item }: { item: Notification }) {
    const config = getConfig(item.type);
    const Icon = config.icon;

    return (
        <div className="flex items-center justify-between border-b px-5 py-3 last:border-none hover:bg-muted/40">
            <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                    <Icon size={18} className={config.color} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                        {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {item.message}
                    </p>
                </div>
            </div>

            <div className="ml-3 flex items-center gap-2">
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {timeAgo(item.createdAt)}
                </span>
                <span className={`h-2 w-2 rounded-full ${config.dot}`} />
            </div>
        </div>
    );
}

function getConfig(type: string) {
    switch (type) {
        case "FEATURE_UPDATE":
            return {
                icon: Sparkles,
                bg: "bg-purple-100 dark:bg-purple-500/20",
                color: "text-purple-600 dark:text-purple-400",
                dot: "bg-purple-500",
            };

        case "SYSTEM":
            return {
                icon: ShieldCheck,
                bg: "bg-blue-100 dark:bg-blue-500/20",
                color: "text-blue-600 dark:text-blue-400",
                dot: "bg-blue-500",
            };

        case "ALERT":
            return {
                icon: Bell,
                bg: "bg-red-100 dark:bg-red-500/20",
                color: "text-red-600 dark:text-red-400",
                dot: "bg-red-500",
            };

        default:
            return {
                icon: Megaphone,
                bg: "bg-orange-100 dark:bg-orange-500/20",
                color: "text-orange-600 dark:text-orange-400",
                dot: "bg-orange-500",
            };
    }
}

function timeAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;

    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}