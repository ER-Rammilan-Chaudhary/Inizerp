import * as z from "zod";

// ==============================
// CREATE SCHOOL
// ==============================

export const createSchoolSchema = z.object({
  // School
  name: z.string().min(3, "School name is required"),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  phone: z.string().optional(),

  address: z.string().optional(),

  principal: z.string().optional(),

  logo: z.any().optional(),

  // Admin
  ownerName: z.string().min(3, "Admin name is required"),

  ownerEmail: z.string().email("Invalid admin email"),

  ownerPassword: z.string().min(6, "Password must be at least 6 characters"),

  ownerPhone: z.string().optional(),

  // Branding
  primaryColor: z.string().optional(),

  secondaryColor: z.string().optional(),

  slogan: z.string().optional(),

  // Mission
  missionStatement: z.string().optional(),

  visionStatement: z.string().optional(),

  // Timing
  startHour: z.string().optional(),

  closeHour: z.string().optional(),
});

// ==============================
// UPDATE SCHOOL
// ==============================

export const updateSchoolSchema = z.object({
  // School
  name: z.string().min(3, "School name is required"),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  phone: z.string().optional(),

  address: z.string().optional(),

  principal: z.string().optional(),

  logo: z.any().optional(),

  // Branding
  primaryColor: z.string().optional(),

  secondaryColor: z.string().optional(),

  slogan: z.string().optional(),

  // Mission
  missionStatement: z.string().optional(),

  visionStatement: z.string().optional(),

  // Timing
  startHour: z.string().optional(),

  closeHour: z.string().optional(),
});

// ==============================
// TYPES
// ==============================

export type CreateSchoolFormValues = z.infer<typeof createSchoolSchema>;

export type UpdateSchoolFormValues = z.infer<typeof updateSchoolSchema>;

