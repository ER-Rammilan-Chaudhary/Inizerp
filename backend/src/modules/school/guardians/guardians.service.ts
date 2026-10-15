import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

export interface CreateGuardianInput {
  fullName: string;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  occupation?: string | null;
  address?: string | null;
  userId?: string | null;
}

export interface UpdateGuardianInput {
  fullName?: string;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  occupation?: string | null;
  address?: string | null;
  userId?: string | null;
}

const guardianSelect = {
  id: true,
  schoolId: true,
  userId: true,
  fullName: true,
  relationship: true,
  phone: true,
  email: true,
  occupation: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.GuardianSelect;

export const getGuardiansService = async (schoolId: string) => {
  return prisma.guardian.findMany({
    where: {
      schoolId,
      isDeleted: false,
    },
    select: guardianSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getGuardianByIdService = async (
  schoolId: string,
  guardianId: string,
) => {
  const guardian = await prisma.guardian.findFirst({
    where: {
      id: guardianId,
      schoolId,
      isDeleted: false,
    },
    select: guardianSelect,
  });

  if (!guardian) {
    throw new ApiError(404, "Guardian not found");
  }

  return guardian;
};

export const createGuardianService = async (
  schoolId: string,
  data: CreateGuardianInput,
) => {
  if (data.userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        schoolId,
        role: "PARENT",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ApiError(
        400,
        "User must be an active parent user from the same school",
      );
    }

    const existingGuardian = await prisma.guardian.findFirst({
      where: {
        userId: data.userId,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (existingGuardian) {
      throw new ApiError(409, "User is already linked to a guardian");
    }
  }

  return prisma.guardian.create({
    data: {
      schoolId,
      fullName: data.fullName,
      relationship: data.relationship ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      occupation: data.occupation ?? null,
      address: data.address ?? null,
      userId: data.userId ?? null,
    },
    select: guardianSelect,
  });
};

export const updateGuardianService = async (
  schoolId: string,
  guardianId: string,
  data: UpdateGuardianInput,
) => {
  const guardian = await prisma.guardian.findFirst({
    where: {
      id: guardianId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!guardian) {
    throw new ApiError(404, "Guardian not found");
  }

  if (data.userId !== undefined && data.userId !== null) {
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        schoolId,
        role: "PARENT",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ApiError(
        400,
        "User must be an active parent user from the same school",
      );
    }

    const existingGuardian = await prisma.guardian.findFirst({
      where: {
        userId: data.userId,
        id: {
          not: guardianId,
        },
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (existingGuardian) {
      throw new ApiError(409, "User is already linked to another guardian");
    }
  }

  return prisma.guardian.update({
    where: {
      id: guardianId,
    },
    data: {
      ...(data.fullName !== undefined && {
        fullName: data.fullName,
      }),

      ...(data.relationship !== undefined && {
        relationship: data.relationship,
      }),

      ...(data.phone !== undefined && {
        phone: data.phone,
      }),

      ...(data.email !== undefined && {
        email: data.email,
      }),

      ...(data.occupation !== undefined && {
        occupation: data.occupation,
      }),

      ...(data.address !== undefined && {
        address: data.address,
      }),

      ...(data.userId !== undefined && {
        userId: data.userId,
      }),
    },
    select: guardianSelect,
  });
};

export const deleteGuardianService = async (
  schoolId: string,
  guardianId: string,
) => {
  const guardian = await prisma.guardian.findFirst({
    where: {
      id: guardianId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!guardian) {
    throw new ApiError(404, "Guardian not found");
  }

  const linkedStudents = await prisma.student.count({
    where: {
      schoolId,
      guardianId,
      isDeleted: false,
    },
  });

  if (linkedStudents > 0) {
    throw new ApiError(
      409,
      "Guardian cannot be deleted because students are linked to this guardian",
    );
  }

  await prisma.guardian.update({
    where: {
      id: guardianId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
