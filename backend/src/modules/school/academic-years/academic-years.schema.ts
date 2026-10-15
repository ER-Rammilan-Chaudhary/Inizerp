import { z } from "zod";

const academicYearNameSchema = z
  .string()
  .trim()
  .min(1, "Academic year name is required")
  .max(100, "Academic year name cannot exceed 100 characters");

const academicYearCodeSchema = z
  .string()
  .trim()
  .min(1, "Academic year code is required")
  .max(50, "Academic year code cannot exceed 50 characters");

const dateSchema = z.coerce.date({
  message: "Valid date is required",
});

export const createAcademicYearSchema = z
  .object({
    name: academicYearNameSchema,
    code: academicYearCodeSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export const updateAcademicYearSchema = z
  .object({
    name: academicYearNameSchema.optional(),
    code: academicYearCodeSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .refine(
    (data) =>
      data.startDate === undefined ||
      data.endDate === undefined ||
      data.startDate < data.endDate,
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    },
  );

export const academicYearParamsSchema = z.object({
  id: z.string().uuid("Invalid academic year ID"),
});
