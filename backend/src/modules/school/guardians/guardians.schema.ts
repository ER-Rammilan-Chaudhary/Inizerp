import { z } from "zod";

export const guardianParamsSchema = z.object({
  id: z.string().uuid("Invalid guardian ID"),
});

export const createGuardianSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),

  relationship: z.string().trim().max(50).nullable().optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  email: z.string().trim().email("Invalid email address").nullable().optional(),

  occupation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  userId: z.string().uuid("Invalid user ID").nullable().optional(),
});

export const updateGuardianSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100)
    .optional(),

  relationship: z.string().trim().max(50).nullable().optional(),

  phone: z.string().trim().max(20).nullable().optional(),

  email: z.string().trim().email("Invalid email address").nullable().optional(),

  occupation: z.string().trim().max(100).nullable().optional(),

  address: z.string().trim().max(500).nullable().optional(),

  userId: z.string().uuid("Invalid user ID").nullable().optional(),
});
