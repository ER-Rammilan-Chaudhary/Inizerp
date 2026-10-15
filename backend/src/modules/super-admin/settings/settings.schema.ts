import { z } from "zod";

export const settingKeySchema = z
  .string()
  .trim()
  .min(1, "Setting key is required")
  .max(100, "Setting key cannot exceed 100 characters")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Setting key can contain only letters, numbers, dots, hyphens and underscores",
  );

export const createOrUpdateSettingSchema = z.object({
  key: settingKeySchema,
  value: z.unknown(),
});

export const updateSettingSchema = z.object({
  value: z.unknown(),
});

export const settingParamsSchema = z.object({
  key: settingKeySchema,
});
