import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

const staffSelect = {
  id: true,
  schoolId: true,
  userId: true,
  employeeId: true,
  fullName: true,
  designation: true,
  department: true,
  phone: true,
  email: true,
  joiningDate: true,
  salary: true,
  status: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const getStaff = async (schoolId: string) => {
  return prisma.staff.findMany({
    where: {
      schoolId,
      isDeleted: false,
    },
    orderBy: [
      {
        fullName: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: staffSelect,
  });
};

export const getStaffById = async (schoolId: string, staffId: string) => {
  const staff = await prisma.staff.findFirst({
    where: {
      id: staffId,
      schoolId,
      isDeleted: false,
    },
    select: staffSelect,
  });

  if (!staff) {
    throw new ApiError(404, "Staff not found");
  }

  return staff;
};

export const createStaff = async (
  schoolId: string,
  data: Prisma.StaffUncheckedCreateInput,
) => {
  const existing = await prisma.staff.findFirst({
    where: {
      schoolId,
      employeeId: data.employeeId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new ApiError(409, "Employee ID already exists in this school");
  }

  return prisma.staff.create({
    data: {
      schoolId,
      employeeId: data.employeeId,
      fullName: data.fullName,
      designation: data.designation ?? null,
      department: data.department ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      joiningDate: data.joiningDate ?? null,
      salary: data.salary ?? null,
      status: data.status ?? "ACTIVE",
      address: data.address ?? null,
    },
    select: staffSelect,
  });
};

export const updateStaff = async (
  schoolId: string,
  staffId: string,
  data: Prisma.StaffUncheckedUpdateInput,
) => {
  const existing = await prisma.staff.findFirst({
    where: {
      id: staffId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      employeeId: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Staff not found");
  }

  if (
    data.employeeId !== undefined &&
    typeof data.employeeId === "string" &&
    data.employeeId !== existing.employeeId
  ) {
    const duplicate = await prisma.staff.findFirst({
      where: {
        schoolId,
        employeeId: data.employeeId,
        isDeleted: false,
        NOT: {
          id: staffId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      throw new ApiError(409, "Employee ID already exists in this school");
    }
  }

  return prisma.staff.update({
    where: {
      id: staffId,
    },
    data,
    select: staffSelect,
  });
};

export const deleteStaff = async (schoolId: string, staffId: string) => {
  const existing = await prisma.staff.findFirst({
    where: {
      id: staffId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Staff not found");
  }

  return prisma.staff.update({
    where: {
      id: staffId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      status: "INACTIVE",
    },
    select: {
      id: true,
      isDeleted: true,
      deletedAt: true,
      status: true,
    },
  });
};
