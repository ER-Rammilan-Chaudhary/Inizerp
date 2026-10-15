import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import {
  AssignPlanModuleDto,
  BulkAssignPlanModulesDto,
  CreatePlanDto,
  UpdatePlanDto,
} from "./plans.types";

export const createPlanService = async (data: CreatePlanDto) => {
  const name = data.name.trim();
  const code = data.code.trim().toUpperCase();

  const exists = await prisma.subscriptionPlan.findFirst({
    where: {
      OR: [{ name }, { code }],
    },
  });

  if (exists) {
    throw new ApiError(409, "Plan already exists");
  }

  return prisma.subscriptionPlan.create({
    data: {
      name,
      code,
      description: data.description?.trim(),
      price: data.price,
      currency: data.currency ?? "INR",
      durationInDays: data.durationInDays,
      maxStudents: data.maxStudents,
      maxTeachers: data.maxTeachers,
      maxAdmins: data.maxAdmins,
      isActive: true,
    },
  });
};

export const getPlansService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const trimmedSearch = search.trim();

  const where = trimmedSearch
    ? {
        OR: [
          {
            name: {
              contains: trimmedSearch,
              mode: "insensitive" as const,
            },
          },
          {
            code: {
              contains: trimmedSearch,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [plans, total] = await prisma.$transaction([
    prisma.subscriptionPlan.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.subscriptionPlan.count({
      where,
    }),
  ]);

  return {
    plans,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  };
};

export const getPlanByIdService = async (id: string) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
    include: {
      modules: {
        include: {
          module: true,
        },
        orderBy: {
          module: {
            sortOrder: "asc",
          },
        },
      },
    },
  });

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  return plan;
};

export const updatePlanService = async (id: string, data: UpdatePlanDto) => {
  const existing = await prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Plan not found");
  }

  const name = data.name?.trim();
  const code = data.code?.trim().toUpperCase();

  if (name || code) {
    const duplicate = await prisma.subscriptionPlan.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [...(name ? [{ name }] : []), ...(code ? [{ code }] : [])],
      },
    });

    if (duplicate) {
      throw new ApiError(409, "Plan already exists");
    }
  }

  return prisma.subscriptionPlan.update({
    where: {
      id,
    },
    data: {
      ...(name !== undefined && {
        name,
      }),

      ...(code !== undefined && {
        code,
      }),

      ...(data.description !== undefined && {
        description: data.description?.trim(),
      }),

      ...(data.price !== undefined && {
        price: data.price,
      }),

      ...(data.currency !== undefined && {
        currency: data.currency,
      }),

      ...(data.durationInDays !== undefined && {
        durationInDays: data.durationInDays,
      }),

      ...(data.maxStudents !== undefined && {
        maxStudents: data.maxStudents,
      }),

      ...(data.maxTeachers !== undefined && {
        maxTeachers: data.maxTeachers,
      }),

      ...(data.maxAdmins !== undefined && {
        maxAdmins: data.maxAdmins,
      }),
    },
  });
};

export const deletePlanService = async (id: string) => {
  const existing = await prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Plan not found");
  }

  await prisma.subscriptionPlan.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return true;
};

export const updatePlanStatusService = async (
  id: string,
  isActive: boolean,
) => {
  const existing = await prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Plan not found");
  }

  return prisma.subscriptionPlan.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};

/*
|--------------------------------------------------------------------------
| PLAN MODULES
|--------------------------------------------------------------------------
*/

export const getPlanModulesService = async (planId: string) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  return prisma.planModule.findMany({
    where: {
      planId,
      module: {
        isActive: true,
      },
    },
    include: {
      module: true,
    },
    orderBy: {
      module: {
        sortOrder: "asc",
      },
    },
  });
};

export const assignPlanModuleService = async (
  planId: string,
  data: AssignPlanModuleDto,
) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const module = await prisma.eRPModule.findUnique({
    where: {
      id: data.moduleId,
    },
  });

  if (!module) {
    throw new ApiError(404, "ERP module not found");
  }

  if (!module.isActive) {
    throw new ApiError(400, "Cannot assign an inactive ERP module");
  }

  const exists = await prisma.planModule.findUnique({
    where: {
      planId_moduleId: {
        planId,
        moduleId: data.moduleId,
      },
    },
  });

  if (exists) {
    throw new ApiError(409, "Module is already assigned to this plan");
  }

  return prisma.planModule.create({
    data: {
      planId,
      moduleId: data.moduleId,
    },
    include: {
      module: true,
    },
  });
};

export const removePlanModuleService = async (
  planId: string,
  moduleId: string,
) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const planModule = await prisma.planModule.findUnique({
    where: {
      planId_moduleId: {
        planId,
        moduleId,
      },
    },
  });

  if (!planModule) {
    throw new ApiError(404, "Module is not assigned to this plan");
  }

  await prisma.planModule.delete({
    where: {
      planId_moduleId: {
        planId,
        moduleId,
      },
    },
  });

  return true;
};

export const bulkAssignPlanModulesService = async (
  planId: string,
  data: BulkAssignPlanModulesDto,
) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const uniqueModuleIds = [...new Set(data.moduleIds)];

  const modules = await prisma.eRPModule.findMany({
    where: {
      id: {
        in: uniqueModuleIds,
      },
      isActive: true,
    },
  });

  if (modules.length !== uniqueModuleIds.length) {
    throw new ApiError(400, "One or more ERP modules are invalid or inactive");
  }

  await prisma.$transaction(
    uniqueModuleIds.map((moduleId) =>
      prisma.planModule.upsert({
        where: {
          planId_moduleId: {
            planId,
            moduleId,
          },
        },
        update: {},
        create: {
          planId,
          moduleId,
        },
      }),
    ),
  );

  return getPlanModulesService(planId);
};
