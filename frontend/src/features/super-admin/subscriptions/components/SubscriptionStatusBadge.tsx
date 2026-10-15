"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { SubscriptionStatus } from "../types/subscription";

interface SubscriptionStatusBadgeProps {
    status: SubscriptionStatus;
    className?: string;
}

const statusConfig: Record<
    SubscriptionStatus,
    {
        label: string;
        className: string;
    }
> = {
    ACTIVE: {
        label: "Active",
        className:
            "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
    },

    TRIAL: {
        label: "Trial",
        className:
            "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
    },

    EXPIRED: {
        label: "Expired",
        className:
            "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },

    CANCELLED: {
        label: "Cancelled",
        className:
            "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
    },
};

export default function SubscriptionStatusBadge({
    status,
    className,
}: SubscriptionStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium",
                config.className,
                className,
            )}
        >
            {config.label}
        </Badge>
    );
}