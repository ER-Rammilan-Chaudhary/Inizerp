import { HomeworkSubmissionStatus } from "@prisma/client";
import { z } from "zod";

const uuidSchema = (message: string) => z.string().uuid(message);

export const homeworkSubmissionParamsSchema = z.object({
  id: uuidSchema("Invalid submission ID"),
});

export const createHomeworkSubmissionSchema = z.object({
  homeworkId: uuidSchema("Invalid homework ID"),
  studentId: uuidSchema("Invalid student ID"),
  submittedAt: z.coerce.date().optional(),
  attachmentId: uuidSchema("Invalid attachment ID").nullable().optional(),
  content: z
    .string()
    .trim()
    .max(10000, "Content cannot exceed 10000 characters")
    .nullable()
    .optional(),
});

export const updateHomeworkSubmissionSchema = z.object({
  submittedAt: z.coerce.date().optional(),
  attachmentId: uuidSchema("Invalid attachment ID").nullable().optional(),
  content: z
    .string()
    .trim()
    .max(10000, "Content cannot exceed 10000 characters")
    .nullable()
    .optional(),
  status: z.nativeEnum(HomeworkSubmissionStatus).optional(),
  marks: z
    .number()
    .finite("Marks must be a valid number")
    .min(0, "Marks cannot be negative")
    .nullable()
    .optional(),
  remarks: z
    .string()
    .trim()
    .max(5000, "Remarks cannot exceed 5000 characters")
    .nullable()
    .optional(),
});

export const homeworkSubmissionListSchema = z.object({
  page: z.coerce.number().int("Page must be an integer").min(1).default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1)
    .max(100)
    .default(20),

  homeworkId: uuidSchema("Invalid homework ID").optional(),

  studentId: uuidSchema("Invalid student ID").optional(),

  status: z.nativeEnum(HomeworkSubmissionStatus).optional(),

  search: z.string().trim().max(100).optional(),

  sortBy: z.enum(["submittedAt", "createdAt", "marks"]).default("submittedAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type HomeworkSubmissionListQuery = z.infer<
  typeof homeworkSubmissionListSchema
>;

export type CreateHomeworkSubmissionInput = z.infer<
  typeof createHomeworkSubmissionSchema
>;

export type UpdateHomeworkSubmissionInput = z.infer<
  typeof updateHomeworkSubmissionSchema
>;
