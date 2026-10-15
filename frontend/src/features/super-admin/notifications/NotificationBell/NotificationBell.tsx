"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuthStore } from "@/store/auth.store";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useUnreadCount } from "../hooks/useUnreadCount";
import NotificationBellList from "./NotificationBellList";

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const { data } = useMyNotifications({
    limit: 5,
    readStatus: "unread",
  });
  const readMutation = useMarkNotificationRead();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const targetNotificationsUrl =
    user?.role === "SUPER_ADMIN"
      ? "/super-admin/notifications"
      : user?.role === "SCHOOL_ADMIN"
        ? "/school-admin/notifications"
        : "/notifications";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setOpen(false);
                router.push(targetNotificationsUrl);
              }}
            >
              View all
            </Button>
          </div>
          <NotificationBellList
            notifications={data?.data ?? []}
            onRead={(id) => readMutation.mutate(id)}
            onClose={() => setOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
