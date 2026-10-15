import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import type {
  CreateSubjectInput,
  SubjectQuery,
  UpdateSubjectInput,
} from "./subjects.schema";

const subjectSelect = {
  id: true,
  schoolId: true,
  name: true,
  code: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  teachers: {
    orderBy: {
      employeeId: "asc",
    },
    select: {
      id: true,
      employeeId: true,
      designation: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  },
  _count: {
    select: {
      results: true,
      timetables: true,
    },
  },
} satisfies Prisma.SubjectSelect;

const normalizeName = (value: string) => value.trim();

const normalizeCode = (value: string) => value.trim().toUpperCase();

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2002";

const getSubjectOrThrow = async (schoolId: string, subjectId: string) => {
  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      schoolId,
    },
    select: {
      id: true,
      schoolId: true,
      name: true,
      code: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return subject;
};

const validateTeachers = async (schoolId: string, teacherIds: string[]) => {
  if (teacherIds.length === 0) {
    return;
  }

  const uniqueTeacherIds = [...new Set(teacherIds)];

  if (uniqueTeacherIds.length !== teacherIds.length) {
    throw new ApiError(400, "Duplicate teacher IDs are not allowed");
  }

  const teachers = await prisma.teacher.findMany({
    where: {
      schoolId,
      id: {
        in: uniqueTeacherIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (teachers.length !== uniqueTeacherIds.length) {
    throw new ApiError(404, "One or more teachers not found in this school");
  }
};

const checkDuplicateSubject = async (
  schoolId: string,
  name: string,
  code: string,
  ignoreId?: string,
) => {
  const existingSubjects = await prisma.subject.findMany({
    where: {
      schoolId,
      ...(ignoreId
        ? {
            id: {
              not: ignoreId,
            },
          }
        : {}),
      OR: [
        {
          code: {
            equals: code,
            mode: "insensitive",
          },
        },
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
    take: 1,
  });

  if (existingSubjects.length > 0) {
    const existing = existingSubjects[0];

    if (existing.code.toLowerCase() === code.toLowerCase()) {
      throw new ApiError(409, "Subject with this code already exists");
    }

    throw new ApiError(409, "Subject with this name already exists");
  }
};

export const getSubjectsService = async (
  schoolId: string,
  query: SubjectQuery,
) => {
  const { search, page, limit, teacherId, hasTeachers, sortBy, sortOrder } =
    query;

  const skip = (page - 1) * limit;
  const trimmedSearch = search?.trim();

  const where: Prisma.SubjectWhereInput = {
    schoolId,

    ...(teacherId
      ? {
          teachers: {
            some: {
              id: teacherId,
            },
          },
        }
      : {}),

    ...(hasTeachers !== undefined
      ? {
          teachers: hasTeachers
            ? {
                some: {},
              }
            : {
                none: {},
              },
        }
      : {}),

    ...(trimmedSearch
      ? {
          OR: [
            {
              name: {
                contains: trimmedSearch,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: trimmedSearch,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: trimmedSearch,
                mode: "insensitive",
              },
            },
            {
              teachers: {
                some: {
                  OR: [
                    {
                      employeeId: {
                        contains: trimmedSearch,
                        mode: "insensitive",
                      },
                    },
                    {
                      designation: {
                        contains: trimmedSearch,
                        mode: "insensitive",
                      },
                    },
                    {
                      user: {
                        fullName: {
                          contains: trimmedSearch,
                          mode: "insensitive",
                        },
                      },
                    },
                    {
                      user: {
                        email: {
                          contains: trimmedSearch,
                          mode: "insensitive",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.SubjectOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [subjects, total] = await prisma.$transaction([
    prisma.subject.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: subjectSelect,
    }),

    prisma.subject.count({
      where,
    }),
  ]);

  return {
    data: subjects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

export const getSubjectByIdService = async (
  schoolId: string,
  subjectId: string,
) => {
  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      schoolId,
    },
    select: subjectSelect,
  });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return subject;
};

export const createSubjectService = async (
  schoolId: string,
  data: CreateSubjectInput,
) => {
  const name = normalizeName(data.name);
  const code = normalizeCode(data.code);
  const teacherIds = data.teacherIds ?? [];

  await checkDuplicateSubject(schoolId, name, code);
  await validateTeachers(schoolId, teacherIds);

  try {
    return await prisma.subject.create({
      data: {
        schoolId,
        name,
        code,
        description: data.description === undefined ? null : data.description,

        ...(teacherIds.length > 0
          ? {
              teachers: {
                connect: teacherIds.map((teacherId) => ({
                  id: teacherId,
                })),
              },
            }
          : {}),
      },
      select: subjectSelect,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ApiError(409, "Subject with this code already exists");
    }

    throw error;
  }
};

export const updateSubjectService = async (
  schoolId: string,
  subjectId: string,
  data: UpdateSubjectInput,
) => {
  await getSubjectOrThrow(schoolId, subjectId);

  const name = data.name !== undefined ? normalizeName(data.name) : undefined;

  const code = data.code !== undefined ? normalizeCode(data.code) : undefined;

  if (name !== undefined || code !== undefined) {
    const currentSubject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        schoolId,
      },
      select: {
        name: true,
        code: true,
      },
    });

    if (!currentSubject) {
      throw new ApiError(404, "Subject not found");
    }

    await checkDuplicateSubject(
      schoolId,
      name ?? currentSubject.name,
      code ?? currentSubject.code,
      subjectId,
    );
  }

  if (data.teacherIds !== undefined) {
    await validateTeachers(schoolId, data.teacherIds);
  }

  try {
    return await prisma.subject.update({
      where: {
        id: subjectId,
      },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(code !== undefined ? { code } : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.teacherIds !== undefined
          ? {
              teachers: {
                set: data.teacherIds.map((teacherId) => ({
                  id: teacherId,
                })),
              },
            }
          : {}),
      },
      select: subjectSelect,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ApiError(409, "Subject with this code already exists");
    }

    throw error;
  }
};

export const deleteSubjectService = async (
  schoolId: string,
  subjectId: string,
) => {
  await getSubjectOrThrow(schoolId, subjectId);

  const [resultCount, timetableCount] = await Promise.all([
    prisma.result.count({
      where: {
        schoolId,
        subjectId,
      },
    }),

    prisma.timetable.count({
      where: {
        schoolId,
        subjectId,
      },
    }),
  ]);

  if (resultCount > 0 || timetableCount > 0) {
    throw new ApiError(
      400,
      "Subject cannot be deleted because result or timetable records exist",
    );
  }

  await prisma.subject.delete({
    where: {
      id: subjectId,
    },
  });
};
