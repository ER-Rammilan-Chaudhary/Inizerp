import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

type AcademicYearInput = {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
};

type AcademicYearUpdateInput = {
  name?: string;
  code?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
};

const academicYearSelect = {
  id: true,
  schoolId: true,
  name: true,
  code: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const getAcademicYearOrThrow = async (schoolId: string, id: string) => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id,
      schoolId,
      isDeleted: false,
    },
    select: academicYearSelect,
  });

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found");
  }

  return academicYear;
};

const validateDateRange = (startDate: Date, endDate: Date) => {
  if (startDate >= endDate) {
    throw new ApiError(400, "Start date must be before end date");
  }
};

const validateDuplicateCode = async (
  schoolId: string,
  code: string,
  excludeId?: string,
) => {
  const existing = await prisma.academicYear.findFirst({
    where: {
      schoolId,
      code,
      isDeleted: false,
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
    throw new ApiError(409, "Academic year code already exists");
  }
};

export const getAcademicYearsService = async (schoolId: string) => {
  return prisma.academicYear.findMany({
    where: {
      schoolId,
      isDeleted: false,
    },
    orderBy: [
      {
        isCurrent: "desc",
      },
      {
        startDate: "desc",
      },
    ],
    select: academicYearSelect,
  });
};

export const getCurrentAcademicYearService = async (schoolId: string) => {
  return prisma.academicYear.findFirst({
    where: {
      schoolId,
      isCurrent: true,
      isActive: true,
      isDeleted: false,
    },
    select: academicYearSelect,
  });
};

export const getAcademicYearByIdService = async (
  schoolId: string,
  id: string,
) => {
  return prisma.academicYear.findFirst({
    where: {
      id,
      schoolId,
      isDeleted: false,
    },
    select: academicYearSelect,
  });
};

export const createAcademicYearService = async (
  schoolId: string,
  data: AcademicYearInput,
) => {
  validateDateRange(data.startDate, data.endDate);

  await validateDuplicateCode(schoolId, data.code);

  try {
    return await prisma.academicYear.create({
      data: {
        schoolId,
        name: data.name,
        code: data.code,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive ?? true,
        isCurrent: false,
        isDeleted: false,
      },
      select: academicYearSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Academic year code already exists");
    }

    throw error;
  }
};

export const updateAcademicYearService = async (
  schoolId: string,
  id: string,
  data: AcademicYearUpdateInput,
) => {
  const existing = await getAcademicYearOrThrow(schoolId, id);

  if (existing.isCurrent && data.isActive === false) {
    throw new ApiError(400, "Current academic year cannot be deactivated");
  }

  const startDate = data.startDate ?? existing.startDate;

  const endDate = data.endDate ?? existing.endDate;

  validateDateRange(startDate, endDate);

  if (data.code !== undefined && data.code !== existing.code) {
    await validateDuplicateCode(schoolId, data.code, id);
  }

  try {
    return await prisma.academicYear.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.code !== undefined
          ? {
              code: data.code,
            }
          : {}),
        ...(data.startDate !== undefined
          ? {
              startDate: data.startDate,
            }
          : {}),
        ...(data.endDate !== undefined
          ? {
              endDate: data.endDate,
            }
          : {}),
        ...(data.isActive !== undefined
          ? {
              isActive: data.isActive,
            }
          : {}),
      },
      select: academicYearSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Academic year code already exists");
    }

    throw error;
  }
};

export const setCurrentAcademicYearService = async (
  schoolId: string,
  id: string,
) => {
  const academicYear = await getAcademicYearOrThrow(schoolId, id);

  if (!academicYear.isActive) {
    throw new ApiError(400, "Inactive academic year cannot be set as current");
  }

  return prisma.$transaction(async (tx) => {
    await tx.academicYear.updateMany({
      where: {
        schoolId,
        isCurrent: true,
        isDeleted: false,
        id: {
          not: id,
        },
      },
      data: {
        isCurrent: false,
      },
    });

    return tx.academicYear.update({
      where: {
        id,
      },
      data: {
        isCurrent: true,
      },
      select: academicYearSelect,
    });
  });
};

export const deleteAcademicYearService = async (
  schoolId: string,
  id: string,
) => {
  const academicYear = await getAcademicYearOrThrow(schoolId, id);

  if (academicYear.isCurrent) {
    throw new ApiError(400, "Current academic year cannot be deleted");
  }

  const enrollmentCount = await prisma.enrollment.count({
    where: {
      schoolId,
      academicYearId: id,
      isDeleted: false,
    },
  });

  if (enrollmentCount > 0) {
    throw new ApiError(
      409,
      "Academic year cannot be deleted because enrollments exist",
    );
  }

  const timetableCount = await prisma.timetable.count({
    where: {
      schoolId,
      academicYearId: id,
    },
  });

  if (timetableCount > 0) {
    throw new ApiError(
      409,
      "Academic year cannot be deleted because timetable records exist",
    );
  }

  return prisma.academicYear.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      isActive: false,
      isCurrent: false,
      deletedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      code: true,
      isCurrent: true,
      isActive: true,
      isDeleted: true,
      deletedAt: true,
    },
  });
};
