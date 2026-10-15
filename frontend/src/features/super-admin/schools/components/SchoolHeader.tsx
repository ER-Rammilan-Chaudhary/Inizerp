"use client";

import Link from "next/link";
import { Building2, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { School } from "@/features/super-admin/schools/types/school";

interface SchoolHeaderProps {
    school: School;
}

const statusVariant: Record<
    School["status"],
    "default" | "secondary" | "destructive" | "outline"
> = {
    ACTIVE: "default",
    TRIAL: "secondary",
    SUSPENDED: "destructive",
};

export default function SchoolHeader({ school }: SchoolHeaderProps) {
    return (
        <div className="flex flex-col gap-6 rounded-xl border bg-background p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">

                    {school.logo ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${school.logo}`}
                            alt={school.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold">{school.name}</h1>

                        <Badge variant={statusVariant[school.status]}>
                            {school.status}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground capitalize">
                        School Code : {school.code}
                    </p>

                    {/* <p className="text-sm text-muted-foreground">
                        Slug : {school.slug}
                    </p> */}
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button asChild>
                    <Link href={`/super-admin/schools/${school.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit School
                    </Link>
                </Button>
            </div>
        </div>
    );
}