"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import { School } from "@/types/school";

interface SchoolHeaderProps {
  school: School;
}

export default function SchoolHeader({
  school,
}: SchoolHeaderProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            {school.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={school.logo}
                alt={school.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <Building2 className="h-10 w-10 text-primary" />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {school.name}
            </h1>

            <p className="mt-1 text-muted-foreground">
              {school.email || "No email available"}
            </p>

            <p className="text-sm text-muted-foreground">
              {school.slug}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
          >
            <Link href="/super-admin/schools">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <Button asChild>
            <Link
              href={`/super-admin/schools/${school.id}/edit`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit School
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}