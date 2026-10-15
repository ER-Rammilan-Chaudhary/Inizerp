import { z } from "zod";

export const subscriptionSchema = z.object({
  schoolId: z.string().min(1, "School is required"),

  planId: z.string().min(1, "Plan is required"),

  startDate: z.string(),

  endDate: z.string(),

  status: z.enum(["ACTIVE", "TRIAL", "EXPIRED", "CANCELLED"]),

  amount: z.number().min(0),

  discount: z.number().min(0),

  tax: z.number().min(0),

  finalAmount: z.number().min(0),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
