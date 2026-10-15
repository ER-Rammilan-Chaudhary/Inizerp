import { z } from "zod";

export const analyticsYearSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a valid 4-digit year")
    .transform(Number)
    .refine(
      (year) => year >= 2000 && year <= 2100,
      "Year must be between 2000 and 2100",
    )
    .optional(),
});
