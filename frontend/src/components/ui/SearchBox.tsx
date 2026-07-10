"use client";

import { Search } from "lucide-react";

export default function SearchBox() {
  return (
    <div className="relative w-full max-w-sm">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 outline-none focus:border-primary"
      />

    </div>
  );
}