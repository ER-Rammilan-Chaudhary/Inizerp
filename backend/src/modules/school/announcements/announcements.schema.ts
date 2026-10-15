import { z } from "zod";

export const announcementParamsSchema = z.object({
  id: z.string().uuid("Invalid announcement ID"),
});

export const createAnnouncementSchema = z
  .object({
    title: z.string().trim().min(1, "Announcement title is required").max(200),

    message: z
      .string()
      .trim()
      .min(1, "Announcement message is required")
      .max(5000),

    expiresAt: z.coerce.date().nullable().optional(),

    publishedAt: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.expiresAt || data.expiresAt >= (data.publishedAt ?? new Date()),
    {
      message: "Expiry date must be after or equal to published date",
      path: ["expiresAt"],
    },
  );

export const updateAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Announcement title is required")
    .max(200)
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Announcement message is required")
    .max(5000)
    .optional(),

  expiresAt: z.coerce.date().nullable().optional(),

  publishedAt: z.coerce.date().optional(),
});
