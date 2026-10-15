import { z } from "zod";

// USER STATUS
export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

// USER ROLE
export const userRoleSchema = z.enum(["SUPER_ADMIN", "SCHOOL_ADMIN"]);

// CREATE SCHOOL ADMIN
export const createSchoolAdminSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters"),

  email: z.string().trim().email("Invalid email").toLowerCase(),

  password: z.string().min(6, "Password must be at least 6 characters"),

  schoolId: z.string().uuid("Invalid school id"),

  phone: z.string().trim().optional().nullable(),
});

// UPDATE SCHOOL ADMIN
export const updateSchoolAdminSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  email: z.string().trim().email("Invalid email").toLowerCase().optional(),

  phone: z.string().trim().optional().nullable(),

  avatar: z.string().trim().nullable().optional(),

  status: userStatusSchema.optional(),

  schoolId: z.string().uuid("Invalid school id").optional(),
});

// RESET PASSWORD
export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// USER QUERY
export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  search: z.string().trim().optional(),

  role: userRoleSchema.optional(),

  schoolId: z.string().uuid("Invalid school id").optional(),

  status: userStatusSchema.optional(),
});
