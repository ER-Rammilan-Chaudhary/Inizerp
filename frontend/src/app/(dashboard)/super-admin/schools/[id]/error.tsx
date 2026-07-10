"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          School Not Found
        </h1>

        <p className="mt-3 text-muted-foreground">
          The requested school does not exist or may have been removed.
        </p>

        <Button
          asChild
          className="mt-6"
        >
          <Link href="/super-admin/schools">
            Back to Schools
          </Link>
        </Button>
      </div>
    </div>
  );
}