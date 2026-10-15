"use client";

import Link from "next/link";
import {
    Settings,
    ShieldCheck,
    MonitorCog,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const settingsSections = [
    {
        title: "General",
        description:
            "Manage application name, contact information, timezone and other general settings.",
        href: "/super-admin/settings/general",
        icon: Settings,
    },
    {
        title: "Security",
        description:
            "Manage password policy, login security, sessions and authentication settings.",
        href: "/super-admin/settings/security",
        icon: ShieldCheck,
    },
    {
        title: "System",
        description:
            "Manage system configuration, maintenance mode and application settings.",
        href: "/super-admin/settings/system",
        icon: MonitorCog,
    },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage your application settings
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {settingsSections.map((section) => {
                    const Icon = section.icon;

                    return (
                        <Link
                            key={section.title}
                            href={section.href}
                            className="group block h-full"
                        >
                            <Card className="h-full border border-border/80 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
                                <CardHeader>
                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {section.title}
                                    </CardTitle>

                                    <CardDescription className="text-xs leading-relaxed">
                                        {section.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Manage {section.title} Settings →
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}