import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  module?: string;
  entity?: string;
  schoolId?: string;
  userId?: string;
  from?: string;
  to?: string;
}

interface CreateAuditLogData {
  userId?: string;
  schoolId?: string;
  action: string;
  module: string;
  entity: string;
  entityId?: string;
  meta?: unknown;
  beforeData?: unknown;
  afterData?: unknown;
  browser?: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
}

const MAX_LIMIT = 100;

const parseDate = (value: string, endOfDay = false): Date => {
  const date = new Date(
    `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`,
  );

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `Invalid date: ${value}`);
  }

  return date;
};

const buildAuditLogWhere = (
  query: AuditLogQuery,
): Prisma.AuditLogWhereInput => {
  const { search, action, module, entity, schoolId, userId, from, to } = query;

  const where: Prisma.AuditLogWhereInput = {};

  if (search?.trim()) {
    const value = search.trim();

    where.OR = [
      {
        action: {
          contains: value,
          mode: "insensitive",
        },
      },
      {
        module: {
          contains: value,
          mode: "insensitive",
        },
      },
      {
        entity: {
          contains: value,
          mode: "insensitive",
        },
      },
      {
        entityId: {
          contains: value,
          mode: "insensitive",
        },
      },
    ];
  }

  if (action) {
    where.action = action;
  }

  if (module) {
    where.module = module;
  }

  if (entity) {
    where.entity = entity;
  }

  if (schoolId) {
    where.schoolId = schoolId;
  }

  if (userId) {
    where.userId = userId;
  }

  if (from || to) {
    where.createdAt = {};

    if (from) {
      where.createdAt.gte = parseDate(from);
    }

    if (to) {
      where.createdAt.lte = parseDate(to, true);
    }
  }

  return where;
};

const auditUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
} as const;

const auditSchoolSelect = {
  id: true,
  name: true,
  code: true,
} as const;

export const getAuditLogsService = async (query: AuditLogQuery) => {
  const page = Math.max(1, Number(query.page) || 1);

  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || 10));

  const where = buildAuditLogWhere(query);

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({
      where,
    }),

    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      include: {
        user: {
          select: auditUserSelect,
        },
        school: {
          select: auditSchoolSelect,
        },
      },
    }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAuditLogByIdService = async (id: string) => {
  const log = await prisma.auditLog.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: auditUserSelect,
      },
      school: {
        select: auditSchoolSelect,
      },
    },
  });

  if (!log) {
    throw new ApiError(404, "Audit log not found");
  }

  return log;
};

export const getRecentAuditLogsService = async (limit = 10) => {
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));

  return prisma.auditLog.findMany({
    take: safeLimit,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    include: {
      user: {
        select: auditUserSelect,
      },
      school: {
        select: auditSchoolSelect,
      },
    },
  });
};

export const getAuditStatsService = async () => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();

  startOfWeek.setDate(startOfWeek.getDate() - day);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, thisWeek, thisMonth, byAction, byModule] =
    await Promise.all([
      prisma.auditLog.count(),

      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
      }),

      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      prisma.auditLog.groupBy({
        by: ["action"],
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            action: "desc",
          },
        },
      }),

      prisma.auditLog.groupBy({
        by: ["module"],
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            module: "desc",
          },
        },
      }),
    ]);

  return {
    total,
    today,
    thisWeek,
    thisMonth,

    byAction: byAction.map((item) => ({
      action: item.action,
      count: item._count._all,
    })),

    byModule: byModule.map((item) => ({
      module: item.module,
      count: item._count._all,
    })),
  };
};

export const createAuditLogService = async (data: CreateAuditLogData) => {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      schoolId: data.schoolId,
      action: data.action,
      module: data.module,
      entity: data.entity,
      entityId: data.entityId,

      meta: data.meta ? (data.meta as Prisma.InputJsonValue) : undefined,

      beforeData: data.beforeData
        ? (data.beforeData as Prisma.InputJsonValue)
        : undefined,

      afterData: data.afterData
        ? (data.afterData as Prisma.InputJsonValue)
        : undefined,

      browser: data.browser,
      device: data.device,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });
};

export const buildAuditLogWhereForExport = (query: AuditLogQuery) => {
  return buildAuditLogWhere(query);
};
