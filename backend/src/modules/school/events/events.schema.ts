import { z } from "zod";

export const eventParamsSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
});

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1, "Event title is required").max(200),

    description: z.string().trim().max(1000).nullable().optional(),

    startDate: z.coerce.date({
      message: "Valid start date is required",
    }),

    endDate: z.coerce.date().nullable().optional(),

    location: z.string().trim().max(200).nullable().optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

export const updateEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Event title is required")
    .max(200)
    .optional(),

  description: z.string().trim().max(1000).nullable().optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().nullable().optional(),

  location: z.string().trim().max(200).nullable().optional(),
});
