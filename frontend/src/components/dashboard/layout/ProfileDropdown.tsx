"use client";

import { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        A
      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-card shadow-xl">

          <button className="flex w-full items-center gap-3 p-4 hover:bg-muted">
            <User size={18} />
            Profile
          </button>

          <button className="flex w-full items-center gap-3 p-4 hover:bg-muted">
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 p-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      )}

    </div>
  );
}