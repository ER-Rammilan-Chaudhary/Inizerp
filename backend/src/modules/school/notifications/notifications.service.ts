import {
  NotificationStatus,
  NotificationTargetType,
  Prisma,
  RoleEnum,
} from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface AudienceInput {
  targetType: NotificationTargetType;
  role?: RoleEnum | null;
  classId?: string | null;
  sectionId?: string | null;
  userId?: string | null;
  studentId?: string | null;
}

interface CreateNotificationInput {
  title: string;
  message: string;
  type: Prisma.NotificationCreateInput["type"];
  priority?: Prisma.NotificationCreateInput["priority"];
  status?: NotificationStatus;
  sendNow?: boolean;
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  isPinned?: boolean;
  audiences: AudienceInput[];
}

interface UpdateNotificationInput {
  title?: string;
  message?: string;
  type?: Prisma.NotificationUpdateInput["type"];
  priority?: Prisma.NotificationUpdateInput["priority"];
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  isPinned?: boolean;
  audiences?: AudienceInput[];
}

const notificationSelect = {
  id: true,
  title: true,
  message: true,
  type: true,
  priority: true,
  status: true,
  createdById: true,
  schoolId: true,
  scheduledAt: true,
  sentAt: true,
  expiresAt: true,
  isPinned: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,

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
      createdAt: true,
    },
  },

  _count: {
    select: {
      reads: true,
    },
  },
} as const;

const validateDates = (scheduledAt?: Date | null, expiresAt?: Date | null) => {
  if (scheduledAt && expiresAt && expiresAt < scheduledAt) {
    throw new ApiError(
      400,
      "Expiry date cannot be earlier than scheduled date",
    );
  }
};

const validateAudience = async (schoolId: string, audience: AudienceInput) => {
  switch (audience.targetType) {
    case NotificationTargetType.SCHOOL: {
      if (
        audience.role ||
        audience.classId ||
        audience.sectionId ||
        audience.userId ||
        audience.studentId
      ) {
        throw new ApiError(
          400,
          "SCHOOL audience cannot contain additional target fields",
        );
      }

      return;
    }

    case NotificationTargetType.ROLE: {
      if (!audience.role) {
        throw new ApiError(400, "Role is required for ROLE audience");
      }

      if (
        audience.classId ||
        audience.sectionId ||
        audience.userId ||
        audience.studentId
      ) {
        throw new ApiError(
          400,
          "ROLE audience cannot contain class, section, user or student",
        );
      }

      if (audience.role === RoleEnum.SUPER_ADMIN) {
        throw new ApiError(
          400,
          "SUPER_ADMIN cannot be selected as a school notification audience",
        );
      }

      return;
    }

    case NotificationTargetType.CLASS: {
      if (!audience.classId) {
        throw new ApiError(400, "Class ID is required for CLASS audience");
      }

      if (
        audience.role ||
        audience.sectionId ||
        audience.userId ||
        audience.studentId
      ) {
        throw new ApiError(
          400,
          "CLASS audience cannot contain role, section, user or student",
        );
      }

      const classRecord = await prisma.class.findFirst({
        where: {
          id: audience.classId,
          schoolId,
        },
        select: {
          id: true,
        },
      });

      if (!classRecord) {
        throw new ApiError(404, "Class not found");
      }

      return;
    }

    case NotificationTargetType.SECTION: {
      if (!audience.sectionId) {
        throw new ApiError(400, "Section ID is required for SECTION audience");
      }

      if (
        audience.role ||
        audience.classId ||
        audience.userId ||
        audience.studentId
      ) {
        throw new ApiError(
          400,
          "SECTION audience cannot contain role, class, user or student",
        );
      }

      const section = await prisma.section.findFirst({
        where: {
          id: audience.sectionId,
          schoolId,
        },
        select: {
          id: true,
          classId: true,
        },
      });

      if (!section) {
        throw new ApiError(404, "Section not found");
      }

      return;
    }

    case NotificationTargetType.USER: {
      if (!audience.userId) {
        throw new ApiError(400, "User ID is required for USER audience");
      }

      if (
        audience.role ||
        audience.classId ||
        audience.sectionId ||
        audience.studentId
      ) {
        throw new ApiError(
          400,
          "USER audience cannot contain role, class, section or student",
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: audience.userId,
          schoolId,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return;
    }

    case NotificationTargetType.STUDENT: {
      if (!audience.studentId) {
        throw new ApiError(400, "Student ID is required for STUDENT audience");
      }

      if (
        audience.role ||
        audience.classId ||
        audience.sectionId ||
        audience.userId
      ) {
        throw new ApiError(
          400,
          "STUDENT audience cannot contain role, class, section or user",
        );
      }

      const student = await prisma.student.findFirst({
        where: {
          id: audience.studentId,
          schoolId,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!student) {
        throw new ApiError(404, "Student not found");
      }

      return;
    }

    default:
      throw new ApiError(400, "Invalid notification audience");
  }
};

const validateAudiences = async (
  schoolId: string,
  audiences: AudienceInput[],
) => {
  if (!audiences.length) {
    throw new ApiError(400, "At least one notification audience is required");
  }

  for (const audience of audiences) {
    await validateAudience(schoolId, audience);
  }
};

const buildAudienceCreateData = (
  schoolId: string,
  audience: AudienceInput,
): Prisma.NotificationAudienceCreateWithoutNotificationInput => {
  return {
    targetType: audience.targetType,
    school: {
      connect: {
        id: schoolId,
      },
    },
    ...(audience.role
      ? {
          role: audience.role,
        }
      : {}),
    ...(audience.classId
      ? {
          class: {
            connect: {
              id: audience.classId,
            },
          },
        }
      : {}),
    ...(audience.sectionId
      ? {
          section: {
            connect: {
              id: audience.sectionId,
            },
          },
        }
      : {}),
    ...(audience.userId
      ? {
          user: {
            connect: {
              id: audience.userId,
            },
          },
        }
      : {}),
    ...(audience.studentId
      ? {
          student: {
            connect: {
              id: audience.studentId,
            },
          },
        }
      : {}),
  };
};

export const getNotifications = async (schoolId: string) => {
  return prisma.notification.findMany({
    where: {
      schoolId,
      isDeleted: false,
    },
    orderBy: [
      {
        isPinned: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: notificationSelect,
  });
};

export const getNotificationById = async (
  schoolId: string,
  notificationId: string,
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      schoolId,
      isDeleted: false,
    },
    select: notificationSelect,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

export const createNotification = async (
  schoolId: string,
  userId: string,
  data: CreateNotificationInput,
) => {
  validateDates(data.scheduledAt, data.expiresAt);

  await validateAudiences(schoolId, data.audiences);

  let status: NotificationStatus = NotificationStatus.SENT;
  if (data.scheduledAt && data.scheduledAt > new Date()) {
    status = NotificationStatus.SCHEDULED;
  } else if (data.status) {
    status = data.status;
  } else if (data.sendNow === false) {
    status = NotificationStatus.DRAFT;
  }

  const sentAt = status === NotificationStatus.SENT ? new Date() : null;

  const notification = await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority ?? "NORMAL",
      status,
      sentAt,
      createdBy: {
        connect: {
          id: userId,
        },
      },
      school: {
        connect: {
          id: schoolId,
        },
      },
      scheduledAt: data.scheduledAt ?? null,
      expiresAt: data.expiresAt ?? null,
      isPinned: data.isPinned ?? false,

      audiences: {
        create: data.audiences.map((audience) =>
          buildAudienceCreateData(schoolId, audience),
        ),
      },
    },
    select: notificationSelect,
  });

  return notification;
};

export const updateNotification = async (
  schoolId: string,
  notificationId: string,
  data: UpdateNotificationInput,
) => {
  const existing = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      status: true,
      scheduledAt: true,
      expiresAt: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Notification not found");
  }

  if (
    existing.status === NotificationStatus.SENT ||
    existing.status === NotificationStatus.CANCELLED
  ) {
    throw new ApiError(
      400,
      "Sent or cancelled notifications cannot be updated",
    );
  }

  const scheduledAt =
    data.scheduledAt !== undefined ? data.scheduledAt : existing.scheduledAt;

  const expiresAt =
    data.expiresAt !== undefined ? data.expiresAt : existing.expiresAt;

  validateDates(scheduledAt, expiresAt);

  if (data.audiences) {
    await validateAudiences(schoolId, data.audiences);
  }

  let status = existing.status;

  if (scheduledAt && scheduledAt > new Date()) {
    status = NotificationStatus.SCHEDULED;
  } else if (existing.status === NotificationStatus.SCHEDULED) {
    status = NotificationStatus.DRAFT;
  }

  const notification = await prisma.$transaction(async (tx) => {
    if (data.audiences) {
      await tx.notificationAudience.deleteMany({
        where: {
          notificationId,
        },
      });
    }

    return tx.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        ...(data.title !== undefined
          ? {
              title: data.title,
            }
          : {}),

        ...(data.message !== undefined
          ? {
              message: data.message,
            }
          : {}),

        ...(data.type !== undefined
          ? {
              type: data.type,
            }
          : {}),

        ...(data.priority !== undefined
          ? {
              priority: data.priority,
            }
          : {}),

        ...(data.scheduledAt !== undefined
          ? {
              scheduledAt: data.scheduledAt,
            }
          : {}),

        ...(data.expiresAt !== undefined
          ? {
              expiresAt: data.expiresAt,
            }
          : {}),

        ...(data.isPinned !== undefined
          ? {
              isPinned: data.isPinned,
            }
          : {}),

        status,

        ...(data.audiences
          ? {
              audiences: {
                create: data.audiences.map((audience) =>
                  buildAudienceCreateData(schoolId, audience),
                ),
              },
            }
          : {}),
      },
      select: notificationSelect,
    });
  });

  return notification;
};

export const sendNotification = async (
  schoolId: string,
  notificationId: string,
) => {
  const existing = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      audiences: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, "Notification not found");
  }

  if (existing.status === NotificationStatus.SENT) {
    throw new ApiError(400, "Notification is already sent");
  }

  if (existing.status === NotificationStatus.CANCELLED) {
    throw new ApiError(400, "Cancelled notification cannot be sent");
  }

  if (!existing.audiences.length) {
    throw new ApiError(400, "Notification must have at least one audience");
  }

  if (existing.expiresAt && existing.expiresAt <= new Date()) {
    throw new ApiError(400, "Expired notification cannot be sent");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
      scheduledAt: null,
    },
    select: notificationSelect,
  });
};

export const cancelNotification = async (
  schoolId: string,
  notificationId: string,
) => {
  const existing = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Notification not found");
  }

  if (existing.status === NotificationStatus.SENT) {
    throw new ApiError(400, "Sent notification cannot be cancelled");
  }

  if (existing.status === NotificationStatus.CANCELLED) {
    throw new ApiError(400, "Notification is already cancelled");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      status: NotificationStatus.CANCELLED,
    },
    select: notificationSelect,
  });
};

export const deleteNotification = async (
  schoolId: string,
  notificationId: string,
) => {
  const existing = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Notification not found");
  }

  if (existing.status === NotificationStatus.SENT) {
    throw new ApiError(400, "Sent notification cannot be deleted");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
    select: {
      id: true,
      isDeleted: true,
      deletedAt: true,
    },
  });
};
