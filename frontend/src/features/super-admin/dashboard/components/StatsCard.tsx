"use client";
import { LucideIcon } from "lucide-react";
interface Props { title: string; value: string | number; subtitle?: string; icon: LucideIcon; color: string; }

export default function StatsCard({ title, value, subtitle, icon: Icon, color, }: Props) {

    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                        {value}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                >
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
}