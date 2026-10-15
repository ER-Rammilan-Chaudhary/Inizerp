import { RoleEnum } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import { hashPassword } from "../../../utils/bcrypt";

interface CreateParentData {
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
  occupation?: string | null;
  address?: string | null;
  annualIncome?: number | null;
  studentIds?: string[];
}

interface UpdateParentData {
  fullName?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  occupation?: string | null;
  address?: string | null;
  annualIncome?: number | null;
  studentIds?: string[];
}

const parentSelect = {
  id: true,
  schoolId: true,
  occupation: true,
  address: true,
  annualIncome: true,
  createdAt: true,
  updatedAt: true,

  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      role: true,
      avatar: true,
      lastLoginAt: true,
      createdAt: true,
    },
  },

  students: {
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      admissionNo: true,
      rollNo: true,
      dob: true,
      gender: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  },
} as const;

const validateStudents = async (schoolId: string, studentIds: string[]) => {
  if (!studentIds.length) {
    return;
  }

  const uniqueStudentIds = [...new Set(studentIds)];

  const students = await prisma.student.findMany({
    where: {
      id: {
        in: uniqueStudentIds,
      },
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (students.length !== uniqueStudentIds.length) {
    throw new ApiError(
      400,
      "One or more students do not belong to this school",
    );
  }
};

export const getParents = async (schoolId: string) => {
  return prisma.parent.findMany({
    where: {
      schoolId,
      user: {
        isDeleted: false,
      },
    },
    select: parentSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getParentById = async (schoolId: string, parentId: string) => {
  const parent = await prisma.parent.findFirst({
    where: {
      id: parentId,
      schoolId,
      user: {
        isDeleted: false,
      },
    },
    select: parentSelect,
  });

  if (!parent) {
    throw new ApiError(404, "Parent not found");
  }

  return parent;
};

export const createParent = async (
  schoolId: string,
  data: CreateParentData,
) => {
  const email = data.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      role: true,
      schoolId: true,
      parent: {
        select: {
          id: true,
          schoolId: true,
        },
      },
    },
  });

  if (existingUser) {
    // If the parent already exists in this school (e.g. sibling enrollment or prior registration), reuse it!
    if (existingUser.role === RoleEnum.PARENT && existingUser.parent && existingUser.parent.schoolId === schoolId) {
      if (data.occupation || data.address || data.phone || data.fullName) {
        await prisma.parent.update({
          where: { id: existingUser.parent.id },
          data: {
            occupation: data.occupation ?? undefined,
            address: data.address ?? undefined,
          },
        });
        if (data.phone || data.fullName) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              fullName: data.fullName ?? undefined,
              phone: data.phone ?? undefined,
            },
          });
        }
      }
      return getParentById(schoolId, existingUser.parent.id);
    }

    throw new ApiError(409, "Email is already registered to another user account");
  }

  const studentIds = [...new Set(data.studentIds ?? [])];

  await validateStudents(schoolId, studentIds);

  const passwordHash = await hashPassword(data.password);

  const parent = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        schoolId,
        fullName: data.fullName,
        email,
        phone: data.phone ?? null,
        password: passwordHash,
        role: RoleEnum.PARENT,
      },
    });

    if (studentIds.length) {
      const linkedStudents = await tx.student.findMany({
        where: {
          id: {
            in: studentIds,
          },
          schoolId,
          isDeleted: false,
        },
        select: {
          id: true,
          parentId: true,
        },
      });

      const alreadyLinked = linkedStudents.filter(
        (student) => student.parentId !== null,
      );

      if (alreadyLinked.length) {
        throw new ApiError(
          409,
          "One or more students are already linked to a parent",
        );
      }

      await tx.student.updateMany({
        where: {
          id: {
            in: studentIds,
          },
          schoolId,
          isDeleted: false,
        },
        data: {
          parentId: null,
        },
      });
    }

    const createdParent = await tx.parent.create({
      data: {
        schoolId,
        userId: user.id,
        occupation: data.occupation ?? null,
        address: data.address ?? null,
        annualIncome: data.annualIncome ?? null,
      },
      select: {
        id: true,
      },
    });

    if (studentIds.length) {
      await tx.student.updateMany({
        where: {
          id: {
            in: studentIds,
          },
          schoolId,
          isDeleted: false,
        },
        data: {
          parentId: createdParent.id,
        },
      });
    }

    return createdParent;
  });

  return getParentById(schoolId, parent.id);
};

export const updateParent = async (
  schoolId: string,
  parentId: string,
  data: UpdateParentData,
) => {
  const existingParent = await prisma.parent.findFirst({
    where: {
      id: parentId,
      schoolId,
      user: {
        isDeleted: false,
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!existingParent) {
    throw new ApiError(404, "Parent not found");
  }

  if (data.email !== undefined) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: existingParent.userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    data.email = email;
  }

  if (data.studentIds !== undefined) {
    const studentIds = [...new Set(data.studentIds)];

    await validateStudents(schoolId, studentIds);
  }

  const updatedParent = await prisma.$transaction(async (tx) => {
    const userData: {
      fullName?: string;
      email?: string;
      phone?: string | null;
      password?: string;
    } = {};

    if (data.fullName !== undefined) {
      userData.fullName = data.fullName;
    }

    if (data.email !== undefined) {
      userData.email = data.email;
    }

    if (data.phone !== undefined) {
      userData.phone = data.phone;
    }

    if (data.password !== undefined) {
      userData.password = await hashPassword(data.password);
    }

    if (Object.keys(userData).length) {
      await tx.user.update({
        where: {
          id: existingParent.userId,
        },
        data: userData,
      });
    }

    const parentData: {
      occupation?: string | null;
      address?: string | null;
      annualIncome?: number | null;
    } = {};

    if (data.occupation !== undefined) {
      parentData.occupation = data.occupation;
    }

    if (data.address !== undefined) {
      parentData.address = data.address;
    }

    if (data.annualIncome !== undefined) {
      parentData.annualIncome = data.annualIncome;
    }

    if (Object.keys(parentData).length) {
      await tx.parent.update({
        where: {
          id: parentId,
        },
        data: parentData,
      });
    }

    if (data.studentIds !== undefined) {
      const studentIds = [...new Set(data.studentIds)];

      const linkedStudents = await tx.student.findMany({
        where: {
          id: {
            in: studentIds,
          },
          schoolId,
          isDeleted: false,
        },
        select: {
          id: true,
          parentId: true,
        },
      });

      const alreadyLinkedToOtherParent = linkedStudents.filter(
        (student) => student.parentId !== null && student.parentId !== parentId,
      );

      if (alreadyLinkedToOtherParent.length) {
        throw new ApiError(
          409,
          "One or more students are already linked to another parent",
        );
      }

      await tx.student.updateMany({
        where: {
          parentId,
          schoolId,
          isDeleted: false,
        },
        data: {
          parentId: null,
        },
      });

      if (studentIds.length) {
        await tx.student.updateMany({
          where: {
            id: {
              in: studentIds,
            },
            schoolId,
            isDeleted: false,
          },
          data: {
            parentId,
          },
        });
      }
    }

    return tx.parent.findUnique({
      where: {
        id: parentId,
      },
      select: {
        id: true,
      },
    });
  });

  if (!updatedParent) {
    throw new ApiError(404, "Parent not found");
  }

  return getParentById(schoolId, parentId);
};

export const deleteParent = async (schoolId: string, parentId: string) => {
  const parent = await prisma.parent.findFirst({
    where: {
      id: parentId,
      schoolId,
      user: {
        isDeleted: false,
      },
    },
    select: {
      id: true,
      userId: true,
      students: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!parent) {
    throw new ApiError(404, "Parent not found");
  }

  if (parent.students.length) {
    throw new ApiError(
      409,
      "Cannot delete parent while students are linked. Unlink the students first.",
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.parent.delete({
      where: {
        id: parentId,
      },
    });

    await tx.user.update({
      where: {
        id: parent.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  });

  return {
    id: parentId,
  };
};
