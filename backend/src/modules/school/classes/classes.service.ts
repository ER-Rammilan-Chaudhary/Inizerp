import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateClassData {
  name: string;
  classTeacherId?: string | null;
}

interface UpdateClassData {
  name?: string;
  classTeacherId?: string | null;
}

interface CreateSectionData {
  name: string;
  capacity?: number | null;
}

interface UpdateSectionData {
  name?: string;
  capacity?: number | null;
}

interface ClassListQuery {
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

const classSelect = {
  id: true,
  schoolId: true,
  name: true,
  classTeacherId: true,
  createdAt: true,
  updatedAt: true,
  classTeacher: {
    select: {
      id: true,
      employeeId: true,
      designation: true,
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  },
} satisfies Prisma.ClassSelect;

const sectionSelect = {
  id: true,
  schoolId: true,
  classId: true,
  name: true,
  capacity: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SectionSelect;

const getCurrentAcademicYear = async (schoolId: string) => {
  return prisma.academicYear.findFirst({
    where: {
      schoolId,
      isCurrent: true,
      isActive: true,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });
};

const getClassOrThrow = async (schoolId: string, classId: string) => {
  const classRecord = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId,
    },
    select: classSelect,
  });

  if (!classRecord) {
    throw new ApiError(404, "Class not found");
  }

  return classRecord;
};

const getSectionOrThrow = async (
  schoolId: string,
  classId: string,
  sectionId: string,
) => {
  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      classId,
      schoolId,
    },
    select: sectionSelect,
  });

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  return section;
};

const validateClassTeacher = async (
  schoolId: string,
  teacherId: string | null | undefined,
) => {
  if (teacherId === undefined || teacherId === null) {
    return;
  }

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      schoolId,
      user: {
        isDeleted: false,
      },
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw new ApiError(400, "Class teacher not found in this school");
  }
};

const validateClassName = async (
  schoolId: string,
  name: string,
  excludeId?: string,
) => {
  const existing = await prisma.class.findFirst({
    where: {
      schoolId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new ApiError(409, "Class name already exists");
  }
};

const validateSectionName = async (
  classId: string,
  name: string,
  excludeId?: string,
) => {
  const existing = await prisma.section.findFirst({
    where: {
      classId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new ApiError(409, "Section name already exists");
  }
};

const getActiveEnrollmentCount = async (
  schoolId: string,
  academicYearId: string,
  sectionId: string,
  excludeEnrollmentId?: string,
) => {
  return prisma.enrollment.count({
    where: {
      schoolId,
      academicYearId,
      sectionId,
      status: "ACTIVE",
      isDeleted: false,
      ...(excludeEnrollmentId
        ? {
            id: {
              not: excludeEnrollmentId,
            },
          }
        : {}),
    },
  });
};

export const getClasses = async (
  schoolId: string,
  query: ClassListQuery = {},
) => {
  const { search, sortBy = "name", sortOrder = "asc" } = query;

  const currentAcademicYear = await getCurrentAcademicYear(schoolId);

  const classes = await prisma.class.findMany({
    where: {
      schoolId,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      ...classSelect,
      sections: {
        orderBy: {
          name: "asc",
        },
        select: {
          ...sectionSelect,
          ...(currentAcademicYear
            ? {
                _count: {
                  select: {
                    enrollments: {
                      where: {
                        academicYearId: currentAcademicYear.id,
                        status: "ACTIVE",
                        isDeleted: false,
                      },
                    },
                  },
                },
              }
            : {}),
        },
      },
    },
  });

  return classes.map((classRecord) => ({
    ...classRecord,
    sections: classRecord.sections.map((section) => ({
      ...section,
      studentCount: currentAcademicYear ? section._count.enrollments : 0,
      _count: undefined,
    })),
  }));
};

export const getClassById = async (schoolId: string, classId: string) => {
  const currentAcademicYear = await getCurrentAcademicYear(schoolId);

  const classRecord = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId,
    },
    select: {
      ...classSelect,
      sections: {
        orderBy: {
          name: "asc",
        },
        select: {
          ...sectionSelect,
          ...(currentAcademicYear
            ? {
                _count: {
                  select: {
                    enrollments: {
                      where: {
                        academicYearId: currentAcademicYear.id,
                        status: "ACTIVE",
                        isDeleted: false,
                      },
                    },
                  },
                },
              }
            : {}),
        },
      },
      _count: {
        select: {
          enrollments: {
            where: {
              ...(currentAcademicYear
                ? {
                    academicYearId: currentAcademicYear.id,
                  }
                : {}),
              status: "ACTIVE",
              isDeleted: false,
            },
          },
          attendance: true,
          timetables: true,
        },
      },
    },
  });

  if (!classRecord) {
    throw new ApiError(404, "Class not found");
  }

  return {
    ...classRecord,
    sections: classRecord.sections.map((section) => ({
      ...section,
      studentCount: currentAcademicYear ? section._count.enrollments : 0,
      _count: undefined,
    })),
    studentCount: currentAcademicYear ? classRecord._count.enrollments : 0,
    attendanceCount: classRecord._count.attendance,
    timetableCount: classRecord._count.timetables,
    _count: undefined,
  };
};

export const createClass = async (schoolId: string, data: CreateClassData) => {
  await validateClassName(schoolId, data.name);

  await validateClassTeacher(schoolId, data.classTeacherId);

  try {
    return await prisma.class.create({
      data: {
        schoolId,
        name: data.name,
        classTeacherId: data.classTeacherId ?? null,
      },
      select: classSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Class name already exists");
    }

    throw error;
  }
};

export const updateClass = async (
  schoolId: string,
  classId: string,
  data: UpdateClassData,
) => {
  await getClassOrThrow(schoolId, classId);

  if (data.name !== undefined) {
    await validateClassName(schoolId, data.name, classId);
  }

  if (data.classTeacherId !== undefined) {
    await validateClassTeacher(schoolId, data.classTeacherId);
  }

  try {
    return await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.classTeacherId !== undefined
          ? {
              classTeacherId: data.classTeacherId,
            }
          : {}),
      },
      select: classSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Class name already exists");
    }

    throw error;
  }
};

export const deleteClass = async (schoolId: string, classId: string) => {
  await getClassOrThrow(schoolId, classId);

  const [sectionCount, enrollmentCount, attendanceCount, timetableCount] =
    await Promise.all([
      prisma.section.count({
        where: {
          schoolId,
          classId,
        },
      }),
      prisma.enrollment.count({
        where: {
          schoolId,
          classId,
          isDeleted: false,
        },
      }),
      prisma.attendance.count({
        where: {
          schoolId,
          classId,
        },
      }),
      prisma.timetable.count({
        where: {
          schoolId,
          classId,
        },
      }),
    ]);

  if (sectionCount > 0) {
    throw new ApiError(409, "Class cannot be deleted because sections exist");
  }

  if (enrollmentCount > 0) {
    throw new ApiError(
      409,
      "Class cannot be deleted because enrollments exist",
    );
  }

  if (attendanceCount > 0) {
    throw new ApiError(
      409,
      "Class cannot be deleted because attendance records exist",
    );
  }

  if (timetableCount > 0) {
    throw new ApiError(
      409,
      "Class cannot be deleted because timetable records exist",
    );
  }

  await prisma.class.delete({
    where: {
      id: classId,
    },
  });

  return {
    id: classId,
    deleted: true,
  };
};

export const getSections = async (schoolId: string, classId: string) => {
  await getClassOrThrow(schoolId, classId);

  const currentAcademicYear = await getCurrentAcademicYear(schoolId);

  const sections = await prisma.section.findMany({
    where: {
      schoolId,
      classId,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      ...sectionSelect,
      ...(currentAcademicYear
        ? {
            _count: {
              select: {
                enrollments: {
                  where: {
                    academicYearId: currentAcademicYear.id,
                    status: "ACTIVE",
                    isDeleted: false,
                  },
                },
              },
            },
          }
        : {}),
    },
  });

  return sections.map((section) => ({
    ...section,
    studentCount: currentAcademicYear ? section._count.enrollments : 0,
    _count: undefined,
  }));
};

export const createSection = async (
  schoolId: string,
  classId: string,
  data: CreateSectionData,
) => {
  await getClassOrThrow(schoolId, classId);

  await validateSectionName(classId, data.name);

  try {
    return await prisma.section.create({
      data: {
        schoolId,
        classId,
        name: data.name,
        capacity: data.capacity ?? null,
      },
      select: sectionSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Section name already exists");
    }

    throw error;
  }
};

export const updateSection = async (
  schoolId: string,
  classId: string,
  sectionId: string,
  data: UpdateSectionData,
) => {
  const section = await getSectionOrThrow(schoolId, classId, sectionId);

  if (data.name !== undefined) {
    await validateSectionName(classId, data.name, sectionId);
  }

  if (data.capacity !== undefined && data.capacity !== null) {
    const currentAcademicYear = await getCurrentAcademicYear(schoolId);

    if (currentAcademicYear) {
      const studentCount = await getActiveEnrollmentCount(
        schoolId,
        currentAcademicYear.id,
        sectionId,
      );

      if (data.capacity < studentCount) {
        throw new ApiError(
          409,
          `Section capacity cannot be less than current student count (${studentCount})`,
        );
      }
    }
  }

  try {
    return await prisma.section.update({
      where: {
        id: section.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.capacity !== undefined
          ? {
              capacity: data.capacity,
            }
          : {}),
      },
      select: sectionSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Section name already exists");
    }

    throw error;
  }
};

export const deleteSection = async (
  schoolId: string,
  classId: string,
  sectionId: string,
) => {
  await getSectionOrThrow(schoolId, classId, sectionId);

  const [enrollmentCount, timetableCount] = await Promise.all([
    prisma.enrollment.count({
      where: {
        schoolId,
        sectionId,
        isDeleted: false,
      },
    }),
    prisma.timetable.count({
      where: {
        schoolId,
        sectionId,
      },
    }),
  ]);

  if (enrollmentCount > 0) {
    throw new ApiError(
      409,
      "Section cannot be deleted because enrollments exist",
    );
  }

  if (timetableCount > 0) {
    throw new ApiError(
      409,
      "Section cannot be deleted because timetable records exist",
    );
  }

  await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    id: sectionId,
    deleted: true,
  };
};
