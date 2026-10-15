import { z } from "zod";

export const staffParamsSchema = z.object({
  id: z.string().uuid("Invalid staff ID"),
});

export const createStaffSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee ID is required").max(50),

  fullName: z.string().trim().min(1, "Full name is required").max(100),

  designation: z.string().trim().max(100).nullable().optional(),

  department: z.string().trim().max(100).nullable().optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  email: z.string().trim().email("Invalid email address").nullable().optional(),

  joiningDate: z.coerce.date().nullable().optional(),

  salary: z.coerce
    .number()
    .min(0, "Salary cannot be negative")
    .nullable()
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .optional()
    .default("ACTIVE"),

  address: z.string().trim().max(500).nullable().optional(),
});

export const updateStaffSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, "Employee ID is required")
    .max(50)
    .optional(),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100)
    .optional(),

  designation: z.string().trim().max(100).nullable().optional(),

  department: z.string().trim().max(100).nullable().optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  email: z.string().trim().email("Invalid email address").nullable().optional(),

  joiningDate: z.coerce.date().nullable().optional(),

  salary: z.coerce
    .number()
    .min(0, "Salary cannot be negative")
    .nullable()
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),

  address: z.string().trim().max(500).nullable().optional(),
});
