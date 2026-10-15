import { NotificationStatus, Prisma, RoleEnum } from "@prisma/client";

import { prisma } from "../../../../config/prisma";
import { ApiError } from "../../../../utils/ApiError";
import {
  buildNotificationVisibilityWhere,
  NotificationUserContext,
} from "../helpers/notification.helper";

const getUserContext = async (
  userId: string,
): Promise<NotificationUserContext> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      role: true,
      schoolId: true,
      student: {
        select: {
          id: true,
        },
      },
      parent: {
        select: {
          students: {
            where: {
              isDeleted: false,
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const context: NotificationUserContext = {
    userId: user.id,
    role: user.role,
    schoolId: user.schoolId ?? null,
    studentId: user.student?.id ?? null,
    parentStudentIds: user.parent?.students.map((student) => student.id) ?? [],
  };

  if (user.role === RoleEnum.STUDENT && user.student?.id) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: user.student.id,
        schoolId: user.schoolId ?? undefined,
        isDeleted: false,
        academicYear: {
          isCurrent: true,
          isDeleted: false,
        },
      },
      select: {
        classId: true,
        sectionId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (enrollment) {
      context.classId = enrollment.classId;
      context.sectionId = enrollment.sectionId;
    }
  }

  if (user.role === RoleEnum.PARENT && user.parent?.students.length) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: {
          in: user.parent.students.map((student) => student.id),
        },
        schoolId: user.schoolId ?? undefined,
        isDeleted: false,
        academicYear: {
          isCurrent: true,
          isDeleted: false,
        },
      },
      select: {
        classId: true,
        sectionId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (enrollment) {
      context.classId = enrollment.classId;
      context.sectionId = enrollment.sectionId;
    }
  }

  return context;
};

const getVisibleNotificationWhere = async (
  userId: string,
): Promise<Prisma.NotificationWhereInput> => {
  const context = await getUserContext(userId);

  return buildNotificationVisibilityWhere(context);
};

const getVisibleNotification = async (
  userId: string,
  notificationId: string,
) => {
  const visibilityWhere = await getVisibleNotificationWhere(userId);

  const notification = await prisma.notification.findFirst({
    where: {
      AND: [
        visibilityWhere,
        {
          id: notificationId,
          status: NotificationStatus.SENT,
          isDeleted: false,
        },
      ],
    },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      priority: true,
      status: true,
      schoolId: true,
      scheduledAt: true,
      sentAt: true,
      expiresAt: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.expiresAt && notification.expiresAt <= new Date()) {
    throw new ApiError(404, "Notification has expired");
  }

  return notification;
};

export const markNotificationAsRead = async (
  userId: string,
  notificationId: string,
) => {
  const notification = await getVisibleNotification(userId, notificationId);

  const read = await prisma.notificationRead.upsert({
    where: {
      notificationId_userId: {
        notificationId: notification.id,
        userId,
      },
    },
    create: {
      notificationId: notification.id,
      userId,
    },
    update: {
      readAt: new Date(),
    },
    select: {
      id: true,
      notificationId: true,
      userId: true,
      readAt: true,
    },
  });

  return {
    notificationId: notification.id,
    read: true,
    readAt: read.readAt,
  };
};

export const markNotificationAsUnread = async (
  userId: string,
  notificationId: string,
) => {
  await getVisibleNotification(userId, notificationId);

  await prisma.notificationRead.deleteMany({
    where: {
      notificationId,
      userId,
    },
  });

  return {
    notificationId,
    read: false,
  };
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const visibilityWhere = await getVisibleNotificationWhere(userId);

  const notifications = await prisma.notification.findMany({
    where: {
      AND: [
        visibilityWhere,
        {
          status: NotificationStatus.SENT,
          isDeleted: false,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!notifications.length) {
    return {
      markedCount: 0,
    };
  }

  const notificationIds = notifications.map((notification) => notification.id);

  const existingReads = await prisma.notificationRead.findMany({
    where: {
      userId,
      notificationId: {
        in: notificationIds,
      },
    },
    select: {
      notificationId: true,
    },
  });

  const existingIds = new Set(existingReads.map((read) => read.notificationId));

  const unreadIds = notificationIds.filter((id) => !existingIds.has(id));

  if (unreadIds.length) {
    await prisma.notificationRead.createMany({
      data: unreadIds.map((notificationId) => ({
        notificationId,
        userId,
      })),
      skipDuplicates: true,
    });
  }

  return {
    markedCount: unreadIds.length,
  };
};

export const bulkMarkNotificationsAsRead = async (
  userId: string,
  notificationIds: string[],
) => {
  if (!notificationIds.length) {
    throw new ApiError(400, "At least one notification ID is required");
  }

  const visibilityWhere = await getVisibleNotificationWhere(userId);

  const notifications = await prisma.notification.findMany({
    where: {
      AND: [
        visibilityWhere,
        {
          id: {
            in: notificationIds,
          },
          status: NotificationStatus.SENT,
          isDeleted: false,
        },
      ],
    },
    select: {
      id: true,
      expiresAt: true,
    },
  });

  const now = new Date();

  const validNotifications = notifications.filter(
    (notification) => !notification.expiresAt || notification.expiresAt > now,
  );

  if (!validNotifications.length) {
    throw new ApiError(404, "No accessible notifications found");
  }

  const validIds = validNotifications.map((notification) => notification.id);

  await prisma.notificationRead.createMany({
    data: validIds.map((notificationId) => ({
      notificationId,
      userId,
    })),
    skipDuplicates: true,
  });

  return {
    markedCount: validIds.length,
    notificationIds: validIds,
  };
};

export const getUnreadNotificationCount = async (userId: string) => {
  const visibilityWhere = await getVisibleNotificationWhere(userId);

  const now = new Date();

  const count = await prisma.notification.count({
    where: {
      AND: [
        visibilityWhere,
        {
          status: NotificationStatus.SENT,
          isDeleted: false,
          reads: {
            none: {
              userId,
            },
          },
          OR: [
            {
              expiresAt: null,
            },
            {
              expiresAt: {
                gt: now,
              },
            },
          ],
        },
      ],
    },
  });

  return {
    unreadCount: count,
  };
};

export const isNotificationRead = async (
  userId: string,
  notificationId: string,
) => {
  await getVisibleNotification(userId, notificationId);

  const read = await prisma.notificationRead.findUnique({
    where: {
      notificationId_userId: {
        notificationId,
        userId,
      },
    },
    select: {
      id: true,
      readAt: true,
    },
  });

  return {
    notificationId,
    read: Boolean(read),
    readAt: read?.readAt ?? null,
  };
};

export const getUserNotificationReadStatus = async (
  userId: string,
  notificationIds: string[],
) => {
  if (!notificationIds.length) {
    return [];
  }

  const visibilityWhere = await getVisibleNotificationWhere(userId);

  const visibleNotifications = await prisma.notification.findMany({
    where: {
      AND: [
        visibilityWhere,
        {
          id: {
            in: notificationIds,
          },
          status: NotificationStatus.SENT,
          isDeleted: false,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const visibleIds = visibleNotifications.map(
    (notification) => notification.id,
  );

  if (!visibleIds.length) {
    return [];
  }

  const reads = await prisma.notificationRead.findMany({
    where: {
      userId,
      notificationId: {
        in: visibleIds,
      },
    },
    select: {
      notificationId: true,
      readAt: true,
    },
  });

  const readMap = new Map(
    reads.map((read) => [read.notificationId, read.readAt]),
  );

  return visibleIds.map((notificationId) => ({
    notificationId,
    read: readMap.has(notificationId),
    readAt: readMap.get(notificationId) ?? null,
  }));
};
