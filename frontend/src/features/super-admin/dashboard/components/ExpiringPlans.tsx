"use client";

import { CalendarClock } from "lucide-react";

interface ExpiringPlan {
    id: string;
    schoolName: string;
    plan: string;
    expiryDate: string;
    daysLeft: number;
}

interface Props {
    data?: ExpiringPlan[];
    isLoading?: boolean;
}

export default function ExpiringPlans({
    data = [],
    isLoading = false,
}: Props) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
                <CalendarClock className="text-primary" size={22} />
                <h2 className="text-lg font-bold">
                    Expiring Plans
                </h2>
            </div>

            {isLoading && (
                <div className="py-8 text-center text-muted-foreground">
                    Loading...
                </div>
            )}

            {!isLoading && data.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                    No expiring plans
                </div>
            )}

            {!isLoading && data.length > 0 && (
                <div className="space-y-4">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition"
                        >
                            <div>
                                <h3 className="font-semibold">
                                    {item.schoolName}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {item.plan}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Expires :
                                    {" "}
                                    {new Date(item.expiryDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.daysLeft <= 3
                                        ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                        : item.daysLeft <= 7
                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                            : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                        }`}
                                >
                                    {item.daysLeft} Days Left
                                </span>

                                <button className="mt-3 block rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90">
                                    Renew
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}