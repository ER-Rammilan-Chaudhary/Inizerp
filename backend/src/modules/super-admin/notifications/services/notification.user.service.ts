import { NotificationStatus, Prisma, RoleEnum } from "@prisma/client";

import { prisma } from "../../../../config/prisma";
import { ApiError } from "../../../../utils/ApiError";
import {
  buildNotificationVisibilityWhere,
  NotificationUserContext,
} from "../helpers/notification.helper";
import { MyNotificationQueryDto } from "../dto/notifications.dto";

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
      role: true,
    },
  },
  audiences: {
    select: {
      id: true,
      targetType: true,
      role: true,
      schoolId: true,
      classId: true,
      sectionId: true,
      userId: true,
      studentId: true,
    },
  },
} satisfies Prisma.NotificationInclude;

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
    const enrollments = await prisma.enrollment.findMany({
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
    });

    const classIds = [
      ...new Set(enrollments.map((enrollment) => enrollment.classId)),
    ];

    const sectionIds = [
      ...new Set(
        enrollments
          .map((enrollment) => enrollment.sectionId)
          .filter((sectionId): sectionId is string => Boolean(sectionId)),
      ),
    ];

    if (classIds.length === 1) {
      context.classId = classIds[0];
    }

    if (sectionIds.length === 1) {
      context.sectionId = sectionIds[0];
    }
  }

  return context;
};

const buildMyNotificationWhere = async (
  userId: string,
): Promise<Prisma.NotificationWhereInput> => {
  const context = await getUserContext(userId);

  return buildNotificationVisibilityWhere(context);
};

const applyFilters = (
  where: Prisma.NotificationWhereInput,
  filters: MyNotificationQueryDto,
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

export const getMyNotifications = async (
  userId: string,
  filters: MyNotificationQueryDto,
) => {
  const visibilityWhere = await buildMyNotificationWhere(userId);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.NotificationWhereInput = {
    AND: [
      visibilityWhere,
      {
        status: NotificationStatus.SENT,
        isDeleted: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    ],
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

  const notificationIds = notifications.map((notification) => notification.id);

  const reads = notificationIds.length
    ? await prisma.notificationRead.findMany({
        where: {
          userId,
          notificationId: {
            in: notificationIds,
          },
        },
        select: {
          notificationId: true,
          readAt: true,
        },
      })
    : [];

  const readMap = new Map(
    reads.map((read) => [read.notificationId, read.readAt]),
  );

  return {
    notifications: notifications.map((notification) => ({
      ...notification,
      isRead: readMap.has(notification.id),
      readAt: readMap.get(notification.id) ?? null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMyNotificationById = async (
  userId: string,
  notificationId: string,
) => {
  const visibilityWhere = await buildMyNotificationWhere(userId);

  const notification = await prisma.notification.findFirst({
    where: {
      AND: [
        visibilityWhere,
        {
          id: notificationId,
          status: NotificationStatus.SENT,
          isDeleted: false,
          OR: [
            {
              expiresAt: null,
            },
            {
              expiresAt: {
                gt: new Date(),
              },
            },
          ],
        },
      ],
    },
    include: notificationInclude,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const read = await prisma.notificationRead.findUnique({
    where: {
      notificationId_userId: {
        notificationId,
        userId,
      },
    },
    select: {
      readAt: true,
    },
  });

  return {
    ...notification,
    isRead: Boolean(read),
    readAt: read?.readAt ?? null,
  };
};

export const getMyUnreadNotifications = async (userId: string, limit = 10) => {
  const visibilityWhere = await buildMyNotificationWhere(userId);

  const notifications = await prisma.notification.findMany({
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
                gt: new Date(),
              },
            },
          ],
        },
      ],
    },
    include: notificationInclude,
    orderBy: [
      {
        isPinned: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: limit,
  });

  return notifications;
};

export const getMyNotificationSummary = async (userId: string) => {
  const visibilityWhere = await buildMyNotificationWhere(userId);

  const baseWhere: Prisma.NotificationWhereInput = {
    AND: [
      visibilityWhere,
      {
        status: NotificationStatus.SENT,
        isDeleted: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    ],
  };

  const [total, unread, read] = await prisma.$transaction([
    prisma.notification.count({
      where: baseWhere,
    }),
    prisma.notification.count({
      where: {
        AND: [
          baseWhere,
          {
            reads: {
              none: {
                userId,
              },
            },
          },
        ],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [
          baseWhere,
          {
            reads: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    }),
  ]);

  return {
    total,
    read,
    unread,
  };
};
