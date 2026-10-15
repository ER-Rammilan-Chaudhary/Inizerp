import { z } from "zod";

export const paymentAllocationParamsSchema = z.object({
  id: z.string().uuid("Invalid allocation ID"),
});

export const createPaymentAllocationSchema = z.object({
  paymentId: z.string().uuid("Invalid payment ID"),

  invoiceId: z.string().uuid("Invalid invoice ID"),

  amount: z.coerce
    .number()
    .positive("Allocation amount must be greater than 0"),
});
