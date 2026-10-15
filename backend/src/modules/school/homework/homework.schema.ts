import { z } from "zod";
import { HomeworkStatus } from "@prisma/client";

const uuidSchema = (message: string) => z.string().uuid(message);

const dateSchema = z.coerce.date();

export const homeworkParamsSchema = z.object({
  id: uuidSchema("Invalid homework ID"),
});

export const homeworkListSchema = z
  .object({
    page: z.coerce
      .number()
      .int("Page must be an integer")
      .min(1, "Page must be greater than 0")
      .default(1),

    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .min(1, "Limit must be greater than 0")
      .max(100, "Limit cannot exceed 100")
      .default(20),

    academicYearId: uuidSchema("Invalid academic year ID").optional(),

    classId: uuidSchema("Invalid class ID").optional(),

    sectionId: uuidSchema("Invalid section ID").optional(),

    subjectId: uuidSchema("Invalid subject ID").optional(),

    teacherId: uuidSchema("Invalid teacher ID").optional(),

    status: z.nativeEnum(HomeworkStatus).optional(),

    search: z
      .string()
      .trim()
      .max(100, "Search cannot exceed 100 characters")
      .optional(),

    fromDate: dateSchema.optional(),

    toDate: dateSchema.optional(),

    sortBy: z
      .enum(["assignedAt", "dueDate", "createdAt", "title"])
      .default("dueDate"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .refine(
    (data) => {
      if (!data.fromDate || !data.toDate) {
        return true;
      }

      return data.fromDate <= data.toDate;
    },
    {
      message: "From date must be before or equal to to date",
      path: ["toDate"],
    },
  );

export const createHomeworkSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    classId: z.string().uuid("Invalid class ID"),

    sectionId: z.string().uuid("Invalid section ID").nullable().optional(),

    subjectId: z.string().uuid("Invalid subject ID"),

    teacherId: z.string().uuid("Invalid teacher ID").nullable().optional(),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .nullable()
      .optional(),

    assignedAt: z.coerce.date().optional(),

    dueDate: z.coerce.date(),

    attachmentId: z
      .string()
      .uuid("Invalid attachment ID")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const assignedAt = data.assignedAt ?? new Date();

      return assignedAt <= data.dueDate;
    },
    {
      message: "Due date must be after assigned date",
      path: ["dueDate"],
    },
  );

export const updateHomeworkSchema = z
  .object({
    academicYearId: z
      .string()
      .uuid("Invalid academic year ID")
      .nullable()
      .optional(),

    classId: z.string().uuid("Invalid class ID").optional(),

    sectionId: z.string().uuid("Invalid section ID").nullable().optional(),

    subjectId: z.string().uuid("Invalid subject ID").optional(),

    teacherId: z.string().uuid("Invalid teacher ID").nullable().optional(),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .nullable()
      .optional(),

    assignedAt: z.coerce.date().optional(),

    dueDate: z.coerce.date().optional(),

    attachmentId: z
      .string()
      .uuid("Invalid attachment ID")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.assignedAt || !data.dueDate) {
        return true;
      }

      return data.assignedAt <= data.dueDate;
    },
    {
      message: "Due date must be after assigned date",
      path: ["dueDate"],
    },
  );

export type HomeworkListQuery = z.infer<typeof homeworkListSchema>;
