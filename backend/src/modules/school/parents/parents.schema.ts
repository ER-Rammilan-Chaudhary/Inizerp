import { z } from "zod";

export const parentParamsSchema = z.object({
  id: z.string().uuid("Invalid parent ID"),
});

export const createParentSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),

  email: z.string().trim().email("Invalid email address"),

  phone: z.string().trim().max(20).nullable().optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  occupation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  annualIncome: z
    .number()
    .nonnegative("Annual income cannot be negative")
    .nullable()
    .optional(),

  studentIds: z
    .array(z.string().uuid("Invalid student ID"))
    .optional()
    .default([]),
});

export const updateParentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100)
    .optional(),

  email: z.string().trim().email("Invalid email address").optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .optional(),

  occupation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  annualIncome: z
    .number()
    .nonnegative("Annual income cannot be negative")
    .nullable()
    .optional(),

  studentIds: z.array(z.string().uuid("Invalid student ID")).optional(),
});
