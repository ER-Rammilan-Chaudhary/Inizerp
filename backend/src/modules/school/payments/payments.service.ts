import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreatePaymentInput {
  schoolId: string;
  userId: string;
  studentId?: string | null;
  receiptNo: string;
  amount: number;
  paymentDate?: Date;
  method: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "ONLINE";
  referenceNo?: string | null;
}

const validateStudent = async (schoolId: string, studentId?: string | null) => {
  if (!studentId) {
    return;
  }

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
};

const validateReceiptNo = async (
  schoolId: string,
  receiptNo: string,
  excludeId?: string,
) => {
  const existing = await prisma.payment.findFirst({
    where: {
      schoolId,
      receiptNo,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new ApiError(409, "Receipt number already exists");
  }
};

export const getPayments = async (schoolId: string) => {
  return prisma.payment.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
};

export const getPaymentById = async (schoolId: string, id: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id,
      schoolId,
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

export const createPayment = async (input: CreatePaymentInput) => {
  await validateStudent(input.schoolId, input.studentId);

  await validateReceiptNo(input.schoolId, input.receiptNo);

  return prisma.payment.create({
    data: {
      schoolId: input.schoolId,
      studentId: input.studentId ?? null,
      receiptNo: input.receiptNo,
      amount: input.amount,
      paymentDate: input.paymentDate ?? new Date(),
      method: input.method,
      referenceNo: input.referenceNo ?? null,
      status: "CAPTURED",
      receivedById: input.userId,
    },
  });
};

export const reversePayment = async (
  schoolId: string,
  id: string,
  reversalReason: string,
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id,
      schoolId,
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "CAPTURED") {
    throw new ApiError(400, "Only captured payments can be reversed");
  }

  const allocationCount = await prisma.paymentAllocation.count({
    where: {
      schoolId,
      paymentId: id,
    },
  });

  if (allocationCount > 0) {
    throw new ApiError(
      400,
      "Payment cannot be reversed while it is allocated to invoices",
    );
  }

  return prisma.payment.update({
    where: {
      id,
    },
    data: {
      status: "REVERSED",
      reversedAt: new Date(),
      reversalReason,
    },
  });
};

export const cancelPayment = async (schoolId: string, id: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id,
      schoolId,
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "CAPTURED") {
    throw new ApiError(400, "Only captured payments can be cancelled");
  }

  const allocationCount = await prisma.paymentAllocation.count({
    where: {
      schoolId,
      paymentId: id,
    },
  });

  if (allocationCount > 0) {
    throw new ApiError(
      400,
      "Payment cannot be cancelled while it is allocated to invoices",
    );
  }

  return prisma.payment.update({
    where: {
      id,
    },
    data: {
      status: "CANCELLED",
    },
  });
};
