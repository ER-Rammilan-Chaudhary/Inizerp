import { RoleEnum } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { JwtPayload } from "../../../utils/jwt";
import { ApiError } from "../../../utils/ApiError";
import { getFileUrl } from "../../../utils/file-url";
import {
  EXPIRING_SUBSCRIPTIONS_DAYS,
  EXPIRING_SUBSCRIPTIONS_LIMIT,
  RECENT_ACTIVITIES_LIMIT,
  RECENT_NOTIFICATIONS_LIMIT,
  RECENT_SCHOOLS_LIMIT,
  TOP_SCHOOLS_LIMIT,
} from "./dashboard.constants";

const ensureSuperAdmin = (user: JwtPayload) => {
  if (user.role !== RoleEnum.SUPER_ADMIN) {
    throw new ApiError(403, "Only Super Admin can access this dashboard");
  }
};

const formatMonthlyGrowth = (
  dates: (Date | null)[],
): { month: string; count: number }[] => {
  const growthMap = new Map<string, number>();

  dates.forEach((date) => {
    if (!date) {
      return;
    }

    const month = date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    growthMap.set(month, (growthMap.get(month) ?? 0) + 1);
  });

  return Array.from(growthMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));
};

export const getDashboardStats = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const [
    totalSchools,
    activeSchools,
    inactiveSchools,
    trialSchools,
    paidSchools,
    suspendedSchools,
    totalStudents,
    totalTeachers,
    totalParents,
    totalUsers,
    totalPlans,
    activeSubscriptions,
    expiredSubscriptions,
    cancelledSubscriptions,
    trialSubscriptions,
    suspendedSubscriptions,
    totalNotifications,
    unreadNotifications,
    revenueStats,
    growthStats,
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
    prisma.school.count({
      where: {
        isDeleted: false,
        isActive: false,
      },
    }),
    prisma.school.count({
      where: {
        isDeleted: false,
        status: "TRIAL",
      },
    }),
    prisma.school.count({
      where: {
        isDeleted: false,
        status: "ACTIVE",
      },
    }),
    prisma.school.count({
      where: {
        isDeleted: false,
        status: "SUSPENDED",
      },
    }),
    prisma.student.count({
      where: {
        isDeleted: false,
      },
    }),
    prisma.teacher.count(),

    prisma.parent.count(),

    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),
    prisma.subscriptionPlan.count({
      where: {
        isActive: true,
      },
    }),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "EXPIRED",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "CANCELLED",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "TRIAL",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "SUSPENDED",
      },
    }),
    prisma.notification.count(),
    prisma.notification.count({
      where: {
        reads: {
          none: {
            userId: user.userId,
          },
        },
      },
    }),
    getRevenueStats(),
    getPlatformGrowth(),
  ]);

  return {
    schools: {
      total: totalSchools,
      active: activeSchools,
      inactive: inactiveSchools,
      trial: trialSchools,
      paid: paidSchools,
      suspended: suspendedSchools,
    },
    students: totalStudents,
    teachers: totalTeachers,
    parents: totalParents,
    users: totalUsers,
    plans: {
      total: totalPlans,
    },
    subscriptions: {
      total:
        activeSubscriptions +
        expiredSubscriptions +
        cancelledSubscriptions +
        trialSubscriptions +
        suspendedSubscriptions,
      active: activeSubscriptions,
      trial: trialSubscriptions,
      expired: expiredSubscriptions,
      cancelled: cancelledSubscriptions,
      suspended: suspendedSubscriptions,
    },
    notifications: {
      total: totalNotifications,
      unread: unreadNotifications,
    },
    revenue: {
      total: revenueStats.totalRevenue,
      monthly: revenueStats.revenue,
    },
    growth: growthStats,
  };
};

export const getDashboardCharts = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const [schools, students, teachers] = await Promise.all([
    prisma.school.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.student.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        admissionDate: true,
      },
      orderBy: {
        admissionDate: "asc",
      },
    }),

    prisma.teacher.findMany({
      select: {
        joiningDate: true,
      },
      orderBy: {
        joiningDate: "asc",
      },
    }),
  ]);

  return {
    schoolGrowth: formatMonthlyGrowth(
      schools.map((school) => school.createdAt),
    ),
    studentGrowth: formatMonthlyGrowth(
      students.map((student) => student.admissionDate),
    ),
    teacherGrowth: formatMonthlyGrowth(
      teachers.map((teacher) => teacher.joiningDate),
    ),
  };
};

export const getRecentSchools = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const schools = await prisma.school.findMany({
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
      _count: {
        select: {
          students: true,
          teachers: true,
          parents: true,
          users: true,
        },
      },
    },
  });

  return schools.map((school) => ({
    id: school.id,
    code: school.code,
    name: school.name,
    slug: school.slug,
    logo: getFileUrl(school.logo),
    isVerified: school.isVerified,
    isActive: school.isActive,
    status: school.status,
    createdAt: school.createdAt,
    students: school._count.students,
    teachers: school._count.teachers,
    parents: school._count.parents,
    users: school._count.users,
  }));
};

export const getRecentNotifications = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const notifications = await prisma.notification.findMany({
    take: RECENT_NOTIFICATIONS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      createdAt: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return notifications;
};

export const getRevenueStats = async () => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      finalAmount: true,
      startDate: true,
    },
  });

  const currentYear = new Date().getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenue = months.map((month) => ({
    month,
    revenue: 0,
  }));

  subscriptions.forEach((subscription) => {
    const date = new Date(subscription.startDate);

    if (date.getFullYear() !== currentYear) {
      return;
    }

    revenue[date.getMonth()].revenue += Number(subscription.finalAmount);
  });

  const totalRevenue = subscriptions.reduce(
    (sum, subscription) => sum + Number(subscription.finalAmount),
    0,
  );

  return {
    totalRevenue,
    revenue,
  };
};

export const getTopSchools = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const schools = await prisma.school.findMany({
    where: {
      isDeleted: false,
      isActive: true,
    },
    take: TOP_SCHOOLS_LIMIT,
    orderBy: {
      students: {
        _count: "desc",
      },
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
      _count: {
        select: {
          students: true,
          teachers: true,
          parents: true,
          users: true,
          subscriptions: true,
        },
      },
      subscriptions: {
        where: {
          status: "ACTIVE",
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          finalAmount: true,
          startDate: true,
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

  return schools.map((school) => {
    const subscription = school.subscriptions[0] ?? null;

    const daysLeft = subscription
      ? Math.max(
          0,
          Math.ceil(
            (subscription.endDate.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

    return {
      id: school.id,
      code: school.code,
      name: school.name,
      slug: school.slug,
      logo: getFileUrl(school.logo),
      isVerified: school.isVerified,
      isActive: school.isActive,
      status: school.status,
      createdAt: school.createdAt,
      students: school._count.students,
      teachers: school._count.teachers,
      parents: school._count.parents,
      users: school._count.users,
      subscription: subscription
        ? {
            planId: subscription.plan.id,
            plan: subscription.plan.name,
            subscriptionAmount: Number(subscription.finalAmount),
            startDate: subscription.startDate,
            subscriptionExpiresAt: subscription.endDate,
            daysLeft,
          }
        : null,
    };
  });
};

export const getRecentActivities = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const activities = await prisma.auditLog.findMany({
    take: RECENT_ACTIVITIES_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      ipAddress: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatar: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  return activities.map((activity) => ({
    id: activity.id,
    action: activity.action,
    entity: activity.entity,
    entityId: activity.entityId,
    ipAddress: activity.ipAddress,
    createdAt: activity.createdAt,
    user: activity.user
      ? {
          id: activity.user.id,
          name: activity.user.fullName,
          email: activity.user.email,
          avatar: getFileUrl(activity.user.avatar),
        }
      : null,
    school: activity.school
      ? {
          id: activity.school.id,
          name: activity.school.name,
          logo: getFileUrl(activity.school.logo),
        }
      : null,
  }));
};

export const getSubscriptionOverview = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const [total, trial, active, expired, cancelled, suspended] =
    await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({
        where: {
          status: "TRIAL",
        },
      }),
      prisma.subscription.count({
        where: {
          status: "ACTIVE",
        },
      }),
      prisma.subscription.count({
        where: {
          status: "EXPIRED",
        },
      }),
      prisma.subscription.count({
        where: {
          status: "CANCELLED",
        },
      }),
      prisma.subscription.count({
        where: {
          status: "SUSPENDED",
        },
      }),
    ]);

  return {
    total,
    trial,
    active,
    expired,
    cancelled,
    suspended,
  };
};

export const getPlatformGrowth = async (user?: JwtPayload) => {
  if (user) {
    ensureSuperAdmin(user);
  }

  const [schools, students, teachers] = await Promise.all([
    prisma.school.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.student.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        admissionDate: true,
      },
      orderBy: {
        admissionDate: "asc",
      },
    }),

    prisma.teacher.findMany({
      select: {
        joiningDate: true,
      },
      orderBy: {
        joiningDate: "asc",
      },
    }),
  ]);

  return {
    schools: formatMonthlyGrowth(schools.map((school) => school.createdAt)),
    students: formatMonthlyGrowth(
      students.map((student) => student.admissionDate),
    ),
    teachers: formatMonthlyGrowth(
      teachers.map((teacher) => teacher.joiningDate),
    ),
  };
};

export const getExpiringSubscriptions = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const today = new Date();

  const expiryDate = new Date(today);
  expiryDate.setDate(expiryDate.getDate() + EXPIRING_SUBSCRIPTIONS_DAYS);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      endDate: {
        gte: today,
        lte: expiryDate,
      },
    },
    take: EXPIRING_SUBSCRIPTIONS_LIMIT,
    orderBy: {
      endDate: "asc",
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      finalAmount: true,
      school: {
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          logo: true,
          status: true,
        },
      },
      plan: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return subscriptions.map((subscription) => ({
    id: subscription.id,
    plan: {
      id: subscription.plan.id,
      name: subscription.plan.name,
    },
    amount: Number(subscription.finalAmount),
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    daysLeft: Math.max(
      0,
      Math.ceil(
        (subscription.endDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    ),
    school: {
      id: subscription.school.id,
      code: subscription.school.code,
      name: subscription.school.name,
      slug: subscription.school.slug,
      status: subscription.school.status,
      logo: getFileUrl(subscription.school.logo),
    },
  }));
};

export const getSystemHealth = async (user: JwtPayload) => {
  ensureSuperAdmin(user);

  const [
    totalSchools,
    activeSchools,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    unreadNotifications,
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
    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),
    prisma.user.count({
      where: {
        isDeleted: false,
        status: "ACTIVE",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.notification.count({
      where: {
        reads: {
          none: {
            userId: user.userId,
          },
        },
      },
    }),
  ]);

  return {
    database: "HEALTHY",
    platform: "ONLINE",
    schools: {
      total: totalSchools,
      active: activeSchools,
      inactive: totalSchools - activeSchools,
    },
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
    },
    subscriptions: {
      active: activeSubscriptions,
    },
    notifications: {
      unread: unreadNotifications,
    },
    serverTime: new Date(),
  };
};
