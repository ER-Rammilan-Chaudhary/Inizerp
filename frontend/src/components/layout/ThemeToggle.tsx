"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    );

    if (!mounted) {
        return (
            <button
                className="rounded-xl border p-2 transition hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Toggle theme"
            >
                <div className="h-[18px] w-[18px]" />
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-xl border p-2 transition hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}