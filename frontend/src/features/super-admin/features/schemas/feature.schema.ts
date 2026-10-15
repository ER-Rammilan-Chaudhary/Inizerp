import * as z from "zod";

export const featureSchema = z.object({
  name: z.string().min(2, "Name is required"),
  key: z.string().min(2, "Key is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  route: z.string().optional(),
  isActive: z.boolean(),
});

export type FeatureFormValues = z.infer<typeof featureSchema>;