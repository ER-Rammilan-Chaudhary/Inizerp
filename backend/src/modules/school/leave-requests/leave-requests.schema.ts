import { z } from "zod";

export const createLeaveRequestSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    applicantUserId: z.string().uuid("Invalid applicant user ID"),

    leaveType: z.string().trim().min(1, "Leave type is required").max(50),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    reason: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
    path: ["endDate"],
  });

export const updateLeaveRequestSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    applicantUserId: z.string().uuid("Invalid applicant user ID").optional(),

    leaveType: z
      .string()
      .trim()
      .min(1, "Leave type is required")
      .max(50)
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    reason: z.string().trim().max(1000).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    },
  );
