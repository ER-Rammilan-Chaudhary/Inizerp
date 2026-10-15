import { z } from "zod";

const targetTypeSchema = z.enum([
  "SCHOOL",
  "ROLE",
  "CLASS",
  "SECTION",
  "USER",
  "STUDENT",
]);

const roleSchema = z.enum(["SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"]);

const audienceSchema = z.object({
  targetType: targetTypeSchema,
  role: roleSchema.nullable().optional(),
  classId: z.string().uuid("Invalid class ID").nullable().optional(),
  sectionId: z.string().uuid("Invalid section ID").nullable().optional(),
  userId: z.string().uuid("Invalid user ID").nullable().optional(),
  studentId: z.string().uuid("Invalid student ID").nullable().optional(),
});

export const notificationParamsSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
});

export const createNotificationSchema = z.object({
  title: z.string().trim().min(1, "Notification title is required").max(200),

  message: z
    .string()
    .trim()
    .min(1, "Notification message is required")
    .max(5000),

  type: z.enum([
    "SYSTEM",
    "ANNOUNCEMENT",
    "FEATURE_UPDATE",
    "MAINTENANCE",
    "SUBSCRIPTION",
    "EMERGENCY",
    "EXAM",
    "FEES",
    "HOMEWORK",
    "ATTENDANCE",
  ]),

  priority: z
    .enum(["LOW", "NORMAL", "HIGH", "URGENT"])
    .optional()
    .default("NORMAL"),

  status: z.enum(["DRAFT", "SCHEDULED", "SENT"]).optional(),

  sendNow: z.boolean().optional().default(true),

  scheduledAt: z.coerce.date().nullable().optional(),

  expiresAt: z.coerce.date().nullable().optional(),

  isPinned: z.boolean().optional().default(false),

  audiences: z
    .array(audienceSchema)
    .min(1, "At least one notification audience is required"),
});

export const updateNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Notification title is required")
    .max(200)
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Notification message is required")
    .max(5000)
    .optional(),

  type: z
    .enum([
      "SYSTEM",
      "ANNOUNCEMENT",
      "FEATURE_UPDATE",
      "MAINTENANCE",
      "SUBSCRIPTION",
      "EMERGENCY",
      "EXAM",
      "FEES",
      "HOMEWORK",
      "ATTENDANCE",
    ])
    .optional(),

  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),

  scheduledAt: z.coerce.date().nullable().optional(),

  expiresAt: z.coerce.date().nullable().optional(),

  isPinned: z.boolean().optional(),

  audiences: z
    .array(audienceSchema)
    .min(1, "At least one notification audience is required")
    .optional(),
});
