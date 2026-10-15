import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import type { HomeworkListQuery } from "./homework.schema";

export interface CreateHomeworkInput {
  academicYearId?: string | null;
  classId: string;
  sectionId?: string | null;
  subjectId: string;
  teacherId?: string | null;
  title: string;
  description?: string | null;
  assignedAt?: Date;
  dueDate: Date;
  attachmentId?: string | null;
}

export interface UpdateHomeworkInput {
  academicYearId?: string | null;
  classId?: string;
  sectionId?: string | null;
  subjectId?: string;
  teacherId?: string | null;
  title?: string;
  description?: string | null;
  assignedAt?: Date;
  dueDate?: Date;
  attachmentId?: string | null;
}

const homeworkSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  classId: true,
  sectionId: true,
  subjectId: true,
  teacherId: true,
  title: true,
  description: true,
  assignedAt: true,
  dueDate: true,
  attachmentId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
} satisfies Prisma.HomeworkSelect;

const validateAcademicYear = async (
  schoolId: string,
  academicYearId: string | null | undefined,
) => {
  if (!academicYearId) {
    return;
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id: academicYearId,
      schoolId,
      isDeleted: false,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    throw new ApiError(
      400,
      "Academic year does not belong to this school or is inactive",
    );
  }
};

const validateClass = async (schoolId: string, classId: string) => {
  const schoolClass = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!schoolClass) {
    throw new ApiError(400, "Class does not belong to this school");
  }
};

const validateSection = async (
  schoolId: string,
  classId: string,
  sectionId: string | null | undefined,
) => {
  if (!sectionId) {
    return;
  }

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolId,
      classId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!section) {
    throw new ApiError(
      400,
      "Section does not belong to the selected class and school",
    );
  }
};

const validateSubject = async (schoolId: string, subjectId: string) => {
  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!subject) {
    throw new ApiError(400, "Subject does not belong to this school");
  }
};

const validateTeacher = async (
  schoolId: string,
  teacherId: string | null | undefined,
) => {
  if (!teacherId) {
    return;
  }

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw new ApiError(400, "Teacher does not belong to this school");
  }
};

export const getHomeworksService = async (
  schoolId: string,
  query: HomeworkListQuery,
) => {
  const {
    page,
    limit,
    academicYearId,
    classId,
    sectionId,
    subjectId,
    teacherId,
    status,
    search,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.HomeworkWhereInput = {
    schoolId,
    isDeleted: false,
    ...(academicYearId ? { academicYearId } : {}),
    ...(classId ? { classId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(subjectId ? { subjectId } : {}),
    ...(teacherId ? { teacherId } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(fromDate || toDate
      ? {
          dueDate: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, data] = await prisma.$transaction([
    prisma.homework.count({
      where,
    }),
    prisma.homework.findMany({
      where,
      skip,
      take: limit,
      select: homeworkSelect,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getHomeworkByIdService = async (
  schoolId: string,
  homeworkId: string,
) => {
  const homework = await prisma.homework.findFirst({
    where: {
      id: homeworkId,
      schoolId,
      isDeleted: false,
    },
    select: homeworkSelect,
  });

  if (!homework) {
    throw new ApiError(404, "Homework not found");
  }

  return homework;
};

export const createHomeworkService = async (
  schoolId: string,
  data: CreateHomeworkInput,
) => {
  await validateAcademicYear(schoolId, data.academicYearId);

  await validateClass(schoolId, data.classId);

  await validateSection(schoolId, data.classId, data.sectionId);

  await validateSubject(schoolId, data.subjectId);

  await validateTeacher(schoolId, data.teacherId);

  const assignedAt = data.assignedAt ?? new Date();

  if (assignedAt > data.dueDate) {
    throw new ApiError(400, "Due date must be after assigned date");
  }

  return prisma.homework.create({
    data: {
      schoolId,
      academicYearId: data.academicYearId ?? null,
      classId: data.classId,
      sectionId: data.sectionId ?? null,
      subjectId: data.subjectId,
      teacherId: data.teacherId ?? null,
      title: data.title,
      description: data.description ?? null,
      assignedAt,
      dueDate: data.dueDate,
      attachmentId: data.attachmentId ?? null,
    },
    select: homeworkSelect,
  });
};

export const updateHomeworkService = async (
  schoolId: string,
  homeworkId: string,
  data: UpdateHomeworkInput,
) => {
  const existing = await prisma.homework.findFirst({
    where: {
      id: homeworkId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      academicYearId: true,
      classId: true,
      sectionId: true,
      subjectId: true,
      teacherId: true,
      assignedAt: true,
      dueDate: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Homework not found");
  }

  const finalAcademicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existing.academicYearId;

  const finalClassId = data.classId ?? existing.classId;

  const finalSectionId =
    data.sectionId !== undefined ? data.sectionId : existing.sectionId;

  const finalSubjectId = data.subjectId ?? existing.subjectId;

  const finalTeacherId =
    data.teacherId !== undefined ? data.teacherId : existing.teacherId;

  const finalAssignedAt = data.assignedAt ?? existing.assignedAt;

  const finalDueDate = data.dueDate ?? existing.dueDate;

  await validateAcademicYear(schoolId, finalAcademicYearId);

  await validateClass(schoolId, finalClassId);

  await validateSection(schoolId, finalClassId, finalSectionId);

  await validateSubject(schoolId, finalSubjectId);

  await validateTeacher(schoolId, finalTeacherId);

  if (finalAssignedAt > finalDueDate) {
    throw new ApiError(400, "Due date must be after assigned date");
  }

  return prisma.homework.update({
    where: {
      id: homeworkId,
    },
    data: {
      academicYearId: finalAcademicYearId,
      classId: finalClassId,
      sectionId: finalSectionId,
      subjectId: finalSubjectId,
      teacherId: finalTeacherId,
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      assignedAt: finalAssignedAt,
      dueDate: finalDueDate,
      ...(data.attachmentId !== undefined && {
        attachmentId: data.attachmentId,
      }),
    },
    select: homeworkSelect,
  });
};

export const deleteHomeworkService = async (
  schoolId: string,
  homeworkId: string,
) => {
  const homework = await prisma.homework.findFirst({
    where: {
      id: homeworkId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!homework) {
    throw new ApiError(404, "Homework not found");
  }

  await prisma.homework.update({
    where: {
      id: homeworkId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
