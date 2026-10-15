import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");

export const enrollmentParamsSchema = z.object({
  id: uuidSchema,
});

export const createEnrollmentSchema = z.object({
  studentId: uuidSchema,
  academicYearId: uuidSchema,
  classId: uuidSchema,
  sectionId: uuidSchema.nullable().optional(),
  rollNo: z.string().trim().max(50).nullable().optional(),
});

export const updateEnrollmentSchema = z
  .object({
    academicYearId: uuidSchema.optional(),
    classId: uuidSchema.optional(),
    sectionId: uuidSchema.nullable().optional(),
    rollNo: z.string().trim().max(50).nullable().optional(),
    status: z.enum(["ACTIVE", "WITHDRAWN", "COMPLETED"]).optional(),
  })
  .refine(
    (data) =>
      data.academicYearId !== undefined ||
      data.classId !== undefined ||
      data.sectionId !== undefined ||
      data.rollNo !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field is required",
    },
  );

export const promoteStudentsSchema = z.object({
  sourceAcademicYearId: uuidSchema,
  targetAcademicYearId: uuidSchema,
  promotions: z
    .array(
      z.object({
        studentId: uuidSchema,
        targetClassId: uuidSchema,
        targetSectionId: uuidSchema.nullable().optional(),
        rollNo: z.string().trim().max(50).nullable().optional(),
      }),
    )
    .min(1, "At least one student must be selected for promotion"),
});

export const enrollmentQuerySchema = z.object({
  academicYearId: uuidSchema.optional(),
  classId: uuidSchema.optional(),
  sectionId: uuidSchema.optional(),
  sectionName: z.string().optional(),
  status: z.enum(["ACTIVE", "WITHDRAWN", "COMPLETED"]).optional(),
  search: z.string().optional(),
});
