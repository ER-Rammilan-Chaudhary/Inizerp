import { EnrollmentStatus, Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateEnrollmentData {
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId?: string | null;
  rollNo?: string | null;
}

interface UpdateEnrollmentData {
  academicYearId?: string;
  classId?: string;
  sectionId?: string | null;
  rollNo?: string | null;
  status?: EnrollmentStatus;
}

export interface EnrollmentListQuery {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  sectionName?: string;
  status?: EnrollmentStatus;
  search?: string;
}

export interface PromoteStudentItem {
  studentId: string;
  targetClassId: string;
  targetSectionId?: string | null;
  rollNo?: string | null;
}

export interface PromoteStudentsData {
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  promotions: PromoteStudentItem[];
}


const enrollmentSelect = {
  id: true,
  schoolId: true,
  studentId: true,
  academicYearId: true,
  classId: true,
  sectionId: true,
  rollNo: true,
  status: true,
  enrolledAt: true,
  withdrawnAt: true,
  createdAt: true,
  updatedAt: true,
  student: {
    select: {
      id: true,
      admissionNo: true,
      rollNo: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
  },
  academicYear: {
    select: {
      id: true,
      name: true,
      code: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
    },
  },
  class: {
    select: {
      id: true,
      name: true,
    },
  },
  section: {
    select: {
      id: true,
      name: true,
      capacity: true,
    },
  },
} as const;

const getEnrollmentOrThrow = async (schoolId: string, enrollmentId: string) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      schoolId,
      isDeleted: false,
    },
    select: enrollmentSelect,
  });

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};

const validateReferences = async (
  schoolId: string,
  data: {
    studentId: string;
    academicYearId: string;
    classId: string;
    sectionId?: string | null;
  },
) => {
  const [student, academicYear, classData] = await Promise.all([
    prisma.student.findFirst({
      where: {
        id: data.studentId,
        schoolId,
        isDeleted: false,
        user: {
          isDeleted: false,
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.academicYear.findFirst({
      where: {
        id: data.academicYearId,
        schoolId,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    }),
    prisma.class.findFirst({
      where: {
        id: data.classId,
        schoolId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found");
  }

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  if (data.sectionId) {
    const section = await prisma.section.findFirst({
      where: {
        id: data.sectionId,
        schoolId,
        classId: data.classId,
      },
      select: {
        id: true,
      },
    });

    if (!section) {
      throw new ApiError(
        404,
        "Section not found or does not belong to selected class",
      );
    }
  }
};

const validateSectionCapacity = async (
  schoolId: string,
  sectionId: string | null | undefined,
  academicYearId: string,
  excludeEnrollmentId?: string,
) => {
  if (!sectionId) {
    return;
  }

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolId,
    },
    select: {
      id: true,
      capacity: true,
    },
  });

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  if (section.capacity === null) {
    return;
  }

  const activeEnrollmentCount = await prisma.enrollment.count({
    where: {
      schoolId,
      academicYearId,
      sectionId,
      isDeleted: false,
      status: EnrollmentStatus.ACTIVE,
      ...(excludeEnrollmentId
        ? {
            NOT: {
              id: excludeEnrollmentId,
            },
          }
        : {}),
    },
  });

  if (activeEnrollmentCount >= section.capacity) {
    throw new ApiError(409, "Section capacity has been reached");
  }
};

export const getEnrollments = async (
  schoolId: string,
  query: EnrollmentListQuery = {},
) => {
  const { academicYearId, classId, sectionId, sectionName, status, search } = query;

  const where: Prisma.EnrollmentWhereInput = {
    schoolId,
    isDeleted: false,
    ...(academicYearId ? { academicYearId } : {}),
    ...(classId ? { classId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(sectionName
      ? {
          section: {
            name: {
              equals: sectionName,
              mode: "insensitive",
            },
          },
        }
      : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              student: {
                admissionNo: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              student: {
                user: {
                  fullName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              rollNo: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  return prisma.enrollment.findMany({
    where,
    select: enrollmentSelect,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
};

export const getEnrollmentById = async (
  schoolId: string,
  enrollmentId: string,
) => {
  return getEnrollmentOrThrow(schoolId, enrollmentId);
};

export const createEnrollment = async (
  schoolId: string,
  data: CreateEnrollmentData,
) => {
  await validateReferences(schoolId, data);

  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      schoolId,
      academicYearId: data.academicYearId,
      studentId: data.studentId,
    },
    select: {
      id: true,
      isDeleted: true,
      status: true,
    },
  });

  if (existingEnrollment && !existingEnrollment.isDeleted) {
    throw new ApiError(
      409,
      "Student is already enrolled in this academic year",
    );
  }

  await validateSectionCapacity(
    schoolId,
    data.sectionId,
    data.academicYearId,
    existingEnrollment?.id,
  );

  try {
    if (existingEnrollment && existingEnrollment.isDeleted) {
      return await prisma.enrollment.update({
        where: {
          id: existingEnrollment.id,
        },
        data: {
          classId: data.classId,
          sectionId: data.sectionId ?? null,
          rollNo: data.rollNo ?? null,
          status: EnrollmentStatus.ACTIVE,
          enrolledAt: new Date(),
          withdrawnAt: null,
          isDeleted: false,
          deletedAt: null,
        },
        select: enrollmentSelect,
      });
    }

    return await prisma.enrollment.create({
      data: {
        schoolId,
        studentId: data.studentId,
        academicYearId: data.academicYearId,
        classId: data.classId,
        sectionId: data.sectionId ?? null,
        rollNo: data.rollNo ?? null,
        status: EnrollmentStatus.ACTIVE,
      },
      select: enrollmentSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "Student is already enrolled in this academic year",
      );
    }

    throw error;
  }
};

export const updateEnrollment = async (
  schoolId: string,
  enrollmentId: string,
  data: UpdateEnrollmentData,
) => {
  const existing = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      studentId: true,
      academicYearId: true,
      classId: true,
      sectionId: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Enrollment not found");
  }

  const academicYearId = data.academicYearId ?? existing.academicYearId;

  const classId = data.classId ?? existing.classId;

  const sectionId =
    data.sectionId !== undefined ? data.sectionId : existing.sectionId;

  await validateReferences(schoolId, {
    studentId: existing.studentId,
    academicYearId,
    classId,
    sectionId,
  });

  if (academicYearId !== existing.academicYearId) {
    const duplicate = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId: existing.studentId,
        academicYearId,
        isDeleted: false,
        NOT: {
          id: enrollmentId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "Student is already enrolled in this academic year",
      );
    }
  }

  const nextStatus = data.status ?? existing.status;

  const sectionChanged = sectionId !== existing.sectionId;

  const academicYearChanged = academicYearId !== existing.academicYearId;

  const becomingActive =
    existing.status !== EnrollmentStatus.ACTIVE &&
    nextStatus === EnrollmentStatus.ACTIVE;

  if (sectionChanged || academicYearChanged || becomingActive) {
    await validateSectionCapacity(
      schoolId,
      sectionId,
      academicYearId,
      enrollmentId,
    );
  }

  const updateData: Prisma.EnrollmentUncheckedUpdateInput = {};

  if (data.academicYearId !== undefined) {
    updateData.academicYearId = data.academicYearId;
  }

  if (data.classId !== undefined) {
    updateData.classId = data.classId;
  }

  if (data.sectionId !== undefined) {
    updateData.sectionId = data.sectionId;
  }

  if (data.rollNo !== undefined) {
    updateData.rollNo = data.rollNo;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;

    if (data.status === EnrollmentStatus.WITHDRAWN) {
      updateData.withdrawnAt = new Date();
    } else if (
      data.status === EnrollmentStatus.ACTIVE ||
      data.status === EnrollmentStatus.COMPLETED
    ) {
      updateData.withdrawnAt = null;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return getEnrollmentOrThrow(schoolId, enrollmentId);
  }

  try {
    return await prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: updateData,
      select: enrollmentSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "Student is already enrolled in this academic year",
      );
    }

    throw error;
  }
};

export const deleteEnrollment = async (
  schoolId: string,
  enrollmentId: string,
) => {
  const existing = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Enrollment not found");
  }

  return prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      status: EnrollmentStatus.WITHDRAWN,
      withdrawnAt: new Date(),
      isDeleted: true,
      deletedAt: new Date(),
    },
    select: {
      id: true,
    },
  });
};

export const promoteStudents = async (
  schoolId: string,
  data: PromoteStudentsData,
) => {
  if (data.sourceAcademicYearId === data.targetAcademicYearId) {
    throw new ApiError(
      400,
      "Source and Target academic years must be different",
    );
  }

  const [sourceYear, targetYear] = await Promise.all([
    prisma.academicYear.findFirst({
      where: { id: data.sourceAcademicYearId, schoolId, isDeleted: false },
    }),
    prisma.academicYear.findFirst({
      where: { id: data.targetAcademicYearId, schoolId, isDeleted: false },
    }),
  ]);

  if (!sourceYear || !targetYear) {
    throw new ApiError(404, "One or both academic years not found");
  }

  if (!data.promotions.length) {
    throw new ApiError(400, "No students selected for promotion");
  }

  return prisma.$transaction(async (tx) => {
    let promotedCount = 0;

    for (const item of data.promotions) {
      await tx.enrollment.updateMany({
        where: {
          schoolId,
          academicYearId: data.sourceAcademicYearId,
          studentId: item.studentId,
          isDeleted: false,
          status: EnrollmentStatus.ACTIVE,
        },
        data: {
          status: EnrollmentStatus.COMPLETED,
        },
      });

      const existingInTarget = await tx.enrollment.findFirst({
        where: {
          schoolId,
          academicYearId: data.targetAcademicYearId,
          studentId: item.studentId,
        },
      });

      if (existingInTarget) {
        if (existingInTarget.isDeleted) {
          await tx.enrollment.update({
            where: { id: existingInTarget.id },
            data: {
              classId: item.targetClassId,
              sectionId: item.targetSectionId ?? null,
              rollNo: item.rollNo ?? null,
              status: EnrollmentStatus.ACTIVE,
              isDeleted: false,
              deletedAt: null,
              enrolledAt: new Date(),
              withdrawnAt: null,
            },
          });
          promotedCount++;
        } else {
          await tx.enrollment.update({
            where: { id: existingInTarget.id },
            data: {
              classId: item.targetClassId,
              sectionId: item.targetSectionId ?? null,
              rollNo: item.rollNo ?? null,
              status: EnrollmentStatus.ACTIVE,
            },
          });
          promotedCount++;
        }
      } else {
        await tx.enrollment.create({
          data: {
            schoolId,
            academicYearId: data.targetAcademicYearId,
            studentId: item.studentId,
            classId: item.targetClassId,
            sectionId: item.targetSectionId ?? null,
            rollNo: item.rollNo ?? null,
            status: EnrollmentStatus.ACTIVE,
            enrolledAt: new Date(),
          },
        });
        promotedCount++;
      }
    }

    return {
      success: true,
      promotedCount,
      totalRequested: data.promotions.length,
    };
  });
};

