import { z } from "zod";

export const examParamsSchema = z.object({
  id: z.string().uuid("Invalid exam ID"),
});

export const createExamSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    name: z.string().trim().min(1, "Exam name is required").max(100),

    startDate: z.coerce.date({
      message: "Valid start date is required",
    }),

    endDate: z.coerce.date({
      message: "Valid end date is required",
    }),

    description: z.string().trim().max(500).nullable().optional(),

    examType: z.string().trim().max(50).nullable().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

export const updateExamSchema = z.object({
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),

  name: z.string().trim().min(1, "Exam name is required").max(100).optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  description: z.string().trim().max(500).nullable().optional(),

  examType: z.string().trim().max(50).nullable().optional(),
});
