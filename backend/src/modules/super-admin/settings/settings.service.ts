import { prisma } from "../../../config/prisma";
import { invalidateMaintenanceCache } from "../../../middleware/maintenance.middleware";

export const getSettingsService = async () => {
  return prisma.setting.findMany({
    where: {
      schoolId: null,
    },
    orderBy: {
      key: "asc",
    },
    select: {
      id: true,
      key: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getSettingByKeyService = async (key: string) => {
  return prisma.setting.findFirst({
    where: {
      key,
      schoolId: null,
    },
    select: {
      id: true,
      key: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createOrUpdateSettingService = async (
  key: string,
  value: unknown,
) => {
  if (key === "maintenance_mode" || key === "maintenance_message") {
    invalidateMaintenanceCache();
  }
  const existing = await prisma.setting.findFirst({
    where: {
      key,
      schoolId: null,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return prisma.setting.update({
      where: {
        id: existing.id,
      },
      data: {
        value: value as any,
      },
      select: {
        id: true,
        key: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  return prisma.setting.create({
    data: {
      key,
      value: value as any,
    },
    select: {
      id: true,
      key: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateSettingService = async (
  key: string,
  value: unknown,
  schoolId?: string,
) => {
  const existing = await prisma.setting.findFirst({
    where: {
      key,
      schoolId: schoolId ?? null,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Setting not found");
  }

  if (key === "maintenance_mode" || key === "maintenance_message") {
    invalidateMaintenanceCache();
  }

  return prisma.setting.update({
    where: {
      id: existing.id,
    },
    data: {
      value: value as any,
    },
    select: {
      id: true,
      key: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteSettingService = async (key: string) => {
  const existing = await prisma.setting.findFirst({
    where: {
      key,
      schoolId: null,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Setting not found");
  }

  if (key === "maintenance_mode" || key === "maintenance_message") {
    invalidateMaintenanceCache();
  }

  return prisma.setting.delete({
    where: {
      id: existing.id,
    },
    select: {
      id: true,
      key: true,
      value: true,
    },
  });
};
