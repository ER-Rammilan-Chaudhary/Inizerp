import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");

const nameSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(100, "Name cannot exceed 100 characters");

const capacitySchema = z
  .number()
  .int("Capacity must be a whole number")
  .positive("Capacity must be greater than zero")
  .max(100000, "Capacity is too large");

export const classParamsSchema = z.object({
  id: uuidSchema,
});

export const classIdParamsSchema = z.object({
  classId: uuidSchema,
});

export const sectionParamsSchema = z.object({
  classId: uuidSchema,
  sectionId: uuidSchema,
});

export const createClassSchema = z.object({
  name: nameSchema("Class name is required"),
  classTeacherId: uuidSchema.nullable().optional(),
});

export const updateClassSchema = z
  .object({
    name: nameSchema("Class name is required").optional(),
    classTeacherId: uuidSchema.nullable().optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.classTeacherId !== undefined,
    {
      message: "At least one field is required",
    },
  );

export const createSectionSchema = z.object({
  name: nameSchema("Section name is required"),
  capacity: capacitySchema.nullable().optional(),
});

export const updateSectionSchema = z
  .object({
    name: nameSchema("Section name is required").optional(),
    capacity: capacitySchema.nullable().optional(),
  })
  .refine((data) => data.name !== undefined || data.capacity !== undefined, {
    message: "At least one field is required",
  });
