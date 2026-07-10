"use client";

import ThemeToggle from "@/components/providers/ThemeToggle";
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="relative w-80">
        <Search
          className="absolute left-3 top-3 text-muted-foreground"
          size={18}
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <ThemeToggle />

        <Bell className="cursor-pointer" />

        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      </div>
    </header>
  );
}