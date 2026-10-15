"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();

    const role = pathname?.split("/")[1];
    const dashboardUrl = role ? `/${role}/dashboard` : "/";


    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center">

                <div className="text-5xl">
                    🔍
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                    Page Not Found
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    The page you are looking for does not exist.
                </p>

                <Link
                    href={dashboardUrl}
                    className="mt-5 inline-block rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground">
                    Go Home
                </Link>

            </div>
        </div>
    );
}
