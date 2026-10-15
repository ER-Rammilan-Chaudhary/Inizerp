import { FeeStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

const feeSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  studentId: true,
  title: true,
  amount: true,
  paidAmount: true,
  dueDate: true,
  paidDate: true,
  paymentMethod: true,
  transactionId: true,
  remarks: true,
  status: true,
  createdAt: true,
  updatedAt: true,

  student: {
    select: {
      id: true,
      admissionNo: true,
      rollNo: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
  },
} as const;

type CreateFeeData = {
  studentId: string;
  academicYearId?: string | null;
  title: string;
  amount: number;
  dueDate: Date;
  remarks?: string | null;
};

type UpdateFeeData = {
  studentId?: string;
  academicYearId?: string | null;
  title?: string;
  amount?: number;
  paidAmount?: number;
  dueDate?: Date;
  paidDate?: Date | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  remarks?: string | null;
};

const getFeeStatus = (
  amount: Prisma.Decimal | number,
  paidAmount: Prisma.Decimal | number,
  dueDate: Date,
): FeeStatus => {
  const total = Number(amount);
  const paid = Number(paidAmount);

  if (paid >= total) {
    return FeeStatus.PAID;
  }

  if (paid > 0) {
    return FeeStatus.PARTIAL;
  }

  if (dueDate < new Date()) {
    return FeeStatus.OVERDUE;
  }

  return FeeStatus.PENDING;
};

const validateStudent = async (schoolId: string, studentId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

const validateAcademicYear = async (
  schoolId: string,
  academicYearId: string,
) => {
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
    throw new ApiError(404, "Academic year not found");
  }

  return academicYear;
};

export const getFees = async (schoolId: string) => {
  return prisma.fee.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      dueDate: "desc",
    },
    select: feeSelect,
  });
};

export const getFeeById = async (schoolId: string, feeId: string) => {
  const fee = await prisma.fee.findFirst({
    where: {
      id: feeId,
      schoolId,
    },
    select: feeSelect,
  });

  if (!fee) {
    throw new ApiError(404, "Fee not found");
  }

  return fee;
};

export const createFee = async (schoolId: string, data: CreateFeeData) => {
  await validateStudent(schoolId, data.studentId);

  if (data.academicYearId) {
    await validateAcademicYear(schoolId, data.academicYearId);
  }

  const amount = new Prisma.Decimal(data.amount);
  const paidAmount = new Prisma.Decimal(0);

  const status = getFeeStatus(amount, paidAmount, data.dueDate);

  return prisma.fee.create({
    data: {
      schoolId,
      studentId: data.studentId,
      academicYearId: data.academicYearId ?? null,
      title: data.title,
      amount,
      paidAmount,
      dueDate: data.dueDate,
      remarks: data.remarks ?? null,
      status,
    },
    select: feeSelect,
  });
};

export const updateFee = async (
  schoolId: string,
  feeId: string,
  data: UpdateFeeData,
) => {
  const existingFee = await prisma.fee.findFirst({
    where: {
      id: feeId,
      schoolId,
    },
  });

  if (!existingFee) {
    throw new ApiError(404, "Fee not found");
  }

  const studentId = data.studentId ?? existingFee.studentId;
  const academicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existingFee.academicYearId;

  await validateStudent(schoolId, studentId);

  if (academicYearId) {
    await validateAcademicYear(schoolId, academicYearId);
  }

  const amount =
    data.amount !== undefined
      ? new Prisma.Decimal(data.amount)
      : existingFee.amount;

  const paidAmount =
    data.paidAmount !== undefined
      ? new Prisma.Decimal(data.paidAmount)
      : existingFee.paidAmount;

  if (paidAmount.greaterThan(amount)) {
    throw new ApiError(400, "Paid amount cannot be greater than fee amount");
  }

  const dueDate =
    data.dueDate !== undefined ? data.dueDate : existingFee.dueDate;

  const status = getFeeStatus(amount, paidAmount, dueDate);

  let paidDate =
    data.paidDate !== undefined ? data.paidDate : existingFee.paidDate;

  if (paidAmount.equals(0)) {
    paidDate = null;
  }

  if (paidAmount.greaterThan(0) && paidDate === null) {
    paidDate = new Date();
  }

  return prisma.fee.update({
    where: {
      id: feeId,
    },
    data: {
      studentId,
      academicYearId,
      title: data.title,
      amount,
      paidAmount,
      dueDate,
      paidDate,
      paymentMethod:
        data.paymentMethod !== undefined
          ? data.paymentMethod
          : existingFee.paymentMethod,
      transactionId:
        data.transactionId !== undefined
          ? data.transactionId
          : existingFee.transactionId,
      remarks: data.remarks !== undefined ? data.remarks : existingFee.remarks,
      status,
    },
    select: feeSelect,
  });
};

export const deleteFee = async (schoolId: string, feeId: string) => {
  const fee = await prisma.fee.findFirst({
    where: {
      id: feeId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!fee) {
    throw new ApiError(404, "Fee not found");
  }

  await prisma.fee.delete({
    where: {
      id: feeId,
    },
  });

  return {
    id: feeId,
  };
};
