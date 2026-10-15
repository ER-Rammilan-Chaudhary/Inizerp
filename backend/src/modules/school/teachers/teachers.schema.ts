import { z } from "zod";

export const teacherParamsSchema = z.object({
  id: z.string().uuid("Invalid teacher ID"),
});

export const createTeacherSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),

  email: z.string().trim().email("Invalid email address").max(150),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  phone: z.string().trim().max(20).nullable().optional(),

  employeeId: z.string().trim().min(1, "Employee ID is required").max(50),

  qualification: z.string().trim().max(150).nullable().optional(),

  experienceYears: z.number().int().min(0).nullable().optional(),

  designation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  joiningDate: z.coerce.date().nullable().optional(),

  subjectIds: z
    .array(z.string().uuid("Invalid subject ID"))
    .optional()
    .default([]),
});

export const updateTeacherSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100)
    .optional(),

  email: z.string().trim().email("Invalid email address").max(150).optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  employeeId: z
    .string()
    .trim()
    .min(1, "Employee ID is required")
    .max(50)
    .optional(),

  qualification: z.string().trim().max(150).nullable().optional(),

  experienceYears: z.number().int().min(0).nullable().optional(),

  designation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  joiningDate: z.coerce.date().nullable().optional(),

  subjectIds: z.array(z.string().uuid("Invalid subject ID")).optional(),
});
