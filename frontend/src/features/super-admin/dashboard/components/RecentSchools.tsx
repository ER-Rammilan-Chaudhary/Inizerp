"use client";

import Link from "next/link";
import { School } from "lucide-react";

interface SchoolType {
    id: string;
    name: string;
    isActive: boolean;
    status: string;
    createdAt: string;
}

interface Props {
    data?: SchoolType[];
}

export default function RecentSchools({ data = [] }: Props) {
    return (
        <div className="flex h-[390px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">

            <div className="flex items-center justify-between border-b px-5 py-3">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Recent Schools
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Newly registered schools
                    </p>
                </div>

                <Link
                    href="/super-admin/schools"
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                    View All
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {data.length ? (
                    data.map((school) => (
                        <SchoolRow
                            key={school.id}
                            school={school}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No schools registered yet
                    </div>
                )}
            </div>
        </div>
    );
}

function SchoolRow({ school }: { school: SchoolType }) {
    return (
        <div className="flex items-center justify-between border-b px-5 py-3 last:border-none hover:bg-muted/40">

            <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/20">
                    <School
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                    />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                        {school.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                            {school.status}
                        </span>

                        <span className="text-xs text-muted-foreground">
                            {school.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

            </div>

            <div className="ml-3 flex items-center gap-2">

                <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {timeAgo(school.createdAt)}
                </span>

                <span
                    className={`h-2 w-2 rounded-full ${school.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                />

            </div>

        </div>
    );
}

function timeAgo(date: string) {
    const diff = Math.floor(
        (Date.now() - new Date(date).getTime()) / 1000
    );

    if (diff < 60) return `${diff}s ago`;

    const mins = Math.floor(diff / 60);

    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24)
        return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

    const days = Math.floor(hrs / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
}