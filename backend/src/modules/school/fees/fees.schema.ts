import { z } from "zod";

export const feeParamsSchema = z.object({
  id: z.string().uuid("Invalid fee ID"),
});

export const createFeeSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),

  title: z.string().trim().min(1, "Fee title is required").max(150),
  amount: z.coerce.number().positive("Fee amount must be greater than 0"),
  dueDate: z.coerce.date({
    message: "Valid due date is required",
  }),
  remarks: z.string().trim().max(500).nullable().optional(),
});

export const updateFeeSchema = z.object({
  studentId: z.string().uuid("Invalid student ID").optional(),

  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),

  title: z.string().trim().min(1, "Fee title is required").max(150).optional(),

  amount: z.coerce
    .number()
    .positive("Fee amount must be greater than 0")
    .optional(),

  paidAmount: z.coerce
    .number()
    .min(0, "Paid amount cannot be negative")
    .optional(),

  dueDate: z.coerce.date().optional(),
  paidDate: z.coerce.date().nullable().optional(),
  paymentMethod: z.string().trim().max(50).nullable().optional(),
  transactionId: z.string().trim().max(150).nullable().optional(),
  remarks: z.string().trim().max(500).nullable().optional(),
});
