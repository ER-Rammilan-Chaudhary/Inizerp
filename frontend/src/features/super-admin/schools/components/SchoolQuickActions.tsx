"use client";

import Link from "next/link";
import {
    Bell,
    CreditCard,
    KeyRound,
    Pencil,
    Settings2,
    ShieldCheck,
    Activity,
    UserCog,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SchoolQuickActionsProps {
    schoolId: string;
}

const actions = (schoolId: string) => [
    {
        title: "Edit School",
        description: "Update school information",
        icon: Pencil,
        href: `/super-admin/schools/${schoolId}/edit`,
    },
    {
        title: "Manage Admin",
        description: "Assign or change school admin",
        icon: UserCog,
        href: `/super-admin/schools/${schoolId}/admins`,
    },
    {
        title: "Reset Password",
        description: "Reset school admin password",
        icon: KeyRound,
        href: `/super-admin/schools/${schoolId}/admins?tab=password`,
    },
    {
        title: "Features",
        description: "Assign ERP modules",
        icon: Settings2,
        href: `/super-admin/schools/${schoolId}/features`,
    },
    {
        title: "Subscription",
        description: "Manage school subscription",
        icon: CreditCard,
        href: `/super-admin/schools/${schoolId}/subscription`,
    },
    {
        title: "Notifications",
        description: "Send school notifications",
        icon: Bell,
        href: `/super-admin/schools/${schoolId}/notifications`,
    },
    {
        title: "Activity",
        description: "View activity logs",
        icon: Activity,
        href: `/super-admin/schools/${schoolId}/activity`,
    },
    {
        title: "Security",
        description: "School security settings",
        icon: ShieldCheck,
        href: "#",
        disabled: true,
    },
];

export default function SchoolQuickActions({
    schoolId,
}: SchoolQuickActionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {actions(schoolId).map((action) => {
                    const Icon = action.icon;

                    return (
                        <Button
                            key={action.title}
                            asChild={!action.disabled}
                            variant="outline"
                            className="h-auto justify-start p-4"
                            disabled={action.disabled}
                        >
                            {action.disabled ? (
                                <div className="flex w-full items-start gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>

                                    <div className="text-left">
                                        <p className="font-semibold">{action.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link href={action.href}>
                                    <div className="flex w-full items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>

                                        <div className="text-left">
                                            <p className="font-semibold">{action.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </Button>
                    );
                })}
            </CardContent>
        </Card>
    );
}

