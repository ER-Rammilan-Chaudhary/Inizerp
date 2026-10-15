import { NotificationStatus, Prisma, RoleEnum } from "@prisma/client";

import { prisma } from "../../../../config/prisma";
import { ApiError } from "../../../../utils/ApiError";

const getUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      role: true,
      schoolId: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const getManagementWhere = (
  role: RoleEnum,
  schoolId: string | null,
  requestedSchoolId?: string,
): Prisma.NotificationWhereInput => {
  const where: Prisma.NotificationWhereInput = {
    isDeleted: false,
  };

  if (role === RoleEnum.SCHOOL_ADMIN) {
    if (!schoolId) {
      throw new ApiError(403, "School Admin is not assigned to a school");
    }

    where.schoolId = schoolId;
    return where;
  }

  if (role === RoleEnum.SUPER_ADMIN) {
    if (requestedSchoolId) {
      where.schoolId = requestedSchoolId;
    }

    return where;
  }

  throw new ApiError(
    403,
    "You are not allowed to view notification statistics",
  );
};

export const getNotificationStats = async (
  userId: string,
  schoolId?: string,
) => {
  const user = await getUser(userId);

  const where = getManagementWhere(user.role, user.schoolId, schoolId);

  const [
    total,
    draft,
    scheduled,
    sent,
    expired,
    failed,
    cancelled,
    pinned,
    deleted,
  ] = await prisma.$transaction([
    prisma.notification.count({
      where: {
        ...where,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.DRAFT,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.SCHEDULED,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.SENT,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.EXPIRED,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.FAILED,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        status: NotificationStatus.CANCELLED,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        isPinned: true,
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        ...where,
        isDeleted: true,
      },
    }),
  ]);

  return {
    total,
    byStatus: {
      draft,
      scheduled,
      sent,
      expired,
      failed,
      cancelled,
    },
    pinned,
    deleted,
  };
};

export const getNotificationReadStats = async (
  userId: string,
  notificationId: string,
) => {
  const user = await getUser(userId);

  if (
    user.role !== RoleEnum.SUPER_ADMIN &&
    user.role !== RoleEnum.SCHOOL_ADMIN
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view notification statistics",
    );
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      isDeleted: false,
    },
    select: {
      id: true,
      schoolId: true,
      status: true,
      title: true,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (
    user.role === RoleEnum.SCHOOL_ADMIN &&
    notification.schoolId !== user.schoolId
  ) {
    throw new ApiError(403, "You can only view statistics for your school");
  }

  const [readCount, uniqueAudienceUsers] = await prisma.$transaction([
    prisma.notificationRead.count({
      where: {
        notificationId,
      },
    }),

    prisma.notificationAudience.count({
      where: {
        notificationId,
      },
    }),
  ]);

  return {
    notificationId: notification.id,
    title: notification.title,
    status: notification.status,
    readCount,
    audienceCount: uniqueAudienceUsers,
  };
};

export const getNotificationStatusStats = async (
  userId: string,
  schoolId?: string,
) => {
  const user = await getUser(userId);

  const where = getManagementWhere(user.role, user.schoolId, schoolId);

  const result = await prisma.notification.groupBy({
    by: ["status"],
    where: {
      ...where,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  return result.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));
};

export const getNotificationTypeStats = async (
  userId: string,
  schoolId?: string,
) => {
  const user = await getUser(userId);

  const where = getManagementWhere(user.role, user.schoolId, schoolId);

  const result = await prisma.notification.groupBy({
    by: ["type"],
    where: {
      ...where,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  return result.map((item) => ({
    type: item.type,
    count: item._count._all,
  }));
};

export const getNotificationPriorityStats = async (
  userId: string,
  schoolId?: string,
) => {
  const user = await getUser(userId);

  const where = getManagementWhere(user.role, user.schoolId, schoolId);

  const result = await prisma.notification.groupBy({
    by: ["priority"],
    where: {
      ...where,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  return result.map((item) => ({
    priority: item.priority,
    count: item._count._all,
  }));
};
