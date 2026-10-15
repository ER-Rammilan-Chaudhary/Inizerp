import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import { USER_ROLES, USER_STATUSES } from "./user.constants";

import {
  UserQuery,
  CreateSchoolAdminInput,
  UpdateSchoolAdminInput,
  ResetPasswordInput,
} from "./user.types";

import { createAuditLogService } from "../audit-logs/audit-logs.service";

// USER SELECT
const userSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  avatar: true,
  role: true,
  status: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,

  school: {
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
    },
  },
} satisfies Prisma.UserSelect;

// GET USERS
export const getUsers = async (query: UserQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    isDeleted: false,

    role: {
      in: [...USER_ROLES],
    },
  };

  // Search
  if (query.search?.trim()) {
    const search = query.search.trim();

    where.OR = [
      {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Role
  if (
    query.role &&
    USER_ROLES.includes(query.role as (typeof USER_ROLES)[number])
  ) {
    where.role = query.role;
  }

  // School
  if (query.schoolId) {
    where.schoolId = query.schoolId;
  }

  // Status
  if (
    query.status &&
    USER_STATUSES.includes(query.status as (typeof USER_STATUSES)[number])
  ) {
    where.status = query.status;
  }

  // Query
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: userSelect,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

// GET USER BY ID
export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },

    select: userSelect,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// CREATE SCHOOL ADMIN
export const createSchoolAdmin = async (data: CreateSchoolAdminInput) => {
  const email = data.email.trim().toLowerCase();
  const fullName = data.fullName.trim();

  // Email exists
  const emailExists = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
    },

    select: {
      id: true,
    },
  });

  if (emailExists) {
    throw new ApiError(409, "Email already exists");
  }

  // School exists
  const school = await prisma.school.findFirst({
    where: {
      id: data.schoolId,
      isDeleted: false,
    },

    select: {
      id: true,
      status: true,
    },
  });

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  // School active
  if (school.status !== "ACTIVE") {
    throw new ApiError(400, "Cannot create admin for an inactive school");
  }

  // Existing admin
  const adminExists = await prisma.user.findFirst({
    where: {
      schoolId: data.schoolId,
      role: "SCHOOL_ADMIN",
      isDeleted: false,
    },

    select: {
      id: true,
    },
  });

  if (adminExists) {
    throw new ApiError(409, "School already has an admin");
  }

  // Password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create User + Ownership
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,

        phone: data.phone?.trim() || null,

        schoolId: data.schoolId,

        role: "SCHOOL_ADMIN",

        status: "ACTIVE",

        avatar: data.avatar ?? null,
      },
    });

    await tx.school.update({
      where: {
        id: data.schoolId,
      },

      data: {
        ownerId: createdUser.id,
      },
    });

    return createdUser;
  });

  // Audit Log
  await createAuditLogService({
    userId: user.id,

    schoolId: user.schoolId ?? undefined,

    action: "CREATE",

    module: "USER",

    entity: "School Admin",

    entityId: user.id,

    meta: {
      fullName: user.fullName,
      email: user.email,
    },
  });

  // Safe Response
  const { password: _password, ...safeUser } = user;

  return safeUser;
};

// UPDATE SCHOOL ADMIN
export const updateSchoolAdmin = async (
  id: string,
  data: UpdateSchoolAdminInput,
) => {
  // Find existing School Admin
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: "SCHOOL_ADMIN",
      isDeleted: false,
    },
  });

  if (!user) {
    throw new ApiError(404, "School Admin not found");
  }

  // Email
  const email =
    data.email !== undefined ? data.email.trim().toLowerCase() : undefined;

  if (email !== undefined) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,

        NOT: {
          id,
        },
      },

      select: {
        id: true,
      },
    });

    if (emailExists) {
      throw new ApiError(409, "Email already exists");
    }
  }

  // School Change
  const schoolChanged =
    data.schoolId !== undefined && data.schoolId !== user.schoolId;

  if (schoolChanged) {
    const newSchool = await prisma.school.findFirst({
      where: {
        id: data.schoolId,
        isDeleted: false,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!newSchool) {
      throw new ApiError(404, "School not found");
    }

    if (newSchool.status !== "ACTIVE") {
      throw new ApiError(400, "Cannot assign admin to an inactive school");
    }

    const anotherAdmin = await prisma.user.findFirst({
      where: {
        schoolId: data.schoolId,
        role: "SCHOOL_ADMIN",
        isDeleted: false,

        NOT: {
          id,
        },
      },

      select: {
        id: true,
      },
    });

    if (anotherAdmin) {
      throw new ApiError(409, "School already has another admin");
    }
  }

  // Update
  const updatedUser = await prisma.$transaction(
    async (tx) => {
      const updated = await tx.user.update({
        where: {
          id,
        },

        data: {
          ...(data.fullName !== undefined && {
            fullName: data.fullName.trim(),
          }),

          ...(email !== undefined && {
            email,
          }),

          ...(data.phone !== undefined && {
            phone: data.phone?.trim() || null,
          }),

          ...(data.avatar !== undefined && {
            avatar: data.avatar,
          }),

          ...(data.status !== undefined && {
            status: data.status,
          }),

          ...(data.schoolId !== undefined && {
            schoolId: data.schoolId,
          }),
        },
      });

      // School ownership change
      if (schoolChanged) {
        if (user.schoolId) {
          await tx.school.updateMany({
            where: {
              id: user.schoolId,
              ownerId: id,
            },

            data: {
              ownerId: null,
            },
          });
        }

        await tx.school.update({
          where: {
            id: data.schoolId!,
          },

          data: {
            ownerId: id,
          },
        });
      }

      return updated;
    },
    {
      timeout: 10000,
    },
  );

  // Audit Log
  await createAuditLogService({
    userId: updatedUser.id,

    schoolId: updatedUser.schoolId ?? undefined,

    action: "UPDATE",

    module: "USER",

    entity: "School Admin",

    entityId: updatedUser.id,

    meta: {
      updatedFields: Object.keys(data),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      previousSchoolId: user.schoolId,
      newSchoolId: updatedUser.schoolId,
    },
  });

  // Safe Response
  const { password: _password, ...safeUser } = updatedUser;

  return safeUser;
};

// DELETE SCHOOL ADMIN
export const deleteSchoolAdmin = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: "SCHOOL_ADMIN",
      isDeleted: false,
    },
  });

  if (!user) {
    throw new ApiError(404, "School Admin not found");
  }

  await prisma.$transaction(async (tx) => {
    // Remove school ownership
    if (user.schoolId) {
      await tx.school.updateMany({
        where: {
          id: user.schoolId,
          ownerId: id,
        },

        data: {
          ownerId: null,
        },
      });
    }

    // Soft Delete User
    await tx.user.update({
      where: {
        id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "INACTIVE",
      },
    });

    // Logout From All Devices
    await tx.refreshToken.deleteMany({
      where: {
        userId: id,
      },
    });
  });

  // Audit Log
  await createAuditLogService({
    userId: user.id,

    schoolId: user.schoolId ?? undefined,

    action: "DELETE",

    module: "USER",

    entity: "School Admin",

    entityId: user.id,

    meta: {
      fullName: user.fullName,
      email: user.email,
    },
  });
};

// RESET PASSWORD
export const resetSchoolAdminPassword = async (
  id: string,
  data: ResetPasswordInput,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: "SCHOOL_ADMIN",
      isDeleted: false,
    },
  });

  if (!user) {
    throw new ApiError(404, "School Admin not found");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id,
      },

      data: {
        password: hashedPassword,
      },
    });

    // Logout from all devices
    await tx.refreshToken.deleteMany({
      where: {
        userId: id,
      },
    });
  });

  // Audit Log
  await createAuditLogService({
    userId: user.id,
    schoolId: user.schoolId ?? undefined,
    action: "RESET_PASSWORD",
    module: "USER",
    entity: "School Admin",
    entityId: user.id,
    meta: {
      fullName: user.fullName,
      email: user.email,
    },
  });
};
