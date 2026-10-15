"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/common/Loader";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchools } from "@/features/super-admin/schools/hooks/useSchools";
import { useUsers } from "@/features/super-admin/users/hooks/useUsers";
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_SCOPE_LABELS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
} from "../constants/notification.constants";
import type {
  CreateNotificationDto,
  NotificationRole,
  NotificationScope,
} from "../types/notification.types";

interface Props {
  initialData?: Partial<CreateNotificationDto> & {
    scope?: NotificationScope;
    userId?: string | null;
  };
  onSubmit: (data: CreateNotificationDto) => void;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

interface FormState {
  title: string;
  message: string;
  scope: NotificationScope;
  type: CreateNotificationDto["type"];
  priority: NonNullable<CreateNotificationDto["priority"]>;
  status: NonNullable<CreateNotificationDto["status"]>;
  schoolId: string | null;
  userId: string | null;
}

const roleByScope: Partial<Record<NotificationScope, NotificationRole>> = {
  ADMIN: "SCHOOL_ADMIN",
  TEACHER: "TEACHER",
  ALL_TEACHERS: "TEACHER",
  STUDENT: "STUDENT",
  ALL_STUDENTS: "STUDENT",
  PARENT: "PARENT",
  ALL_PARENTS: "PARENT",
};

const roleScopes = new Set(Object.keys(roleByScope));

export default function NotificationForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  isEdit = false,
}: Props) {
  const {
    data: schools,
    isLoading: schoolsLoading,
    isError: schoolsError,
  } = useSchools({ page: 1, limit: 100 });
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers({ page: 1, limit: 100 });

  const initialScope = initialData?.scope ?? "GLOBAL";
  const [form, setForm] = useState<FormState>({
    title: initialData?.title ?? "",
    message: initialData?.message ?? "",
    scope: initialScope,
    type: initialData?.type ?? "ANNOUNCEMENT",
    priority: initialData?.priority ?? "NORMAL",
    status: initialData?.status ?? "SENT",
    schoolId: initialData?.schoolId ?? null,
    userId: initialData?.userId ?? null,
  });

  const statusOptions = useMemo(() => {
    const entries = Object.entries(NOTIFICATION_STATUS_LABELS);
    return isEdit
      ? entries
      : entries.filter(([key]) => !["EXPIRED", "CANCELLED"].includes(key));
  }, [isEdit]);

  const requiresSchool = form.scope !== "GLOBAL";
  const isRoleScope = roleScopes.has(form.scope);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => {
      if (key === "scope") {
        return {
          ...current,
          scope: value as NotificationScope,
          schoolId: null,
          userId: null,
        };
      }
      return { ...current, [key]: value };
    });
  };

  const buildPayload = (): CreateNotificationDto => {
    const audience = (() => {
      if (form.scope === "GLOBAL") {
        return { targetType: "GLOBAL" as const };
      }

      if (form.scope === "SCHOOL") {
        return {
          targetType: "SCHOOL" as const,
          schoolId: form.schoolId,
        };
      }

      if (isRoleScope) {
        return {
          targetType: "ROLE" as const,
          schoolId: form.schoolId,
          role: roleByScope[form.scope] ?? null,
        };
      }

      return {
        targetType: "USER" as const,
        schoolId: form.schoolId,
        userId: form.userId,
      };
    })();

    return {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      priority: form.priority,
      status: form.status,
      schoolId: form.scope === "GLOBAL" ? null : form.schoolId,
      audiences: [audience],
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) return;
    if (requiresSchool && !form.schoolId) return;
    if (form.scope === "USER" && !form.userId) return;

    onSubmit(buildPayload());
  };

  return (
    <form
      id="notification-form"
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter notification title"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Enter notification message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Scope</Label>
          <Select
            value={form.scope}
            onValueChange={(value) =>
              update("scope", value as NotificationScope)
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NOTIFICATION_SCOPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              update("type", value as FormState["type"])
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={form.priority}
            onValueChange={(value) =>
              update("priority", value as FormState["priority"])
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NOTIFICATION_PRIORITY_LABELS).map(
                ([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {requiresSchool && (
          <div className="space-y-2">
            <Label>School</Label>
            <Select
              value={form.schoolId ?? ""}
              onValueChange={(value) => update("schoolId", value)}
              disabled={loading || schoolsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                {schoolsLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading schools...
                  </div>
                ) : schoolsError ? (
                  <div className="px-3 py-2 text-sm text-destructive">
                    Unable to load schools.
                  </div>
                ) : (
                  schools?.schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {form.scope === "USER" && (
          <div className="space-y-2">
            <Label>User</Label>
            <Select
              value={form.userId ?? ""}
              onValueChange={(value) => update("userId", value)}
              disabled={loading || usersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    <Loader text="Loading users..." />
                  </div>
                ) : usersError ? (
                  <div className="px-3 py-2 text-sm text-destructive">
                    Unable to load users.
                  </div>
                ) : (
                  users?.data?.users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(value) =>
              update("status", value as FormState["status"])
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Notification"}
        </Button>
      </div>
    </form>
  );
}
