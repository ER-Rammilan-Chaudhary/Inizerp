import { Prisma, PrismaClient, School } from "@prisma/client";
import { prisma } from "../config/db.config";

export interface GetSchoolsOptions {
  page: number;
  limit: number;
  search?: string;
}

export class SchoolRepository {
  constructor(
    private readonly db: PrismaClient | Prisma.TransactionClient = prisma,
  ) {}

  async findExisting(slug: string, email?: string) {
    return this.db.school.findFirst({
      where: {
        OR: [{ slug }, ...(email ? [{ email }] : [])],
      },
    });
  }

  async findById(id: string) {
    return this.db.school.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(options: GetSchoolsOptions) {
    const { page, limit, search } = options;

    const where: Prisma.SchoolWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              principal: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const [schools, total] = await Promise.all([
      this.db.school.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.db.school.count({
        where,
      }),
    ]);

    return {
      schools,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSchool(data: Prisma.SchoolCreateInput) {
    return this.db.school.create({
      data,
    });
  }

  async updateSchool(
    id: string,
    data: Prisma.SchoolUpdateInput,
  ): Promise<School> {
    return this.db.school.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteSchool(id: string) {
    return this.db.school.delete({
      where: {
        id,
      },
    });
  }

  async createFeatures(data: Prisma.SchoolFeatureCreateManyInput[]) {
    return this.db.schoolFeature.createMany({
      data,
    });
  }

  async createSubscription(data: Prisma.SubscriptionCreateInput) {
    return this.db.subscription.create({
      data,
    });
  }

  async transaction<T>(
    callback: (repository: SchoolRepository) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return callback(new SchoolRepository(tx));
    });
  }
}
