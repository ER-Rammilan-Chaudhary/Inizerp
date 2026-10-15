import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");

const teacherIdsSchema = z
  .array(uuidSchema)
  .max(500, "Maximum 500 teachers can be assigned")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Duplicate teacher IDs are not allowed",
  });

export const subjectParamsSchema = z.object({
  id: uuidSchema,
});

export const subjectQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters")
    .optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  teacherId: uuidSchema.optional(),

  hasTeachers: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  sortBy: z.enum(["name", "code", "createdAt"]).default("name"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type SubjectQuery = z.infer<typeof subjectQuerySchema>;

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subject name is required")
    .max(100, "Subject name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(1, "Subject code is required")
    .max(50, "Subject code cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .optional(),

  teacherIds: teacherIdsSchema.optional().default([]),
});

export const updateSubjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Subject name is required")
      .max(100, "Subject name cannot exceed 100 characters")
      .optional(),

    code: z
      .string()
      .trim()
      .min(1, "Subject code is required")
      .max(50, "Subject code cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .nullable()
      .optional(),

    teacherIds: teacherIdsSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.code !== undefined ||
      data.description !== undefined ||
      data.teacherIds !== undefined,
    {
      message: "At least one field is required",
    },
  );

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
