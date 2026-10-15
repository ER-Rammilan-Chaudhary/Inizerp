"use client";

import { SchoolNotificationsInbox } from "@/features/school/notifications/components/SchoolNotificationsInbox";
import { Bell } from "lucide-react";

export default function TeacherNotificationsPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Bell className="h-6 w-6 text-primary" />
          Faculty Notifications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stay informed about academic schedules, staff announcements, and administrative updates.
        </p>
      </div>

      <SchoolNotificationsInbox />
    </div>
  );
}
