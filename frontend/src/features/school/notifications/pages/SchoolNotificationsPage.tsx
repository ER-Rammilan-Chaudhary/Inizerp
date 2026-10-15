"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Inbox, Plus, Send, ShieldAlert } from "lucide-react";
import { SchoolNotificationsInbox } from "../components/SchoolNotificationsInbox";
import { SchoolNotificationsSent } from "../components/SchoolNotificationsSent";
import { CreateSchoolNotificationDialog } from "../components/CreateSchoolNotificationDialog";
import { useNotifications } from "@/features/super-admin/notifications/hooks/useNotifications";
import { useUnreadCount } from "@/features/super-admin/notifications/hooks/useUnreadCount";

export function SchoolNotificationsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const { data: sentData } = useNotifications({ limit: 100 });
  const { data: unreadData } = useUnreadCount();

  const sentNotifications = sentData?.data ?? [];
  const unreadCount = unreadData?.unreadCount ?? 0;
  const deliveredCount = sentNotifications.filter((n) => n.status === "SENT").length;
  const urgentCount = sentNotifications.filter((n) => n.priority === "URGENT" || n.priority === "HIGH").length;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Notification Center</h1>
            <p className="mt-1 text-sm text-muted-foreground">Send school announcements, broadcast messages, and manage received alerts.</p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="h-10 gap-2 rounded-lg px-4">
          <Plus className="h-4 w-4" />
          Create Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex  items-center justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unread Received</p>
              <p className="mt-2 text-2xl font-bold">{unreadCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Awaiting your attention</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Published</p>
              <p className="mt-2 text-2xl font-bold">{sentNotifications.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">School announcements</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Send className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Delivered</p>
              <p className="mt-2 text-2xl font-bold text-emerald-500">{deliveredCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Successfully delivered</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">High / Urgent</p>
              <p className="mt-2 text-2xl font-bold text-amber-500">{urgentCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Priority notifications</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-wrap ">
          <div className="w-full border-b border-border/70 bg-muted/30">
            <TabsList className="flex h-14 w-full items-stretch justify-start rounded-none bg-transparent p-0">
              <TabsTrigger value="inbox" className="h-14 flex-1 gap-2 rounded-none border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none">
                <Inbox className="h-4 w-4" />
                Received Notifications
                <Badge variant={unreadCount > 0 ? "default" : "secondary"} className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="sent" className="h-14 flex-1 gap-2 rounded-none border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none">
                <Send className="h-4 w-4" />
                Sent Announcements
                <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                  {sentNotifications.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="w-full">
            <TabsContent value="inbox" className="m-0 w-full p-0">
              <div className="w-full">
                <SchoolNotificationsInbox />
              </div>
            </TabsContent>

            <TabsContent value="sent" className="m-0 w-full p-0">
              <div className="w-full">
                <SchoolNotificationsSent />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <CreateSchoolNotificationDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}

export default SchoolNotificationsPage;
