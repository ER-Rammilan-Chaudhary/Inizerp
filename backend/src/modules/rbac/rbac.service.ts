import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateRoleInput, UpdateRoleInput } from "../../utils/rbac.types";

// =================================
// GET ROLES
// =================================

export const getRoles = async () => {
  return prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// =================================
// CREATE ROLE
// =================================

export const createRole = async (data: CreateRoleInput) => {
  const exists = await prisma.role.findFirst({
    where: {
      schoolId: data.schoolId,
      key: data.key,
    },
  });

  if (exists) {
    throw new ApiError(400, "Role already exists");
  }

  return prisma.role.create({
    data,
  });
};

// =================================
// UPDATE ROLE
// =================================
export const updateRole = async (id: string, data: UpdateRoleInput) => {
  const role = await prisma.role.findUnique({
    where: {
      id,
    },
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  const { permissionIds, ...roleData } = data;

  return prisma.role.update({
    where: {
      id,
    },

    data: {
      ...roleData,

      ...(permissionIds && {
        permissions: {
          deleteMany: {},

          create: permissionIds.map((permissionId) => ({
            permission: {
              connect: {
                id: permissionId,
              },
            },
          })),
        },
      }),
    },

    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

// =================================
// DELETE ROLE
// =================================

export const deleteRole = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: {
      id,
    },
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.isSystem) {
    throw new ApiError(400, "System roles cannot be deleted");
  }

  await prisma.role.delete({
    where: {
      id,
    },
  });
};

// =================================
// ASSIGN PERMISSIONS TO ROLE
// =================================

export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[],
) => {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  // Remove old permissions
  await prisma.rolePermission.deleteMany({
    where: {
      roleId,
    },
  });

  // Add new permissions
  if (permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }

  return prisma.role.findUnique({
    where: {
      id: roleId,
    },

    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

// =================================
// GET ALL PERMISSIONS
// =================================

export const getPermissions = async () => {
  return prisma.permission.findMany({
    orderBy: [
      {
        module: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
};
