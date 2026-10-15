import { z } from "zod";

export const resultParamsSchema = z.object({
  id: z.string().uuid("Invalid result ID"),
});

export const createResultSchema = z.object({
  examId: z.string().uuid("Invalid exam ID"),

  studentId: z.string().uuid("Invalid student ID"),

  subjectId: z.string().uuid("Invalid subject ID"),

  marks: z.coerce.number().min(0, "Marks cannot be negative"),

  totalMarks: z.coerce
    .number()
    .positive("Total marks must be greater than zero"),

  grade: z.string().trim().max(20).nullable().optional(),

  remarks: z.string().trim().max(500).nullable().optional(),
});

export const updateResultSchema = z.object({
  marks: z.coerce.number().min(0, "Marks cannot be negative").optional(),

  totalMarks: z.coerce
    .number()
    .positive("Total marks must be greater than zero")
    .optional(),

  grade: z.string().trim().max(20).nullable().optional(),

  remarks: z.string().trim().max(500).nullable().optional(),
});
