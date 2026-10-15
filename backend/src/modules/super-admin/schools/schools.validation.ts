import { z } from "zod";

export const createSchoolSchema = z
  .object({
    name: z.string().trim().min(3, "School name must be at least 3 characters"),
    email: z.string().email("Invalid school email").optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    ownerName: z.string().trim().optional(),
    ownerEmail: z.string().email("Invalid owner email").optional(),
    ownerPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    ownerPhone: z.string().trim().optional(),
    principal: z.string().trim().optional(),
    primaryColor: z.string().trim().optional(),
    secondaryColor: z.string().trim().optional(),
    slogan: z.string().trim().optional(),
    missionStatement: z.string().trim().optional(),
    visionStatement: z.string().trim().optional(),
    startHour: z.string().trim().optional(),
    closeHour: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ownerEmail && !data.ownerPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ownerPassword"],
        message: "Owner password is required when owner email is provided",
      });
    }

    if (data.ownerPassword && !data.ownerEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ownerEmail"],
        message: "Owner email is required when owner password is provided",
      });
    }
  });

export const updateSchoolSchema = z.object({
  name: z.string().trim().min(3).optional(),
  email: z.string().email("Invalid school email").optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  principal: z.string().trim().optional(),
  primaryColor: z.string().trim().optional(),
  secondaryColor: z.string().trim().optional(),
  slogan: z.string().trim().optional(),
  missionStatement: z.string().trim().optional(),
  visionStatement: z.string().trim().optional(),
  startHour: z.string().trim().optional(),
  closeHour: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export const updateSchoolStatusSchema = z.object({
  status: z.enum(["TRIAL", "ACTIVE", "SUSPENDED", "EXPIRED"]),
});

export const updateSchoolAdminSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional(),
});

export const resetSchoolAdminPasswordSchema = z.object({
  password: z.string().min(6),
});
