import {
  NotificationPriority,
  NotificationStatus,
  NotificationTargetType,
  NotificationType,
  Prisma,
  RoleEnum,
} from "@prisma/client";

import { prisma } from "../../../../config/prisma";
import { ApiError } from "../../../../utils/ApiError";
import {
  CreateNotificationDto,
  NotificationAudienceDto,
  NotificationQueryDto,
  UpdateNotificationDto,
} from "../dto/notifications.dto";

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

type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: typeof notificationInclude;
}>;

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

const validateManagementAccess = async (
  userId: string,
  notificationSchoolId: string | null,
) => {
  const user = await getUser(userId);

  if (user.role === RoleEnum.SUPER_ADMIN) {
    return user;
  }

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (
      !user.schoolId ||
      !notificationSchoolId ||
      user.schoolId !== notificationSchoolId
    ) {
      throw new ApiError(
        403,
        "You can only manage notifications for your school",
      );
    }

    return user;
  }

  throw new ApiError(403, "You are not allowed to manage notifications");
};

const validateAudienceStructure = (audience: NotificationAudienceDto) => {
  const has = (value?: string | null) =>
    value !== undefined && value !== null && value !== "";

  switch (audience.targetType) {
    case NotificationTargetType.GLOBAL:
      if (
        has(audience.schoolId) ||
        has(audience.role) ||
        has(audience.classId) ||
        has(audience.sectionId) ||
        has(audience.userId) ||
        has(audience.studentId)
      ) {
        throw new ApiError(
          400,
          "GLOBAL audience cannot contain target identifiers",
        );
      }
      break;

    case NotificationTargetType.SCHOOL:
      if (!has(audience.schoolId)) {
        throw new ApiError(400, "schoolId is required for SCHOOL audience");
      }
      break;

    case NotificationTargetType.ROLE:
      if (!has(audience.schoolId) || !has(audience.role)) {
        throw new ApiError(
          400,
          "schoolId and role are required for ROLE audience",
        );
      }
      break;

    case NotificationTargetType.CLASS:
      if (!has(audience.schoolId) || !has(audience.classId)) {
        throw new ApiError(
          400,
          "schoolId and classId are required for CLASS audience",
        );
      }
      break;

    case NotificationTargetType.SECTION:
      if (!has(audience.schoolId) || !has(audience.sectionId)) {
        throw new ApiError(
          400,
          "schoolId and sectionId are required for SECTION audience",
        );
      }
      break;

    case NotificationTargetType.USER:
      if (!has(audience.schoolId) || !has(audience.userId)) {
        throw new ApiError(
          400,
          "schoolId and userId are required for USER audience",
        );
      }
      break;

    case NotificationTargetType.STUDENT:
      if (!has(audience.schoolId) || !has(audience.studentId)) {
        throw new ApiError(
          400,
          "schoolId and studentId are required for STUDENT audience",
        );
      }
      break;

    default:
      throw new ApiError(400, "Invalid notification audience");
  }
};

const validateAudienceSchool = async (
  audience: NotificationAudienceDto,
  notificationSchoolId: string | null,
) => {
  if (audience.targetType === NotificationTargetType.GLOBAL) {
    return;
  }

  if (!notificationSchoolId) {
    throw new ApiError(
      400,
      "schoolId is required for school-specific notifications",
    );
  }

  if (audience.schoolId !== notificationSchoolId) {
    throw new ApiError(
      403,
      "Audience school does not match notification school",
    );
  }
};

const validateAudienceTargets = async (
  audiences: NotificationAudienceDto[],
  notificationSchoolId: string | null,
) => {
  const schoolIds = new Set<string>();

  for (const audience of audiences) {
    validateAudienceStructure(audience);

    await validateAudienceSchool(audience, notificationSchoolId);

    if (audience.schoolId) {
      schoolIds.add(audience.schoolId);
    }

    if (audience.targetType === NotificationTargetType.SCHOOL) {
      const school = await prisma.school.findFirst({
        where: {
          id: audience.schoolId!,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!school) {
        throw new ApiError(404, "School not found");
      }
    }

    if (audience.targetType === NotificationTargetType.ROLE) {
      if (audience.role === RoleEnum.SUPER_ADMIN) {
        throw new ApiError(
          400,
          "SUPER_ADMIN cannot be targeted through a school ROLE audience",
        );
      }
    }

    if (audience.targetType === NotificationTargetType.USER) {
      const user = await prisma.user.findFirst({
        where: {
          id: audience.userId!,
          schoolId: audience.schoolId!,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new ApiError(404, "Target user not found in this school");
      }
    }

    if (audience.targetType === NotificationTargetType.STUDENT) {
      const student = await prisma.student.findFirst({
        where: {
          id: audience.studentId!,
          schoolId: audience.schoolId!,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!student) {
        throw new ApiError(404, "Target student not found in this school");
      }
    }

    if (audience.targetType === NotificationTargetType.CLASS) {
      const classRecord = await prisma.class.findFirst({
        where: {
          id: audience.classId!,
          schoolId: audience.schoolId!,
        },
        select: {
          id: true,
        },
      });

      if (!classRecord) {
        throw new ApiError(404, "Target class not found in this school");
      }
    }

    if (audience.targetType === NotificationTargetType.SECTION) {
      const section = await prisma.section.findFirst({
        where: {
          id: audience.sectionId!,
          schoolId: audience.schoolId!,
        },
        select: {
          id: true,
          classId: true,
        },
      });

      if (!section) {
        throw new ApiError(404, "Target section not found in this school");
      }

      if (audience.classId && audience.classId !== section.classId) {
        throw new ApiError(
          400,
          "Section does not belong to the selected class",
        );
      }
    }
  }

  if (schoolIds.size > 1) {
    throw new ApiError(400, "A notification can target only one school");
  }

  const hasGlobal = audiences.some(
    (audience) => audience.targetType === NotificationTargetType.GLOBAL,
  );

  if (hasGlobal && audiences.length > 1) {
    throw new ApiError(
      400,
      "GLOBAL notification cannot be combined with other audiences",
    );
  }

  if (hasGlobal && notificationSchoolId !== null) {
    throw new ApiError(400, "GLOBAL notification must not have schoolId");
  }
};

const validateNotificationDates = (
  scheduledAt?: Date | null,
  expiresAt?: Date | null,
  status?: NotificationStatus,
) => {
  const now = new Date();

  if (scheduledAt && expiresAt && expiresAt <= scheduledAt) {
    throw new ApiError(400, "expiresAt must be after scheduledAt");
  }

  if (status === NotificationStatus.SCHEDULED && !scheduledAt) {
    throw new ApiError(
      400,
      "scheduledAt is required for scheduled notifications",
    );
  }

  if (
    status === NotificationStatus.SCHEDULED &&
    scheduledAt &&
    scheduledAt <= now
  ) {
    throw new ApiError(400, "scheduledAt must be in the future");
  }

  if (status === NotificationStatus.SENT && scheduledAt && scheduledAt > now) {
    throw new ApiError(
      400,
      "A SENT notification cannot have a future scheduledAt",
    );
  }
};

const getNotificationByIdInternal = async (notificationId: string) => {
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

  return notification;
};

const mapNotification = (notification: NotificationWithRelations) => {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    priority: notification.priority,
    status: notification.status,
    schoolId: notification.schoolId,
    scheduledAt: notification.scheduledAt,
    sentAt: notification.sentAt,
    expiresAt: notification.expiresAt,
    isPinned: notification.isPinned,
    isDeleted: notification.isDeleted,
    deletedAt: notification.deletedAt,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
    school: notification.school,
    createdBy: notification.createdBy,
    audiences: notification.audiences,
    stats: {
      readCount: notification._count.reads,
      audienceCount: notification._count.audiences,
    },
  };
};

export const createNotification = async (
  userId: string,
  data: CreateNotificationDto,
) => {
  const user = await getUser(userId);

  if (data.status === NotificationStatus.SCHEDULED && !data.scheduledAt) {
    throw new ApiError(
      400,
      "scheduledAt is required for scheduled notifications",
    );
  }

  validateNotificationDates(data.scheduledAt, data.expiresAt, data.status);

  if (!data.audiences?.length) {
    throw new ApiError(400, "At least one audience is required");
  }

  let notificationSchoolId = data.schoolId ?? null;

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (!user.schoolId) {
      throw new ApiError(403, "School Admin is not assigned to a school");
    }

    notificationSchoolId = user.schoolId;
  }

  if (
    user.role !== RoleEnum.SUPER_ADMIN &&
    user.role !== RoleEnum.SCHOOL_ADMIN
  ) {
    throw new ApiError(403, "You are not allowed to create notifications");
  }

  const hasGlobal = data.audiences.some(
    (audience) => audience.targetType === NotificationTargetType.GLOBAL,
  );

  if (user.role === RoleEnum.SCHOOL_ADMIN && hasGlobal) {
    throw new ApiError(403, "School Admin cannot create global notifications");
  }

  if (hasGlobal) {
    notificationSchoolId = null;
  }

  if (!hasGlobal && !notificationSchoolId) {
    throw new ApiError(400, "schoolId is required for school notifications");
  }

  await validateAudienceTargets(data.audiences, notificationSchoolId);

  const status = data.status ?? NotificationStatus.DRAFT;

  const sentAt = status === NotificationStatus.SENT ? new Date() : null;

  const notification = await prisma.$transaction(async (tx) => {
    const created = await tx.notification.create({
      data: {
        title: data.title.trim(),
        message: data.message.trim(),
        type: data.type,
        priority: data.priority ?? NotificationPriority.NORMAL,
        status,
        createdById: userId,
        schoolId: notificationSchoolId,
        scheduledAt: data.scheduledAt ?? null,
        sentAt,
        expiresAt: data.expiresAt ?? null,
        isPinned: data.isPinned ?? false,
        audiences: {
          create: data.audiences.map((audience) => ({
            targetType: audience.targetType,
            schoolId: audience.schoolId ?? null,
            role: audience.role ?? null,
            classId: audience.classId ?? null,
            sectionId: audience.sectionId ?? null,
            userId: audience.userId ?? null,
            studentId: audience.studentId ?? null,
          })),
        },
      },
      include: notificationInclude,
    });

    return created;
  });

  return mapNotification(notification);
};

export const getNotifications = async (
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

  const where: Prisma.NotificationWhereInput = {
    isDeleted: false,
  };

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (!user.schoolId) {
      throw new ApiError(403, "School Admin is not assigned to a school");
    }

    where.schoolId = user.schoolId;
  }

  if (user.role === RoleEnum.SUPER_ADMIN && filters.schoolId) {
    where.schoolId = filters.schoolId;
  }

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

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      include: notificationInclude,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where,
    }),
  ]);

  return {
    notifications: notifications.map(mapNotification),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSchoolNotifications = async (
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

  return getNotifications(userId, {
    ...filters,
    schoolId,
  });
};

export const getNotificationById = async (
  userId: string,
  notificationId: string,
) => {
  const notification = await getNotificationByIdInternal(notificationId);

  await validateManagementAccess(userId, notification.schoolId);

  return mapNotification(notification);
};

export const updateNotification = async (
  userId: string,
  notificationId: string,
  data: UpdateNotificationDto,
) => {
  const existing = await getNotificationByIdInternal(notificationId);

  const user = await validateManagementAccess(userId, existing.schoolId);

  const nextStatus = data.status ?? existing.status;

  const nextScheduledAt =
    data.scheduledAt !== undefined ? data.scheduledAt : existing.scheduledAt;

  const nextExpiresAt =
    data.expiresAt !== undefined ? data.expiresAt : existing.expiresAt;

  validateNotificationDates(nextScheduledAt, nextExpiresAt, nextStatus);

  const nextAudiences =
    data.audiences ??
    existing.audiences.map((audience) => ({
      targetType: audience.targetType,
      schoolId: audience.schoolId,
      role: audience.role,
      classId: audience.classId,
      sectionId: audience.sectionId,
      userId: audience.userId,
      studentId: audience.studentId,
    }));

  await validateAudienceTargets(nextAudiences, existing.schoolId);

  if (
    user.role === RoleEnum.SCHOOL_ADMIN &&
    existing.schoolId !== user.schoolId
  ) {
    throw new ApiError(403, "You can only update your school's notifications");
  }

  const updateData: Prisma.NotificationUpdateInput = {
    ...(data.title !== undefined && {
      title: data.title.trim(),
    }),
    ...(data.message !== undefined && {
      message: data.message.trim(),
    }),
    ...(data.type !== undefined && {
      type: data.type,
    }),
    ...(data.priority !== undefined && {
      priority: data.priority,
    }),
    ...(data.scheduledAt !== undefined && {
      scheduledAt: data.scheduledAt,
    }),
    ...(data.expiresAt !== undefined && {
      expiresAt: data.expiresAt,
    }),
    ...(data.status !== undefined && {
      status: data.status,
    }),
    ...(data.isPinned !== undefined && {
      isPinned: data.isPinned,
    }),
  };

  if (
    nextStatus === NotificationStatus.SENT &&
    existing.status !== NotificationStatus.SENT
  ) {
    updateData.sentAt = new Date();
  }

  const notification = await prisma.$transaction(async (tx) => {
    if (data.audiences !== undefined) {
      await tx.notificationAudience.deleteMany({
        where: {
          notificationId,
        },
      });

      updateData.audiences = {
        create: data.audiences.map((audience) => ({
          targetType: audience.targetType,
          schoolId: audience.schoolId ?? null,
          role: audience.role ?? null,
          classId: audience.classId ?? null,
          sectionId: audience.sectionId ?? null,
          userId: audience.userId ?? null,
          studentId: audience.studentId ?? null,
        })),
      };
    }

    return tx.notification.update({
      where: {
        id: notificationId,
      },
      data: updateData,
      include: notificationInclude,
    });
  });

  return mapNotification(notification);
};

export const deleteNotification = async (
  userId: string,
  notificationId: string,
) => {
  const existing = await getNotificationByIdInternal(notificationId);

  await validateManagementAccess(userId, existing.schoolId);

  await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    id: notificationId,
    message: "Notification deleted successfully",
  };
};

export const bulkDeleteNotifications = async (
  userId: string,
  notificationIds: string[],
) => {
  const user = await getUser(userId);

  if (
    user.role !== RoleEnum.SUPER_ADMIN &&
    user.role !== RoleEnum.SCHOOL_ADMIN
  ) {
    throw new ApiError(403, "You are not allowed to delete notifications");
  }

  const where: Prisma.NotificationWhereInput = {
    id: {
      in: notificationIds,
    },
    isDeleted: false,
  };

  if (user.role === RoleEnum.SCHOOL_ADMIN) {
    if (!user.schoolId) {
      throw new ApiError(403, "School Admin is not assigned to a school");
    }

    where.schoolId = user.schoolId;
  }

  const notifications = await prisma.notification.findMany({
    where,
    select: {
      id: true,
    },
  });

  if (notifications.length === 0) {
    throw new ApiError(404, "No accessible notifications found");
  }

  const ids = notifications.map((notification) => notification.id);

  await prisma.notification.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    deletedCount: ids.length,
    notificationIds: ids,
  };
};
