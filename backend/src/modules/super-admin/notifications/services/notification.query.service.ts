import { NotificationStatus, Prisma, RoleEnum } from "@prisma/client";

import { prisma } from "../../../../config/prisma";
import { ApiError } from "../../../../utils/ApiError";
import { NotificationQueryDto } from "../dto/notifications.dto";
import {
  buildNotificationManagementWhere,
  validateNotificationSchoolAccess,
} from "../helpers/notification.helper";

const notificationInclude = {
  school: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  },
  audiences: {
    select: {
      id: true,
      targetType: true,
      schoolId: true,
      role: true,
      classId: true,
      sectionId: true,
      userId: true,
      studentId: true,
    },
  },
  _count: {
    select: {
      reads: true,
      audiences: true,
    },
  },
} satisfies Prisma.NotificationInclude;

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

const applyFilters = (
  where: Prisma.NotificationWhereInput,
  filters: NotificationQueryDto,
  userId: string,
) => {
  if (filters.search) {
    where.OR = [
      {
        title: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        message: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.readStatus === "read") {
    where.reads = {
      some: {
        userId,
      },
    };
  }

  if (filters.readStatus === "unread") {
    where.reads = {
      none: {
        userId,
      },
    };
  }
};

export const getManagedNotifications = async (
  userId: string,
  filters: NotificationQueryDto,
) => {
  const user = await getUser(userId);

  if (
    user.role !== RoleEnum.SUPER_ADMIN &&
    user.role !== RoleEnum.SCHOOL_ADMIN
  ) {
    throw new ApiError(403, "You are not allowed to view notifications");
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  let where = buildNotificationManagementWhere(user.role, user.schoolId);

  if (user.role === RoleEnum.SUPER_ADMIN && filters.schoolId) {
    where.schoolId = filters.schoolId;
  }

  applyFilters(where, filters, userId);

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      include: notificationInclude,
      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where,
    }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNotificationsBySchool = async (
  userId: string,
  schoolId: string,
  filters: NotificationQueryDto,
) => {
  const user = await getUser(userId);

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (user.schoolId !== schoolId) {
      throw new ApiError(
        403,
        "You can only access your own school's notifications",
      );
    }
  } else if (user.role !== RoleEnum.SUPER_ADMIN) {
    throw new ApiError(403, "You are not allowed to view school notifications");
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.NotificationWhereInput = {
    isDeleted: false,
    schoolId,
  };

  applyFilters(where, filters, userId);

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      include: notificationInclude,
      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where,
    }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getManagedNotificationById = async (
  userId: string,
  notificationId: string,
) => {
  const user = await getUser(userId);

  if (
    user.role !== RoleEnum.SUPER_ADMIN &&
    user.role !== RoleEnum.SCHOOL_ADMIN
  ) {
    throw new ApiError(403, "You are not allowed to view notifications");
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      isDeleted: false,
    },
    include: notificationInclude,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (
    !validateNotificationSchoolAccess(
      user.role,
      user.schoolId,
      notification.schoolId,
    )
  ) {
    throw new ApiError(403, "You are not allowed to access this notification");
  }

  return notification;
};

export const getNotificationAudiences = async (
  userId: string,
  notificationId: string,
) => {
  const notification = await getManagedNotificationById(userId, notificationId);

  return notification.audiences;
};

export const getNotificationReadStats = async (
  userId: string,
  notificationId: string,
) => {
  const notification = await getManagedNotificationById(userId, notificationId);

  const [readCount, totalReads] = await prisma.$transaction([
    prisma.notificationRead.count({
      where: {
        notificationId,
      },
    }),
    prisma.notificationRead.findMany({
      where: {
        notificationId,
      },
      select: {
        userId: true,
        readAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        readAt: "desc",
      },
    }),
  ]);

  return {
    notificationId: notification.id,
    readCount,
    reads: totalReads,
  };
};

export const getPublishedNotificationCount = async (
  userId: string,
  schoolId?: string,
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

  const where: Prisma.NotificationWhereInput = {
    isDeleted: false,
    status: NotificationStatus.SENT,
  };

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (!user.schoolId) {
      throw new ApiError(403, "School Admin is not assigned to a school");
    }

    where.schoolId = user.schoolId;
  }

  if (user.role === RoleEnum.SUPER_ADMIN && schoolId) {
    where.schoolId = schoolId;
  }

  return prisma.notification.count({
    where,
  });
};
