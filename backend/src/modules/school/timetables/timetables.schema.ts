import { z } from "zod";

export const timetableParamsSchema = z.object({
  id: z.string().uuid("Invalid timetable ID"),
});

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const daySchema = z.enum(
  ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  {
    message: "Invalid day",
  },
);

export const timetableListSchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be greater than 0")
    .default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .default(20),
  academicYearId: z.string().uuid("Invalid academic year ID").optional(),
  classId: z.string().uuid("Invalid class ID").optional(),
  sectionId: z.string().uuid("Invalid section ID").optional(),
  teacherId: z.string().uuid("Invalid teacher ID").optional(),
  subjectId: z.string().uuid("Invalid subject ID").optional(),
  day: daySchema.optional(),
  period: z.coerce
    .number()
    .int("Period must be an integer")
    .positive("Period must be greater than 0")
    .optional(),
});

export const createTimetableSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),
    classId: z.string().uuid("Invalid class ID"),
    sectionId: z.string().uuid("Invalid section ID").nullable().optional(),
    subjectId: z.string().uuid("Invalid subject ID"),
    teacherId: z.string().uuid("Invalid teacher ID"),
    day: daySchema,
    startTime: timeSchema,
    endTime: timeSchema,
    period: z.coerce
      .number()
      .int("Period must be an integer")
      .positive("Period must be greater than 0"),
    roomNo: z
      .string()
      .trim()
      .max(50, "Room number cannot exceed 50 characters")
      .nullable()
      .optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    path: ["endTime"],
    message: "End time must be after start time",
  });

export const updateTimetableSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),
    classId: z.string().uuid("Invalid class ID").optional(),
    sectionId: z.string().uuid("Invalid section ID").nullable().optional(),
    subjectId: z.string().uuid("Invalid subject ID").optional(),
    teacherId: z.string().uuid("Invalid teacher ID").optional(),
    day: daySchema.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    period: z.coerce
      .number()
      .int("Period must be an integer")
      .positive("Period must be greater than 0")
      .optional(),
    roomNo: z
      .string()
      .trim()
      .max(50, "Room number cannot exceed 50 characters")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) {
        return true;
      }

      return data.startTime < data.endTime;
    },
    {
      path: ["endTime"],
      message: "End time must be after start time",
    },
  );

export type TimetableListQuery = z.infer<typeof timetableListSchema>;
export type CreateTimetableInput = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableInput = z.infer<typeof updateTimetableSchema>;

export const periodTypeSchema = z.enum(["REGULAR", "BREAK", "LUNCH"]);

export const periodItemSchema = z.object({
  id: z.string().min(1),
  periodNumber: z.coerce.number().int().positive().nullable().optional(),
  name: z.string().trim().min(1, "Name is required"),
  type: periodTypeSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export const savePeriodsSchema = z.object({
  periods: z.array(periodItemSchema).min(1, "At least one period is required"),
});

export const addPeriodSchema = z.object({
  periodNumber: z.coerce.number().int().positive().nullable().optional(),
  name: z.string().trim().min(1, "Name is required"),
  type: periodTypeSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export const periodParamsSchema = z.object({
  periodId: z.string().min(1),
});

export type PeriodItemInput = z.infer<typeof periodItemSchema>;
export type SavePeriodsInput = z.infer<typeof savePeriodsSchema>;
export type AddPeriodInput = z.infer<typeof addPeriodSchema>;

