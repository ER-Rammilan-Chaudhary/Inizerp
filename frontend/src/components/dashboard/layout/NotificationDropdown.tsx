"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="rounded-xl border border-border p-2 hover:bg-muted"
      >
        <Bell size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card shadow-xl">

          <div className="border-b border-border p-4 font-semibold">
            Notifications
          </div>

          <div className="p-4 space-y-4">

            <p>🏫 New School Registered</p>

            <p>👤 New User Joined</p>

            <p>💳 Subscription Renewed</p>

          </div>

        </div>
      )}

    </div>
  );
}