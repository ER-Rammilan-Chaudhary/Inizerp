import {
  NotificationPriority,
  NotificationStatus,
  NotificationTargetType,
  NotificationType,
  RoleEnum,
} from "@prisma/client";

export interface NotificationAudienceDto {
  targetType: NotificationTargetType;
  schoolId?: string | null;
  role?: RoleEnum | null;
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
  audiences: NotificationAudienceDto[];
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  status?: NotificationStatus;
  isPinned?: boolean;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  audiences?: NotificationAudienceDto[];
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  status?: NotificationStatus;
  isPinned?: boolean;
}

export interface NotificationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  readStatus?: "all" | "read" | "unread";
  schoolId?: string;
}

export interface MyNotificationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  readStatus?: "all" | "read" | "unread";
}

export interface BulkReadNotificationDto {
  notificationIds: string[];
}

export interface BulkDeleteNotificationDto {
  notificationIds: string[];
}
