"use client";

import * as React from "react";
import { CalendarIcon, Activity } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
interface DashboardHeroProps {
    hero?: { adminName?: string; role?: string; }
    ;
}

export default function DashboardHero({ hero, }: DashboardHeroProps) {
    const [date, setDate] = React.useState(new Date());
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight"> Dashboard </h1 >
                    <p className="mt-2 text-lg text-muted-foreground">{greeting},{" "}
                        <span className="font-semibold text-foreground"> {hero?.adminName ?? "Admin"}</span > {" "}👋
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        <Activity className="h-4 w-4 fill-current" />
                        Platform Healthy
                    </div>
                </div>
                <Popover>
                    <PopoverTrigger
                        className="flex h-11 items-center gap-2 rounded-xl border bg-background px-4 shadow-sm transition hover:bg-muted">
                        <CalendarIcon className="h-4 w-4" />
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", })}
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={(value) => value && setDate(value)} />
                    </PopoverContent>
                </Popover>
            </div>
        </section>
    );
}