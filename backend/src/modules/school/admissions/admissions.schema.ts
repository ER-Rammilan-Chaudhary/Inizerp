import { z } from "zod";

export const admissionParamsSchema = z.object({
  id: z.string().uuid("Invalid admission ID"),
});

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null));

const optionalUuid = () =>
  z
    .string()
    .uuid("Invalid class ID")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null));

export const createAdmissionSchema = z.object({
  academicYearId: z.string().uuid("Invalid academic year ID"),

  applicationNo: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("").transform(() => undefined)),

  studentName: z.string().trim().min(1, "Student name is required").max(100),
  appliedClassId: optionalUuid(),
  guardianName: optionalString(100),
  guardianPhone: optionalString(20),
  remarks: optionalString(1000),
});

export const updateAdmissionSchema = z.object({
  academicYearId: z.string().uuid("Invalid academic year ID").optional(),

  applicationNo: z
    .string()
    .trim()
    .min(1, "Application number is required")
    .max(50)
    .optional(),

  studentName: z
    .string()
    .trim()
    .min(1, "Student name is required")
    .max(100)
    .optional(),

  appliedClassId: optionalUuid(),
  guardianName: optionalString(100),
  guardianPhone: optionalString(20),
  remarks: optionalString(1000),
  status: z
    .enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"])
    .optional(),
});

