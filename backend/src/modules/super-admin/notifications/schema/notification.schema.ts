import {
  NotificationPriority,
  NotificationStatus,
  NotificationTargetType,
  NotificationType,
  RoleEnum,
} from "@prisma/client";
import { z } from "zod";

const audienceSchema = z
  .object({
    targetType: z.nativeEnum(NotificationTargetType),
    schoolId: z.string().uuid().nullable().optional(),
    role: z.nativeEnum(RoleEnum).nullable().optional(),
    classId: z.string().uuid().nullable().optional(),
    sectionId: z.string().uuid().nullable().optional(),
    userId: z.string().uuid().nullable().optional(),
    studentId: z.string().uuid().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const hasValue = (value?: string | null) =>
      value !== undefined && value !== null && value !== "";

    switch (data.targetType) {
      case NotificationTargetType.GLOBAL:
        if (hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is not allowed for GLOBAL target",
          });
        }

        if (hasValue(data.role)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["role"],
            message: "role is not allowed for GLOBAL target",
          });
        }

        if (hasValue(data.classId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["classId"],
            message: "classId is not allowed for GLOBAL target",
          });
        }

        if (hasValue(data.sectionId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sectionId"],
            message: "sectionId is not allowed for GLOBAL target",
          });
        }

        if (hasValue(data.userId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["userId"],
            message: "userId is not allowed for GLOBAL target",
          });
        }

        if (hasValue(data.studentId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["studentId"],
            message: "studentId is not allowed for GLOBAL target",
          });
        }

        break;

      case NotificationTargetType.SCHOOL:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for SCHOOL target",
          });
        }

        break;

      case NotificationTargetType.ROLE:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for ROLE target",
          });
        }

        if (!hasValue(data.role)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["role"],
            message: "role is required for ROLE target",
          });
        }

        break;

      case NotificationTargetType.CLASS:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for CLASS target",
          });
        }

        if (!hasValue(data.classId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["classId"],
            message: "classId is required for CLASS target",
          });
        }

        break;

      case NotificationTargetType.SECTION:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for SECTION target",
          });
        }

        if (!hasValue(data.sectionId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sectionId"],
            message: "sectionId is required for SECTION target",
          });
        }

        break;

      case NotificationTargetType.USER:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for USER target",
          });
        }

        if (!hasValue(data.userId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["userId"],
            message: "userId is required for USER target",
          });
        }

        break;

      case NotificationTargetType.STUDENT:
        if (!hasValue(data.schoolId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["schoolId"],
            message: "schoolId is required for STUDENT target",
          });
        }

        if (!hasValue(data.studentId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["studentId"],
            message: "studentId is required for STUDENT target",
          });
        }

        break;
    }
  });

export const createNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must not exceed 5000 characters"),

  type: z.nativeEnum(NotificationType),

  priority: z
    .nativeEnum(NotificationPriority)
    .optional()
    .default(NotificationPriority.NORMAL),

  schoolId: z.string().uuid().nullable().optional(),

  audiences: z
    .array(audienceSchema)
    .min(1, "At least one notification audience is required")
    .max(100, "Maximum 100 audiences are allowed"),

  scheduledAt: z.coerce.date().nullable().optional(),

  expiresAt: z.coerce.date().nullable().optional(),

  status: z
    .nativeEnum(NotificationStatus)
    .optional()
    .default(NotificationStatus.DRAFT),

  isPinned: z.boolean().optional().default(false),
});

export const updateNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters")
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must not exceed 5000 characters")
    .optional(),

  type: z.nativeEnum(NotificationType).optional(),

  priority: z.nativeEnum(NotificationPriority).optional(),

  audiences: z
    .array(audienceSchema)
    .min(1, "At least one notification audience is required")
    .max(100, "Maximum 100 audiences are allowed")
    .optional(),

  scheduledAt: z.coerce.date().nullable().optional(),

  expiresAt: z.coerce.date().nullable().optional(),

  status: z.nativeEnum(NotificationStatus).optional(),

  isPinned: z.boolean().optional(),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().max(200).optional(),

  type: z.nativeEnum(NotificationType).optional(),

  priority: z.nativeEnum(NotificationPriority).optional(),

  status: z.nativeEnum(NotificationStatus).optional(),

  readStatus: z.enum(["all", "read", "unread"]).default("all"),

  schoolId: z.string().uuid().optional(),
});

export const myNotificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().max(200).optional(),

  type: z.nativeEnum(NotificationType).optional(),

  priority: z.nativeEnum(NotificationPriority).optional(),

  readStatus: z.enum(["all", "read", "unread"]).default("all"),
});

export const notificationIdSchema = z.object({
  id: z.string().uuid(),
});

export const schoolNotificationParamsSchema = z.object({
  schoolId: z.string().uuid(),
});

export const bulkReadSchema = z.object({
  notificationIds: z
    .array(z.string().uuid())
    .min(1, "At least one notification ID is required")
    .max(100, "Maximum 100 notification IDs are allowed"),
});

export const bulkDeleteSchema = z.object({
  notificationIds: z
    .array(z.string().uuid())
    .min(1, "At least one notification ID is required")
    .max(100, "Maximum 100 notification IDs are allowed"),
});

export const notificationSchoolIdSchema = z.object({
  schoolId: z.string().uuid("Invalid school ID"),
});

export const bulkReadNotificationSchema = z.object({
  notificationIds: z
    .array(z.string().uuid("Invalid notification ID"))
    .min(1, "At least one notification ID is required"),
});

export const bulkDeleteNotificationSchema = z.object({
  notificationIds: z
    .array(z.string().uuid("Invalid notification ID"))
    .min(1, "At least one notification ID is required"),
});
