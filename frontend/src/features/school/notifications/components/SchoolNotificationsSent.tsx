"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  Loader2,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/features/super-admin/notifications/hooks/useNotifications";
import { useDeleteNotification } from "@/features/super-admin/notifications/hooks/useDeleteNotification";
import type {
  Notification,
  NotificationPriority,
  NotificationStatus,
} from "@/features/super-admin/notifications/types/notification.types";

const getStatusBadge = (status: NotificationStatus) => {
  switch (status) {
    case "SENT":
      return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs">Delivered</Badge>;
    case "SCHEDULED":
      return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-xs">Scheduled</Badge>;
    case "DRAFT":
    default:
      return <Badge variant="secondary" className="text-xs">Draft</Badge>;
  }
};

const getAudienceLabel = (item: Notification) => {
  const aud = item.audiences?.[0];
  if (!aud) return "Entire School";

  if (aud.targetType === "SCHOOL" || aud.targetType === "GLOBAL") return "Entire School";
  if (aud.targetType === "ROLE") {
    if (aud.role === "TEACHER") return "All Teachers";
    if (aud.role === "PARENT") return "All Parents";
    if (aud.role === "STUDENT") return "All Students";
    return aud.role;
  }
  if (aud.targetType === "CLASS") return "Specific Class";
  if (aud.targetType === "USER") return "Specific User";
  return aud.targetType;
};

export function SchoolNotificationsSent() {
  const { data, isLoading, isError, refetch } = useNotifications({ limit: 100 });
  const deleteMutation = useDeleteNotification();

  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  const notifications = data?.data ?? [];

  const handleDelete = async () => {
    if (!notificationToDelete) return;
    try {
      await deleteMutation.mutateAsync(notificationToDelete.id);
      setNotificationToDelete(null);
      refetch();
    } catch {
      // Error handled by hook toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading sent notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
        <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
          <Send className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-semibold">No announcements published yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click "+ Create Notification" above to send your first message to students, parents, or teachers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[38%] text-xs font-bold uppercase text-foreground">
                Notification Details
              </TableHead>
              <TableHead className="w-[18%] text-xs font-bold uppercase text-foreground">
                Target Audience
              </TableHead>
              <TableHead className="w-[12%] text-xs font-bold uppercase text-foreground">
                Category
              </TableHead>
              <TableHead className="w-[12%] text-xs font-bold uppercase text-foreground">
                Status
              </TableHead>
              <TableHead className="w-[12%] text-xs font-bold uppercase text-foreground">
                Date
              </TableHead>
              <TableHead className="w-[8%] text-right text-xs font-bold uppercase text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="align-top py-3.5">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="align-top py-3.5">
                  <Badge variant="outline" className="text-xs font-medium gap-1 bg-muted/30">
                    <Users className="h-3 w-3 text-primary" />
                    {getAudienceLabel(item)}
                  </Badge>
                </TableCell>

                <TableCell className="align-top py-3.5">
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.type.replace("_", " ")}
                  </Badge>
                </TableCell>

                <TableCell className="align-top py-3.5">
                  {getStatusBadge(item.status)}
                </TableCell>

                <TableCell className="align-top py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell className="align-top py-3.5 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationToDelete(item)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(notificationToDelete)}
        onOpenChange={(open) => !open && setNotificationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{notificationToDelete?.title}&rdquo;? This will remove the notification from recipient feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
