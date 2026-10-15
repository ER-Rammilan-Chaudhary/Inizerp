import type { OnChangeFn, SortingState } from "@tanstack/react-table";

export type NotificationScope =
  | "GLOBAL"
  | "ADMIN"
  | "SCHOOL"
  | "TEACHER"
  | "ALL_TEACHERS"
  | "STUDENT"
  | "ALL_STUDENTS"
  | "PARENT"
  | "ALL_PARENTS"
  | "USER";

export type NotificationType =
  | "SYSTEM"
  | "ANNOUNCEMENT"
  | "FEATURE_UPDATE"
  | "MAINTENANCE"
  | "SUBSCRIPTION"
  | "EMERGENCY"
  | "EXAM"
  | "FEES"
  | "HOMEWORK"
  | "ATTENDANCE";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type NotificationStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENT"
  | "EXPIRED"
  | "CANCELLED";

export interface Notification {
  id: string;
  title: string;
  message: string;
  scope: NotificationScope;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  schoolId: string | null;
  userId: string | null;
  classId: string | null;
  sectionId: string | null;
  studentId: string | null;
  scheduledAt: string | null;
  expiresAt: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
  readAt?: string | null;
  school?: { id: string; name: string } | null;
  createdBy?: { id: string; fullName: string; email: string } | null;
  audiences?: Array<NotificationAudience & { id: string }>;
}

export interface NotificationRead {
  id: string;
  notificationId: string;
  userId: string;
  readAt: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  search?: string;
  scope?: string;
  type?: string;
  priority?: string;
  status?: string;
  schoolId?: string;
  userId?: string;
  classId?: string;
  sectionId?: string;
  studentId?: string;
  readStatus?: "all" | "read" | "unread";
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: NotificationPagination;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data: Notification;
}

export interface NotificationStats {
  total: number;

  today: number;

  byScope: {
    global: number;
    school: number;
  };

  byType: {
    system: number;
    announcement: number;
    emergency: number;
    exam: number;
    fees: number;
    homework: number;
    attendance: number;
  };

  byPriority: {
    high: number;
    urgent: number;
  };
}

export interface NotificationStatsResponse {
  success: boolean;
  data: NotificationStats;
}

export type NotificationTargetType =
  | "GLOBAL"
  | "SCHOOL"
  | "ROLE"
  | "CLASS"
  | "SECTION"
  | "USER"
  | "STUDENT";

export type NotificationRole =
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "PARENT"
  | "STUDENT";

export interface NotificationAudience {
  targetType: NotificationTargetType;
  schoolId?: string | null;
  role?: NotificationRole | null;
  classId?: string | null;
  sectionId?: string | null;
  userId?: string | null;
  studentId?: string | null;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  schoolId?: string | null;
  audiences: NotificationAudience[];
  scheduledAt?: string | null;
  expiresAt?: string | null;
  status?: NotificationStatus;
  isPinned?: boolean;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  schoolId?: string | null;
  audiences?: NotificationAudience[];
  scheduledAt?: string | null;
  expiresAt?: string | null;
  isPinned?: boolean;
}

export interface BulkReadDto {
  ids: string[];
}

export interface BulkDeleteDto {
  ids: string[];
}

export interface NotificationTableProps {
  data: Notification[];
  loading?: boolean;
  selectedRows: string[];
  onSelectionChange: (ids: string[]) => void;
  onView: (notification: Notification) => void;
  onEdit: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkRead: (ids: string[]) => void;
}

export interface NotificationTableState {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
}

export interface NotificationReadResponse {
  success: boolean;
  message: string;
  data: NotificationRead;
}
