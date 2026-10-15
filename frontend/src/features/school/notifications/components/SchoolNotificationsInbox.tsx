"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCheck,
  Clock,
  Inbox,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useMyNotifications } from "@/features/super-admin/notifications/hooks/useMyNotifications";
import { useMarkNotificationRead } from "@/features/super-admin/notifications/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "@/features/super-admin/notifications/hooks/useMarkAllNotificationsRead";
import type { NotificationPriority } from "@/features/super-admin/notifications/types/notification.types";

const getPriorityBadgeClass = (priority: NotificationPriority) => {
  switch (priority) {
    case "URGENT":
      return "border-destructive/30 bg-destructive/10 text-destructive font-bold";
    case "HIGH":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold";
    case "LOW":
      return "border-muted-foreground/30 bg-muted/40 text-muted-foreground";
    case "NORMAL":
    default:
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }
};

export function SchoolNotificationsInbox() {
  const [readStatusFilter, setReadStatusFilter] = useState<"all" | "unread">("all");

  const { data, isLoading, isError, refetch } = useMyNotifications({
    page: 1,
    limit: 50,
    readStatus: readStatusFilter,
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success("All notifications marked as read");
      refetch();
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center">
        <ShieldAlert className="h-8 w-8 text-destructive" />
        <p className="text-sm font-semibold text-destructive">Failed to load received notifications.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Inbox Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={readStatusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setReadStatusFilter("all")}
            className="text-xs h-8"
          >
            All Received
          </Button>
          <Button
            type="button"
            variant={readStatusFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setReadStatusFilter("unread")}
            className="text-xs h-8"
          >
            Unread Only
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold">No notifications found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {readStatusFilter === "unread"
                ? "You have caught up with all your notifications!"
                : "No announcements or notices received yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const isRead = Boolean(item.isRead);
            return (
              <Card
                key={item.id}
                className={`transition-all border-border shadow-sm hover:shadow ${
                  !isRead ? "border-l-4 border-l-primary bg-primary/[0.02]" : "bg-card"
                }`}
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm sm:text-base text-foreground">
                          {item.title}
                        </span>
                        {!isRead && (
                          <Badge variant="default" className="text-[10px] h-4.5 px-1.5 font-bold">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge variant="outline" className={`text-[10px] ${getPriorityBadgeClass(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {item.type.replace("_", " ")}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {!isRead && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkRead(item.id)}
                        disabled={markReadMutation.isPending}
                        className="text-xs h-7 px-2 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <CheckCheck className="h-3.5 w-3.5 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
