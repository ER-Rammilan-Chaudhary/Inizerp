import { z } from "zod";

export const paymentParamsSchema = z.object({
  id: z.string().uuid("Invalid payment ID"),
});

export const createPaymentSchema = z.object({
  studentId: z.string().uuid("Invalid student ID").nullable().optional(),

  receiptNo: z.string().trim().min(1, "Receipt number is required").max(50),

  amount: z.coerce.number().positive("Amount must be greater than 0"),

  paymentDate: z.coerce.date().optional(),

  method: z.enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE", "ONLINE"]),

  referenceNo: z.string().trim().max(100).nullable().optional(),
});

export const reversePaymentSchema = z.object({
  reversalReason: z
    .string()
    .trim()
    .min(1, "Reversal reason is required")
    .max(500),
});
