import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");

const optionalUuidSchema = z
  .string()
  .uuid("Invalid ID")
  .nullable()
  .optional()
  .or(z.literal("").transform(() => undefined));

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
  .transform((value) => new Date(`${value}T00:00:00.000Z`))
  .nullable()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalStringSchema = (maxLen: number) =>
  z
    .string()
    .trim()
    .max(maxLen)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => undefined));

export const studentParamsSchema = z.object({
  id: uuidSchema,
});

export const createStudentSchema = z.object({
  fullName: z.string().trim().min(1, "Student name is required").max(100),

  email: z.string().trim().email("Invalid email address"),

  phone: optionalStringSchema(20),

  password: z.string().min(8, "Password must be at least 8 characters"),

  rollNo: optionalStringSchema(50),

  dob: dateSchema,

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .nullable()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  address: optionalStringSchema(500),

  parentId: optionalUuidSchema,

  guardianId: optionalUuidSchema,

  admissionDate: dateSchema,

  bloodGroup: optionalStringSchema(10),

  academicYearId: uuidSchema,

  classId: uuidSchema,

  sectionId: optionalUuidSchema,

  parentFullName: optionalStringSchema(100),

  parentEmail: z
    .string()
    .trim()
    .email("Invalid parent email address")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  parentPhone: optionalStringSchema(20),

  parentOccupation: optionalStringSchema(100),

  parentPassword: z
    .string()
    .min(8)
    .max(100)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  guardianFullName: optionalStringSchema(100),

  guardianRelationship: optionalStringSchema(50),

  guardianPhone: optionalStringSchema(20),
});

export const updateStudentSchema = z
  .object({
    fullName: z.string().trim().min(1).max(100).optional(),

    email: z.string().trim().email("Invalid email address").optional(),

    phone: optionalStringSchema(20),

    password: z
      .string()
      .min(8)
      .optional()
      .or(z.literal("").transform(() => undefined)),

    rollNo: optionalStringSchema(50),

    dob: dateSchema,

    gender: z
      .enum(["MALE", "FEMALE", "OTHER"])
      .nullable()
      .optional()
      .or(z.literal("").transform(() => undefined)),

    address: optionalStringSchema(500),

    parentId: optionalUuidSchema,

    guardianId: optionalUuidSchema,

    admissionDate: dateSchema,

    bloodGroup: optionalStringSchema(10),

    academicYearId: uuidSchema.optional(),

    classId: uuidSchema.optional(),

    sectionId: optionalUuidSchema,

    parentFullName: optionalStringSchema(100),

    parentEmail: z
      .string()
      .trim()
      .email("Invalid parent email address")
      .nullable()
      .optional()
      .or(z.literal("").transform(() => undefined)),

    parentPhone: optionalStringSchema(20),

    parentOccupation: optionalStringSchema(100),

    guardianFullName: optionalStringSchema(100),

    guardianRelationship: optionalStringSchema(50),

    guardianPhone: optionalStringSchema(20),
  })
  .refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined,
      ),
    {
      message: "At least one field is required",
    },
  );
