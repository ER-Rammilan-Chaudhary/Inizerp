import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import type {
  AssignFeatureInput,
  BulkFeatureItem,
  CreateFeatureInput,
  FeatureSearchQuery,
  UpdateFeatureInput,
} from "./features.types";

export const getAllFeatures = async (search?: string) => {
  const normalizedSearch = search?.trim();

  return prisma.eRPModule.findMany({
    where: normalizedSearch
      ? {
          OR: [
            {
              name: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              key: {
                contains: normalizedSearch.toUpperCase(),
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: [
      {
        category: "asc",
      },
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
};

export const getFeatureByIdService = async (id: string) => {
  const feature = await prisma.eRPModule.findUnique({
    where: {
      id,
    },
  });

  if (!feature) {
    throw new ApiError(404, "Feature not found.");
  }

  return feature;
};

export const createFeatureService = async (data: CreateFeatureInput) => {
  const name = data.name.trim();
  const key = data.key.trim().toUpperCase();

  const exists = await prisma.eRPModule.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          key,
        },
      ],
    },
  });

  if (exists) {
    throw new ApiError(409, "Feature name or key already exists.");
  }

  return prisma.eRPModule.create({
    data: {
      name,
      key,
      description: data.description?.trim(),
      category: data.category?.trim(),
      icon: data.icon?.trim(),
      route: data.route?.trim(),
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateFeatureService = async (
  id: string,
  data: UpdateFeatureInput,
) => {
  await ensureFeatureExists(id);

  const name = data.name?.trim();
  const key = data.key?.trim().toUpperCase();

  if (name || key) {
    const duplicate = await prisma.eRPModule.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          ...(name
            ? [
                {
                  name: {
                    equals: name,
                    mode: "insensitive" as const,
                  },
                },
              ]
            : []),
          ...(key
            ? [
                {
                  key,
                },
              ]
            : []),
        ],
      },
    });

    if (duplicate) {
      throw new ApiError(409, "Feature name or key already exists.");
    }
  }

  return prisma.eRPModule.update({
    where: {
      id,
    },
    data: {
      ...(name !== undefined && {
        name,
      }),
      ...(key !== undefined && {
        key,
      }),
      ...(data.description !== undefined && {
        description: data.description?.trim(),
      }),
      ...(data.category !== undefined && {
        category: data.category?.trim(),
      }),
      ...(data.icon !== undefined && {
        icon: data.icon?.trim(),
      }),
      ...(data.route !== undefined && {
        route: data.route?.trim(),
      }),
      ...(data.sortOrder !== undefined && {
        sortOrder: data.sortOrder,
      }),
      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),
    },
  });
};

export const deleteFeatureService = async (id: string) => {
  await ensureFeatureExists(id);

  const assignmentCount = await prisma.schoolModule.count({
    where: {
      moduleId: id,
    },
  });

  if (assignmentCount > 0) {
    throw new ApiError(
      409,
      "Feature is assigned to one or more schools. Remove those assignments first.",
    );
  }

  await prisma.eRPModule.delete({
    where: {
      id,
    },
  });

  return null;
};

export const getFeatureCategoriesService = async () => {
  const categories = await prisma.eRPModule.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
    where: {
      category: {
        not: null,
      },
    },
    orderBy: {
      category: "asc",
    },
  });

  return categories
    .map((item) => item.category)
    .filter((category): category is string => Boolean(category));
};

export const getSchoolFeaturesService = async (schoolId: string) => {
  await ensureSchoolExists(schoolId);

  return prisma.schoolModule.findMany({
    where: {
      schoolId,
    },
    include: {
      module: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  
};

export const assignFeatureToSchool = async (
  schoolId: string,
  data: AssignFeatureInput,
  assignedBy?: string,
) => {
  const [school, module] = await Promise.all([
    ensureSchoolExists(schoolId),
    prisma.eRPModule.findUnique({
      where: {
        id: data.moduleId,
      },
    }),
  ]);

  if (!school) {
    throw new ApiError(404, "School not found.");
  }

  if (!module) {
    throw new ApiError(404, "Feature not found.");
  }

  if (!module.isActive) {
    throw new ApiError(400, "Inactive feature cannot be assigned.");
  }

  return prisma.schoolModule.upsert({
    where: {
      schoolId_moduleId: {
        schoolId,
        moduleId: data.moduleId,
      },
    },
    update: {
      enabled: data.enabled ?? true,
      ...(assignedBy !== undefined && {
        assignedBy,
      }),
    },
    create: {
      schoolId,
      moduleId: data.moduleId,
      enabled: data.enabled ?? true,
      assignedBy,
    },
    include: {
      module: true,
    },
  });
};

export const toggleSchoolFeatureService = async (
  schoolId: string,
  moduleId: string,
  enabled: boolean,
) => {
  await ensureSchoolExists(schoolId);
  await ensureFeatureExists(moduleId);

  const feature = await prisma.schoolModule.findUnique({
    where: {
      schoolId_moduleId: {
        schoolId,
        moduleId,
      },
    },
  });

  if (!feature) {
    throw new ApiError(404, "Feature is not assigned to this school.");
  }

  return prisma.schoolModule.update({
    where: {
      schoolId_moduleId: {
        schoolId,
        moduleId,
      },
    },
    data: {
      enabled,
    },
    include: {
      module: true,
    },
  });
};

export const bulkUpdateSchoolFeaturesService = async (
  schoolId: string,
  features: BulkFeatureItem[],
) => {
  await ensureSchoolExists(schoolId);

  const moduleIds = [...new Set(features.map((feature) => feature.moduleId))];

  const modules = await prisma.eRPModule.findMany({
    where: {
      id: {
        in: moduleIds,
      },
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (modules.length !== moduleIds.length) {
    throw new ApiError(404, "One or more features were not found.");
  }

  const inactiveModule = modules.find((module) => !module.isActive);

  if (inactiveModule) {
    throw new ApiError(400, "Inactive features cannot be assigned or updated.");
  }

  await prisma.$transaction(
    features.map((feature) =>
      prisma.schoolModule.upsert({
        where: {
          schoolId_moduleId: {
            schoolId,
            moduleId: feature.moduleId,
          },
        },
        update: {
          enabled: feature.enabled,
        },
        create: {
          schoolId,
          moduleId: feature.moduleId,
          enabled: feature.enabled,
        },
      }),
    ),
  );

  return getSchoolFeaturesService(schoolId);
};

export const getFeatureStatisticsService = async () => {
  const [
    totalFeatures,
    activeFeatures,
    inactiveFeatures,
    totalAssignments,
    enabledAssignments,
  ] = await Promise.all([
    prisma.eRPModule.count(),
    prisma.eRPModule.count({
      where: {
        isActive: true,
      },
    }),
    prisma.eRPModule.count({
      where: {
        isActive: false,
      },
    }),
    prisma.schoolModule.count(),
    prisma.schoolModule.count({
      where: {
        enabled: true,
      },
    }),
  ]);

  return {
    totalFeatures,
    activeFeatures,
    inactiveFeatures,
    totalAssignments,
    enabledAssignments,
    disabledAssignments: totalAssignments - enabledAssignments,
  };
};

export const getFeatureUsageService = async () => {
  return prisma.eRPModule.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          schoolModules: true,
        },
      },
      schoolModules: {
        where: {
          enabled: true,
        },
        select: {
          schoolId: true,
        },
      },
    },
  });
};

export const searchFeaturesService = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
  active,
}: FeatureSearchQuery) => {
  const skip = (page - 1) * limit;
  const normalizedSearch = search.trim();

  const where = {
    ...(normalizedSearch && {
      OR: [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive" as const,
          },
        },
        {
          key: {
            contains: normalizedSearch.toUpperCase(),
            mode: "insensitive" as const,
          },
        },
      ],
    }),
    ...(category && {
      category,
    }),
    ...(active !== undefined && {
      isActive: active,
    }),
  };

  const [features, total] = await Promise.all([
    prisma.eRPModule.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
    prisma.eRPModule.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    features,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

export const ensureFeatureExists = async (id: string) => {
  return getFeatureByIdService(id);
};

export const ensureSchoolExists = async (schoolId: string) => {
  const school = await prisma.school.findFirst({
    where: {
      id: schoolId,
      isDeleted: false,
    },
  });

  if (!school) {
    throw new ApiError(404, "School not found.");
  }

  return school;
};

export const removeFeatureFromSchoolService = async (
  schoolId: string,
  moduleId: string,
) => {
  await ensureSchoolExists(schoolId);
  await ensureFeatureExists(moduleId);

  const feature = await prisma.schoolModule.findUnique({
    where: {
      schoolId_moduleId: {
        schoolId,
        moduleId,
      },
    },
  });

  if (!feature) {
    throw new ApiError(404, "Feature is not assigned to this school.");
  }

  await prisma.schoolModule.delete({
    where: {
      schoolId_moduleId: {
        schoolId,
        moduleId,
      },
    },
  });

  return null;
};

export const validateFeatureDuplicate = async (
  name: string,
  key: string,
  ignoreId?: string,
) => {
  const duplicate = await prisma.eRPModule.findFirst({
    where: {
      ...(ignoreId && {
        id: {
          not: ignoreId,
        },
      }),
      OR: [
        {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
        },
        {
          key: key.trim().toUpperCase(),
        },
      ],
    },
  });

  if (duplicate) {
    throw new ApiError(409, "Feature name or key already exists.");
  }
};
