import type {
  NotificationPriority,
  NotificationScope,
  NotificationStatus,
  NotificationType,
} from "../types/notification.types";

export const NOTIFICATION_SCOPE_LABELS: Record<NotificationScope, string> = {
  GLOBAL: "Global",
  ADMIN: "Admin",
  SCHOOL: "School",
  TEACHER: "Teacher",
  ALL_TEACHERS: "All Teachers",
  STUDENT: "Student",
  ALL_STUDENTS: "All Students",
  PARENT: "Parent",
  ALL_PARENTS: "All Parents",
  USER: "Specific User",
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  SYSTEM: "System",
  ANNOUNCEMENT: "Announcement",
  FEATURE_UPDATE: "Feature Update",
  MAINTENANCE: "Maintenance",
  SUBSCRIPTION: "Subscription",
  EMERGENCY: "Emergency",
  EXAM: "Exam",
  FEES: "Fees",
  HOMEWORK: "Homework",
  ATTENDANCE: "Attendance",
};

export const NOTIFICATION_PRIORITY_LABELS: Record<
  NotificationPriority,
  string
> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  SENT: "Sent",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const NOTIFICATION_READ_STATUS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Read",
    value: "read",
  },
  {
    label: "Unread",
    value: "unread",
  },
] as const;

export const NOTIFICATION_LIMITS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
