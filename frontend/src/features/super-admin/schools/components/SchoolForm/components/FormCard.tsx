"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormCardProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function FormCard({
    title,
    description,
    icon,
    children,
    className,
}: FormCardProps) {
    return (
        <section
            className={cn(
                "rounded-2xl border bg-card p-6 shadow-sm transition-colors",
                className
            )}
        >
            <div className="mb-6 flex items-start gap-4">
                {icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted">
                        {icon}
                    </div>
                )}

                <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </section>
    );
}