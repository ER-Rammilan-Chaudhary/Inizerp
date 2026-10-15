import { z } from "zod";

export const featureIdSchema = z.object({
  id: z.string().uuid("Invalid feature id"),
});

export const schoolFeatureParamsSchema = z.object({
  schoolId: z.string().uuid("Invalid school id"),
});

export const schoolModuleParamsSchema = z.object({
  schoolId: z.string().uuid("Invalid school id"),
  moduleId: z.string().uuid("Invalid module id"),
});

export const createFeatureSchema = z.object({
  name: z.string().trim().min(3, "Feature name is required").max(100),
  key: z
    .string()
    .trim()
    .min(2, "Feature key is required")
    .max(50)
    .transform((value) => value.toUpperCase())
    .refine((value) => /^[A-Z0-9_]+$/.test(value), {
      message:
        "Key must contain only uppercase letters, numbers and underscores.",
    }),
  description: z.string().trim().max(500).optional(),
  category: z.string().trim().min(2).max(50).optional(),
  icon: z.string().trim().max(100).optional(),
  route: z.string().trim().max(255).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateFeatureSchema = createFeatureSchema.partial();

export const assignFeatureSchema = z.object({
  moduleId: z.string().uuid("Invalid module id"),
  enabled: z.boolean().default(true),
});

export const toggleFeatureSchema = z.object({
  enabled: z.boolean(),
});

export const bulkUpdateFeatureSchema = z.object({
  features: z
    .array(
      z.object({
        moduleId: z.string().uuid("Invalid module id"),
        enabled: z.boolean(),
      }),
    )
    .min(1, "At least one feature is required"),
});

export const featureSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  active: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateFeatureDto = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureDto = z.infer<typeof updateFeatureSchema>;
export type AssignFeatureDto = z.infer<typeof assignFeatureSchema>;
export type ToggleFeatureDto = z.infer<typeof toggleFeatureSchema>;
export type BulkUpdateFeatureDto = z.infer<typeof bulkUpdateFeatureSchema>;
export type FeatureSearchQueryDto = z.infer<typeof featureSearchSchema>;
