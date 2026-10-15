"use client";

import {
    Users,
    CreditCard,
    Bell,
    Building2,
} from "lucide-react";

interface Props {
    users: number;
    plans: number;
    notifications: number;
    schools: number;
}

export default function SummaryCards({
    users,
    plans,
    notifications,
    schools,
}: Props) {
    const cards = [
        {
            title: "Total Users",
            value: users,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Total Plans",
            value: plans,
            icon: CreditCard,
            color: "bg-emerald-500",
        },
        {
            title: "Unread Notifications",
            value: notifications,
            icon: Bell,
            color: "bg-orange-500",
        },
        {
            title: "Total Schools",
            value: schools,
            icon: Building2,
            color: "bg-violet-500",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border bg-card p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                            >
                                <Icon size={22} className="text-white" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}