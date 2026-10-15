import { RoleEnum } from "@prisma/client";
import bcrypt from "bcrypt";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateTeacherInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string | null;
  employeeId: string;
  qualification?: string | null;
  experienceYears?: number | null;
  designation?: string | null;
  address?: string | null;
  joiningDate?: Date | null;
  subjectIds?: string[];
}

interface UpdateTeacherInput {
  fullName?: string;
  email?: string;
  phone?: string | null;
  employeeId?: string;
  qualification?: string | null;
  experienceYears?: number | null;
  designation?: string | null;
  address?: string | null;
  joiningDate?: Date | null;
  subjectIds?: string[];
}

const getTeacherOrThrow = async (schoolId: string, teacherId: string) => {
  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      schoolId,
    },
    include: {
      user: true,
    },
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return teacher;
};

const validateSubjects = async (schoolId: string, subjectIds: string[]) => {
  if (subjectIds.length === 0) {
    return;
  }

  const subjects = await prisma.subject.findMany({
    where: {
      id: {
        in: subjectIds,
      },
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (subjects.length !== subjectIds.length) {
    throw new ApiError(400, "One or more subjects not found in this school");
  }
};

export const getTeachersService = async (schoolId: string) => {
  return prisma.teacher.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      employeeId: "asc",
    },
    select: {
      id: true,
      schoolId: true,
      userId: true,
      employeeId: true,
      qualification: true,
      experienceYears: true,
      designation: true,
      address: true,
      joiningDate: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatar: true,
          status: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
        },
      },

      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: {
          name: "asc",
        },
      },

      _count: {
        select: {
          timetables: true,
        },
      },
    },
  });
};

export const getTeacherByIdService = async (
  schoolId: string,
  teacherId: string,
) => {
  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      schoolId,
    },
    select: {
      id: true,
      schoolId: true,
      userId: true,
      employeeId: true,
      qualification: true,
      experienceYears: true,
      designation: true,
      address: true,
      joiningDate: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatar: true,
          status: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
        },
      },

      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: {
          name: "asc",
        },
      },

      _count: {
        select: {
          timetables: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return teacher;
};

export const createTeacherService = async (
  schoolId: string,
  data: CreateTeacherInput,
) => {
  const [existingEmployee, existingEmail] = await Promise.all([
    prisma.teacher.findFirst({
      where: {
        schoolId,
        employeeId: data.employeeId,
      },
    }),

    prisma.user.findUnique({
      where: {
        email: data.email,
      },
    }),
  ]);

  if (existingEmployee) {
    throw new ApiError(409, "Employee ID already exists in this school");
  }

  if (existingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  await validateSubjects(schoolId, data.subjectIds ?? []);

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(process.env.BCRYPT_ROUNDS ?? 12),
  );

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone ?? null,
        role: RoleEnum.TEACHER,
        schoolId,
      },
    });

    const teacher = await tx.teacher.create({
      data: {
        schoolId,
        userId: user.id,
        employeeId: data.employeeId,
        qualification: data.qualification ?? null,
        experienceYears: data.experienceYears ?? null,
        designation: data.designation ?? null,
        address: data.address ?? null,
        joiningDate: data.joiningDate ?? null,

        subjects:
          data.subjectIds && data.subjectIds.length > 0
            ? {
                connect: data.subjectIds.map((subjectId) => ({
                  id: subjectId,
                })),
              }
            : undefined,
      },

      select: {
        id: true,
        schoolId: true,
        userId: true,
        employeeId: true,
        qualification: true,
        experienceYears: true,
        designation: true,
        address: true,
        joiningDate: true,
        createdAt: true,
        updatedAt: true,

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
          },
        },

        subjects: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return teacher;
  });
};

export const updateTeacherService = async (
  schoolId: string,
  teacherId: string,
  data: UpdateTeacherInput,
) => {
  const teacher = await getTeacherOrThrow(schoolId, teacherId);

  if (data.employeeId !== undefined) {
    const existingEmployee = await prisma.teacher.findFirst({
      where: {
        schoolId,
        employeeId: data.employeeId,
        NOT: {
          id: teacherId,
        },
      },
    });

    if (existingEmployee) {
      throw new ApiError(409, "Employee ID already exists in this school");
    }
  }

  if (data.email !== undefined) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: teacher.userId,
        },
      },
    });

    if (existingEmail) {
      throw new ApiError(409, "Email already exists");
    }
  }

  if (data.subjectIds !== undefined) {
    await validateSubjects(schoolId, data.subjectIds);
  }

  return prisma.$transaction(async (tx) => {
    const updatedUser =
      data.fullName !== undefined ||
      data.email !== undefined ||
      data.phone !== undefined
        ? await tx.user.update({
            where: {
              id: teacher.userId,
            },
            data: {
              ...(data.fullName !== undefined && {
                fullName: data.fullName,
              }),

              ...(data.email !== undefined && {
                email: data.email,
              }),

              ...(data.phone !== undefined && {
                phone: data.phone,
              }),
            },
          })
        : teacher.user;

    const updatedTeacher = await tx.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        ...(data.employeeId !== undefined && {
          employeeId: data.employeeId,
        }),

        ...(data.qualification !== undefined && {
          qualification: data.qualification,
        }),

        ...(data.experienceYears !== undefined && {
          experienceYears: data.experienceYears,
        }),

        ...(data.designation !== undefined && {
          designation: data.designation,
        }),

        ...(data.address !== undefined && {
          address: data.address,
        }),

        ...(data.joiningDate !== undefined && {
          joiningDate: data.joiningDate,
        }),

        ...(data.subjectIds !== undefined && {
          subjects: {
            set: data.subjectIds.map((subjectId) => ({
              id: subjectId,
            })),
          },
        }),
      },

      select: {
        id: true,
        schoolId: true,
        userId: true,
        employeeId: true,
        qualification: true,
        experienceYears: true,
        designation: true,
        address: true,
        joiningDate: true,
        createdAt: true,
        updatedAt: true,

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
          },
        },

        subjects: {
          select: {
            id: true,
            name: true,
            code: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    return {
      ...updatedTeacher,
      user: updatedUser,
    };
  });
};

export const deleteTeacherService = async (
  schoolId: string,
  teacherId: string,
) => {
  const teacher = await getTeacherOrThrow(schoolId, teacherId);

  const timetableCount = await prisma.timetable.count({
    where: {
      schoolId,
      teacherId,
    },
  });

  if (timetableCount > 0) {
    throw new ApiError(
      409,
      "Teacher cannot be deleted because timetable records exist",
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.teacher.delete({
      where: {
        id: teacherId,
      },
    });

    await tx.user.delete({
      where: {
        id: teacher.userId,
      },
    });
  });
};
