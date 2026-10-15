import { prisma } from "../../../config/prisma";
import {
  RECENT_NOTIFICATIONS_LIMIT,
  RECENT_SCHOOLS_LIMIT,
} from "./analytics.constants";
import {
  NotificationStatus,
  NotificationTargetType,
  NotificationType,
  RoleEnum,
  SubscriptionStatus,
} from "@prisma/client";

const getYearRange = (year: number) => {
  return {
    gte: new Date(year, 0, 1),
    lt: new Date(year + 1, 0, 1),
  };
};

const getMonthlyCountGrowth = (items: { createdAt: Date }[]) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    count: 0,
  }));

  for (const item of items) {
    const month = item.createdAt.getMonth();

    if (month >= 0 && month < 12) {
      months[month].count += 1;
    }
  }

  return months;
};

export const getOverviewService = async () => {
  const [
    totalSchools,
    activeSchools,
    totalStudents,
    totalTeachers,
    totalParents,
    totalUsers,
    activeSubscriptions,
    expiredSubscriptions,
    totalNotifications,
    revenue,
  ] = await Promise.all([
    prisma.school.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.school.count({
      where: {
        isDeleted: false,
        isActive: true,
      },
    }),

    prisma.student.count(),

    prisma.teacher.count(),

    prisma.parent.count(),

    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.EXPIRED,
      },
    }),

    prisma.notification.count(),

    prisma.subscription.aggregate({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
      _sum: {
        finalAmount: true,
      },
    }),
  ]);

  return {
    totalSchools,
    activeSchools,
    totalStudents,
    totalTeachers,
    totalParents,
    totalUsers,
    activeSubscriptions,
    expiredSubscriptions,
    totalNotifications,
    totalRevenue: Number(revenue._sum.finalAmount ?? 0),
  };
};

export const getSubscriptionAnalyticsService = async () => {
  const [trial, active, expired, suspended, cancelled] = await Promise.all([
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.TRIAL,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.EXPIRED,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.SUSPENDED,
      },
    }),

    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.CANCELLED,
      },
    }),
  ]);

  return {
    trial,
    active,
    expired,
    suspended,
    cancelled,
  };
};

export const getRevenueService = async () => {
  const revenue = await prisma.subscription.aggregate({
    where: {
      status: SubscriptionStatus.ACTIVE,
    },
    _sum: {
      amount: true,
      discount: true,
      tax: true,
      finalAmount: true,
    },
  });

  return {
    amount: Number(revenue._sum.amount ?? 0),
    discount: Number(revenue._sum.discount ?? 0),
    tax: Number(revenue._sum.tax ?? 0),
    finalAmount: Number(revenue._sum.finalAmount ?? 0),
  };
};

export const getRecentSchoolsService = async () => {
  return prisma.school.findMany({
    where: {
      isDeleted: false,
    },
    take: RECENT_SCHOOLS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      logo: true,
      isVerified: true,
      isActive: true,
      status: true,
      createdAt: true,
      subscriptions: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          finalAmount: true,
          endDate: true,
          plan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getRecentNotificationsService = async () => {
  return prisma.notification.findMany({
    take: RECENT_NOTIFICATIONS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      message: true,
      scope: true,
      type: true,
      priority: true,
      status: true,
      createdAt: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
      _count: {
        select: {
          reads: true,
        },
      },
    },
  });
};

export const getSchoolGrowthService = async (
  year = new Date().getFullYear(),
) => {
  const schools = await prisma.school.findMany({
    where: {
      isDeleted: false,
      createdAt: getYearRange(year),
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return getMonthlyCountGrowth(schools);
};

export const getStudentGrowthService = async (
  year = new Date().getFullYear(),
) => {
  const students = await prisma.student.findMany({
    where: {
      createdAt: getYearRange(year),
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return getMonthlyCountGrowth(students);
};

export const getTeacherGrowthService = async (
  year = new Date().getFullYear(),
) => {
  const teachers = await prisma.teacher.findMany({
    where: {
      createdAt: getYearRange(year),
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return getMonthlyCountGrowth(teachers);
};

export const getUserGrowthService = async (year = new Date().getFullYear()) => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      createdAt: getYearRange(year),
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return getMonthlyCountGrowth(users);
};

export const getSubscriptionGrowthService = async (
  year = new Date().getFullYear(),
) => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      createdAt: getYearRange(year),
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return getMonthlyCountGrowth(subscriptions);
};

export const getNotificationAnalyticsService = async () => {
  const [
    total,
    draft,
    scheduled,
    sent,
    expired,
    cancelled,
    failed,
    global,
    school,
    role,
    classTarget,
    section,
    user,
    student,
    system,
    announcement,
    featureUpdate,
    maintenance,
    subscription,
    emergency,
    exam,
    fees,
    homework,
    attendance,
  ] = await Promise.all([
    prisma.notification.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.DRAFT,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.SCHEDULED,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.SENT,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.EXPIRED,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.CANCELLED,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        status: NotificationStatus.FAILED,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.GLOBAL,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.SCHOOL,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.ROLE,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.CLASS,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.SECTION,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.USER,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        audiences: {
          some: {
            targetType: NotificationTargetType.STUDENT,
          },
        },
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.SYSTEM,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.ANNOUNCEMENT,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.FEATURE_UPDATE,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.MAINTENANCE,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.SUBSCRIPTION,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.EMERGENCY,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.EXAM,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.FEES,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.HOMEWORK,
      },
    }),

    prisma.notification.count({
      where: {
        isDeleted: false,
        type: NotificationType.ATTENDANCE,
      },
    }),
  ]);

  return {
    total,
    statuses: {
      draft,
      scheduled,
      sent,
      expired,
      cancelled,
      failed,
    },
    targets: {
      global,
      school,
      role,
      class: classTarget,
      section,
      user,
      student,
    },
    types: {
      system,
      announcement,
      featureUpdate,
      maintenance,
      subscription,
      emergency,
      exam,
      fees,
      homework,
      attendance,
    },
  };
};

export const getSchoolAnalyticsService = async () => {
  const [total, active, inactive, verified, unverified, trial, paid] =
    await Promise.all([
      prisma.school.count({
        where: {
          isDeleted: false,
        },
      }),

      prisma.school.count({
        where: {
          isDeleted: false,
          isActive: true,
        },
      }),

      prisma.school.count({
        where: {
          isDeleted: false,
          isActive: false,
        },
      }),

      prisma.school.count({
        where: {
          isDeleted: false,
          isVerified: true,
        },
      }),

      prisma.school.count({
        where: {
          isDeleted: false,
          isVerified: false,
        },
      }),

      prisma.school.count({
        where: {
          status: "TRIAL",
        },
      }),

      prisma.school.count({
        where: {
          status: "ACTIVE",
        },
      }),
    ]);

  return {
    total,
    active,
    inactive,
    verified,
    unverified,
    trial,
    paid,
  };
};

export const getUserAnalyticsService = async () => {
  const [total, superAdmins, schoolAdmins, teachers, students, parents] =
    await Promise.all([
      prisma.user.count({
        where: {
          isDeleted: false,
        },
      }),

      prisma.user.count({
        where: {
          isDeleted: false,
          role: RoleEnum.SUPER_ADMIN,
        },
      }),

      prisma.user.count({
        where: {
          isDeleted: false,
          role: RoleEnum.SCHOOL_ADMIN,
        },
      }),

      prisma.user.count({
        where: {
          isDeleted: false,
          role: RoleEnum.TEACHER,
        },
      }),

      prisma.user.count({
        where: {
          isDeleted: false,
          role: RoleEnum.STUDENT,
        },
      }),

      prisma.user.count({
        where: {
          isDeleted: false,
          role: RoleEnum.PARENT,
        },
      }),
    ]);

  return {
    total,
    roles: {
      superAdmins,
      schoolAdmins,
      teachers,
      students,
      parents,
    },
  };
};

export const getMonthlyRevenueService = async (
  year = new Date().getFullYear(),
) => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      createdAt: getYearRange(year),
      status: SubscriptionStatus.ACTIVE,
    },
    select: {
      createdAt: true,
      finalAmount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    amount: 0,
  }));

  for (const item of subscriptions) {
    const month = item.createdAt.getMonth();

    if (month >= 0 && month < 12) {
      months[month].amount += Number(item.finalAmount ?? 0);
    }
  }

  return months;
};
