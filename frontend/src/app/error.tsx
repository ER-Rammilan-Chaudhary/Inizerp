"use client";

import Link from "next/link";

import ErrorPage from "@/components/common/error/ErrorPage";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const message = error?.message || "Something unexpected happened while loading this page.";

    return (
        <ErrorPage
            title="Application Error"
            message={message}
            onRetry={reset}
            secondaryAction={
                <Link
                    href="/"
                    className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                    Go Home
                </Link>
            }
        />
    );
}