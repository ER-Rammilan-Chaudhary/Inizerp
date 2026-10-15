import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

export interface CreateLeaveRequestInput {
  academicYearId?: string | null;
  applicantUserId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason?: string | null;
}

export interface UpdateLeaveRequestInput {
  academicYearId?: string | null;
  applicantUserId?: string;
  leaveType?: string;
  startDate?: Date;
  endDate?: Date;
  reason?: string | null;
}

const leaveRequestSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  applicantUserId: true,
  leaveType: true,
  startDate: true,
  endDate: true,
  reason: true,
  status: true,
  approvedById: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
  cancelledAt: true,
} satisfies Prisma.LeaveRequestSelect;

const validateUser = async (schoolId: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      schoolId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new ApiError(400, "User does not belong to this school");
  }
};

const validateAcademicYear = async (
  schoolId: string,
  academicYearId: string | null | undefined,
) => {
  if (!academicYearId) {
    return;
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id: academicYearId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    throw new ApiError(400, "Academic year does not belong to this school");
  }
};

export const getLeaveRequestsService = async (schoolId: string) => {
  return prisma.leaveRequest.findMany({
    where: {
      schoolId,
    },
    select: leaveRequestSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLeaveRequestByIdService = async (
  schoolId: string,
  leaveRequestId: string,
) => {
  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: leaveRequestSelect,
  });

  if (!leaveRequest) {
    throw new ApiError(404, "Leave request not found");
  }

  return leaveRequest;
};

export const createLeaveRequestService = async (
  schoolId: string,
  data: CreateLeaveRequestInput,
) => {
  await validateUser(schoolId, data.applicantUserId);

  await validateAcademicYear(schoolId, data.academicYearId);

  return prisma.leaveRequest.create({
    data: {
      schoolId,
      academicYearId: data.academicYearId ?? null,
      applicantUserId: data.applicantUserId,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason ?? null,
    },
    select: leaveRequestSelect,
  });
};

export const updateLeaveRequestService = async (
  schoolId: string,
  leaveRequestId: string,
  data: UpdateLeaveRequestInput,
) => {
  const existing = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existing.status === "APPROVED" || existing.status === "REJECTED") {
    throw new ApiError(
      409,
      "Approved or rejected leave request cannot be edited",
    );
  }

  if (data.applicantUserId !== undefined) {
    await validateUser(schoolId, data.applicantUserId);
  }

  if (data.academicYearId !== undefined) {
    await validateAcademicYear(schoolId, data.academicYearId);
  }

  const finalStartDate = data.startDate ?? existing.startDate;

  const finalEndDate = data.endDate ?? existing.endDate;

  if (finalStartDate > finalEndDate) {
    throw new ApiError(400, "Start date must be before or equal to end date");
  }

  return prisma.leaveRequest.update({
    where: {
      id: leaveRequestId,
    },
    data: {
      ...(data.academicYearId !== undefined && {
        academicYearId: data.academicYearId,
      }),

      ...(data.applicantUserId !== undefined && {
        applicantUserId: data.applicantUserId,
      }),

      ...(data.leaveType !== undefined && {
        leaveType: data.leaveType,
      }),

      ...(data.startDate !== undefined && {
        startDate: data.startDate,
      }),

      ...(data.endDate !== undefined && {
        endDate: data.endDate,
      }),

      ...(data.reason !== undefined && {
        reason: data.reason,
      }),
    },
    select: leaveRequestSelect,
  });
};

export const deleteLeaveRequestService = async (
  schoolId: string,
  leaveRequestId: string,
) => {
  const existing = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existing.status === "APPROVED" || existing.status === "REJECTED") {
    throw new ApiError(
      409,
      "Approved or rejected leave request cannot be deleted",
    );
  }

  await prisma.leaveRequest.delete({
    where: {
      id: leaveRequestId,
    },
  });
};

export const approveLeaveRequestService = async (
  schoolId: string,
  leaveRequestId: string,
  approvedById: string,
) => {
  await validateUser(schoolId, approvedById);

  const existing = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existing.status !== "PENDING") {
    throw new ApiError(409, "Only pending leave requests can be approved");
  }

  return prisma.leaveRequest.update({
    where: {
      id: leaveRequestId,
    },
    data: {
      status: "APPROVED",
      approvedById,
      approvedAt: new Date(),
      cancelledAt: null,
    },
    select: leaveRequestSelect,
  });
};

export const rejectLeaveRequestService = async (
  schoolId: string,
  leaveRequestId: string,
  approvedById: string,
) => {
  await validateUser(schoolId, approvedById);

  const existing = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existing.status !== "PENDING") {
    throw new ApiError(409, "Only pending leave requests can be rejected");
  }

  return prisma.leaveRequest.update({
    where: {
      id: leaveRequestId,
    },
    data: {
      status: "REJECTED",
      approvedById,
      approvedAt: new Date(),
      cancelledAt: null,
    },
    select: leaveRequestSelect,
  });
};

export const cancelLeaveRequestService = async (
  schoolId: string,
  leaveRequestId: string,
) => {
  const existing = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveRequestId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existing.status === "REJECTED" || existing.status === "CANCELLED") {
    throw new ApiError(409, "Leave request cannot be cancelled");
  }

  return prisma.leaveRequest.update({
    where: {
      id: leaveRequestId,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
    select: leaveRequestSelect,
  });
};
