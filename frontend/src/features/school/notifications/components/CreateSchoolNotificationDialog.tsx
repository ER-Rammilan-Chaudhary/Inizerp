"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Send, Loader2, Users, GraduationCap, School } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useClasses } from "@/features/school/classes/hooks/useClasses";
import type { Class } from "@/features/school/classes/types/classes.types";
import { useCreateNotification } from "@/features/super-admin/notifications/hooks/useCreateNotification";
import type {
  CreateNotificationDto,
  NotificationAudience,
  NotificationPriority,
  NotificationType,
} from "@/features/super-admin/notifications/types/notification.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSchoolNotificationDialog({ open, onOpenChange }: Props) {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId ?? null;
  const { data: classesData, isLoading: classesLoading } = useClasses();
  const createMutation = useCreateNotification();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("ANNOUNCEMENT");
  const [priority, setPriority] = useState<NotificationPriority>("NORMAL");
  const [targetAudience, setTargetAudience] = useState<
    "ALL_TEACHERS" | "ALL_PARENTS" | "ALL_STUDENTS" | "SCHOOL" | "CLASS"
  >("SCHOOL");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [sendImmediately, setSendImmediately] = useState(true);

  const classes: Class[] = classesData?.data ?? [];

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setType("ANNOUNCEMENT");
    setPriority("NORMAL");
    setTargetAudience("SCHOOL");
    setSelectedClassId("");
    setSendImmediately(true);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter notification message content");
      return;
    }

    if (targetAudience === "CLASS" && !selectedClassId) {
      toast.error("Please select a target class");
      return;
    }

    let audiences: NotificationAudience[] = [];

    if (targetAudience === "SCHOOL") {
      audiences = [{ targetType: "SCHOOL", schoolId }];
    } else if (targetAudience === "ALL_TEACHERS") {
      audiences = [{ targetType: "ROLE", schoolId, role: "TEACHER" }];
    } else if (targetAudience === "ALL_PARENTS") {
      audiences = [{ targetType: "ROLE", schoolId, role: "PARENT" }];
    } else if (targetAudience === "ALL_STUDENTS") {
      audiences = [{ targetType: "ROLE", schoolId, role: "STUDENT" }];
    } else if (targetAudience === "CLASS") {
      audiences = [{ targetType: "CLASS", schoolId, classId: selectedClassId }];
    }

    const payload: CreateNotificationDto = {
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      status: sendImmediately ? "SENT" : "DRAFT",
      schoolId,
      audiences,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success(
        sendImmediately
          ? "Notification sent successfully to recipients!"
          : "Notification saved as draft.",
      );
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create notification";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Create New Notification</DialogTitle>
              <DialogDescription>
                Publish announcements, exam notices, or emergency alerts to your school community.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Notification Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day Announcement"
              className="h-10 text-sm"
              disabled={createMutation.isPending}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold">
              Message Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the complete notification message for students, parents, or staff..."
              rows={4}
              className="text-sm resize-none"
              disabled={createMutation.isPending}
              required
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category / Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as NotificationType)}
                disabled={createMutation.isPending}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANNOUNCEMENT">General Announcement</SelectItem>
                  <SelectItem value="EXAM">Examination & Tests</SelectItem>
                  <SelectItem value="FEES">Fees & Accounts</SelectItem>
                  <SelectItem value="ATTENDANCE">Attendance Alert</SelectItem>
                  <SelectItem value="HOMEWORK">Homework & Assignment</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency Notice</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="SYSTEM">System Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Priority Level</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as NotificationPriority)}
                disabled={createMutation.isPending}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent (Immediate Alert)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2 pt-1 border-t border-border/60">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Target Audience <span className="text-destructive">*</span>
            </Label>
            <Select
              value={targetAudience}
              onValueChange={(val: any) => setTargetAudience(val)}
              disabled={createMutation.isPending}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHOOL">Entire School Community (Everyone)</SelectItem>
                <SelectItem value="ALL_TEACHERS">All Teachers & Faculty</SelectItem>
                <SelectItem value="ALL_PARENTS">All Parents / Guardians</SelectItem>
                <SelectItem value="ALL_STUDENTS">All Students</SelectItem>
                <SelectItem value="CLASS">Specific Class Only</SelectItem>
              </SelectContent>
            </Select>

            {/* If Specific Class selected */}
            {targetAudience === "CLASS" && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  Select Target Class
                </Label>
                <Select
                  value={selectedClassId}
                  onValueChange={(val) => setSelectedClassId(val ?? "")}
                  disabled={createMutation.isPending || classesLoading}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder={classesLoading ? "Loading classes..." : "Select class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: Class) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Delivery Option */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Immediate Delivery</p>
              <p className="text-xs text-muted-foreground">
                Delivers instantly to all recipient dashboards & notification bells.
              </p>
            </div>
            <Button
              type="button"
              variant={sendImmediately ? "default" : "outline"}
              size="sm"
              onClick={() => setSendImmediately(!sendImmediately)}
              className="text-xs font-semibold"
            >
              {sendImmediately ? "Send Now (Active)" : "Save as Draft"}
            </Button>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="gap-2">
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {sendImmediately ? "Send Notification" : "Save Draft"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
