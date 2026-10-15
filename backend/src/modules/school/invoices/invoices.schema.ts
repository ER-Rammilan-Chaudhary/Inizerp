import { z } from "zod";

export const createInvoiceSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    studentId: z.string().uuid("Invalid student ID"),

    invoiceNo: z.string().trim().min(1, "Invoice number is required").max(50),

    issueDate: z.coerce.date().optional(),

    dueDate: z.coerce.date(),

    subtotal: z.coerce.number().nonnegative("Subtotal cannot be negative"),

    discount: z.coerce
      .number()
      .nonnegative("Discount cannot be negative")
      .optional(),

    tax: z.coerce.number().nonnegative("Tax cannot be negative").optional(),
  })
  .refine(
    (data) => {
      const issueDate = data.issueDate ?? new Date();
      return issueDate <= data.dueDate;
    },
    {
      message: "Due date must be after issue date",
      path: ["dueDate"],
    },
  );

export const updateInvoiceSchema = z.object({
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID")
    .nullable()
    .optional(),

  studentId: z.string().uuid("Invalid student ID").optional(),

  invoiceNo: z
    .string()
    .trim()
    .min(1, "Invoice number is required")
    .max(50)
    .optional(),

  issueDate: z.coerce.date().optional(),

  dueDate: z.coerce.date().optional(),

  subtotal: z.coerce
    .number()
    .nonnegative("Subtotal cannot be negative")
    .optional(),

  discount: z.coerce
    .number()
    .nonnegative("Discount cannot be negative")
    .optional(),

  tax: z.coerce.number().nonnegative("Tax cannot be negative").optional(),
});
