"use client";

import {
    CreditCard,
    CheckCircle,
    Clock3,
    AlertTriangle,
    Ban,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useSubscriptionStats } from "../hooks/useSubscriptionStats";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
}

function StatCard({
    title,
    value,
    icon,
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold">
                        {value}
                    </h2>
                </div>

                <div className="rounded-lg bg-muted p-3">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SubscriptionStats() {
    const {
        data,
        isLoading,
    } = useSubscriptionStats();

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="space-y-3 p-6">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
                title="Total"
                value={data?.total ?? 0}
                icon={
                    <CreditCard className="h-6 w-6 text-primary" />
                }
            />

            <StatCard
                title="Active"
                value={data?.active ?? 0}
                icon={
                    <CheckCircle className="h-6 w-6 text-green-600" />
                }
            />

            <StatCard
                title="Trial"
                value={data?.trial ?? 0}
                icon={
                    <Clock3 className="h-6 w-6 text-blue-600" />
                }
            />

            <StatCard
                title="Expired"
                value={data?.expired ?? 0}
                icon={
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                }
            />

            <StatCard
                title="Cancelled"
                value={data?.cancelled ?? 0}
                icon={
                    <Ban className="h-6 w-6 text-red-600" />
                }
            />
        </div>
    );
}