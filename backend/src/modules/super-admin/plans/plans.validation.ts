import { z } from "zod";

export const planIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const planModuleParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    moduleId: z.string().uuid(),
  }),
});

export const createPlanSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Plan name must be at least 2 characters")
      .max(100),

    code: z
      .string()
      .trim()
      .min(2, "Plan code must be at least 2 characters")
      .max(50)
      .toUpperCase(),

    description: z.string().trim().max(500).optional(),

    price: z.number().min(0),

    currency: z.string().trim().min(1).max(10).default("INR"),

    durationInDays: z.number().int().positive(),

    maxStudents: z.number().int().min(0),

    maxTeachers: z.number().int().min(0),

    maxAdmins: z.number().int().min(1),
  }),
});

export const updatePlanSchema = z.object({
  body: createPlanSchema.shape.body.partial(),
});

export const updatePlanStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const assignPlanModuleSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid(),
  }),
});

export const bulkAssignPlanModulesSchema = z.object({
  body: z.object({
    moduleIds: z
      .array(z.string().uuid())
      .min(1, "At least one module is required"),
  }),
});
