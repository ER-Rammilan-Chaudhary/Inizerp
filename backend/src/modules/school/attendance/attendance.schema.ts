import { z } from "zod";

export const attendanceParamsSchema = z.object({
  id: z.string().uuid("Invalid attendance ID"),
});

export const createAttendanceSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  classId: z.string().uuid("Invalid class ID"),
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),
  attendanceDate: z.coerce.date({
    message: "Valid attendance date is required",
  }),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]),
  remarks: z.string().trim().max(500).nullable().optional(),
});

export const updateAttendanceSchema = z.object({
  studentId: z.string().uuid("Invalid student ID").optional(),
  classId: z.string().uuid("Invalid class ID").optional(),
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),
  attendanceDate: z.coerce.date().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]).optional(),
  remarks: z.string().trim().max(500).nullable().optional(),
});
