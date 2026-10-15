import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreatePaymentAllocationInput {
  schoolId: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
}

const getPayment = async (schoolId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      schoolId,
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "CAPTURED") {
    throw new ApiError(400, "Only captured payments can be allocated");
  }

  return payment;
};

const getInvoice = async (schoolId: string, invoiceId: string) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      schoolId,
    },
  });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "CANCELLED") {
    throw new ApiError(400, "Cancelled invoice cannot receive payment");
  }

  if (invoice.status === "PAID") {
    throw new ApiError(400, "Invoice is already fully paid");
  }

  if (invoice.status === "DRAFT") {
    throw new ApiError(400, "Draft invoice cannot receive payment");
  }

  return invoice;
};

export const getPaymentAllocations = async (schoolId: string) => {
  return prisma.paymentAllocation.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPaymentAllocationById = async (
  schoolId: string,
  id: string,
) => {
  const allocation = await prisma.paymentAllocation.findFirst({
    where: {
      id,
      schoolId,
    },
  });

  if (!allocation) {
    throw new ApiError(404, "Payment allocation not found");
  }

  return allocation;
};

export const createPaymentAllocation = async (
  input: CreatePaymentAllocationInput,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: {
        id: input.paymentId,
        schoolId: input.schoolId,
      },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    if (payment.status !== "CAPTURED") {
      throw new ApiError(400, "Only captured payments can be allocated");
    }

    const invoice = await tx.invoice.findFirst({
      where: {
        id: input.invoiceId,
        schoolId: input.schoolId,
      },
    });

    if (!invoice) {
      throw new ApiError(404, "Invoice not found");
    }

    if (invoice.status === "CANCELLED") {
      throw new ApiError(400, "Cancelled invoice cannot receive payment");
    }

    if (invoice.status === "PAID") {
      throw new ApiError(400, "Invoice is already fully paid");
    }

    if (invoice.status === "DRAFT") {
      throw new ApiError(400, "Draft invoice cannot receive payment");
    }

    if (payment.studentId && payment.studentId !== invoice.studentId) {
      throw new ApiError(
        400,
        "Payment and invoice belong to different students",
      );
    }

    const existingAllocation = await tx.paymentAllocation.findUnique({
      where: {
        paymentId_invoiceId: {
          paymentId: input.paymentId,
          invoiceId: input.invoiceId,
        },
      },
    });

    if (existingAllocation) {
      throw new ApiError(409, "Payment is already allocated to this invoice");
    }

    const allocatedPayment = await tx.paymentAllocation.aggregate({
      where: {
        schoolId: input.schoolId,
        paymentId: input.paymentId,
      },
      _sum: {
        amount: true,
      },
    });

    const allocatedPaymentAmount = Number(allocatedPayment._sum.amount ?? 0);

    const remainingPaymentAmount =
      Number(payment.amount) - allocatedPaymentAmount;

    if (input.amount > remainingPaymentAmount) {
      throw new ApiError(
        400,
        `Allocation amount cannot exceed remaining payment amount (${remainingPaymentAmount.toFixed(2)})`,
      );
    }

    const allocatedInvoice = await tx.paymentAllocation.aggregate({
      where: {
        schoolId: input.schoolId,
        invoiceId: input.invoiceId,
      },
      _sum: {
        amount: true,
      },
    });

    const allocatedInvoiceAmount = Number(allocatedInvoice._sum.amount ?? 0);

    const invoiceRemainingAmount =
      Number(invoice.total) - allocatedInvoiceAmount;

    if (input.amount > invoiceRemainingAmount) {
      throw new ApiError(
        400,
        `Allocation amount cannot exceed remaining invoice amount (${invoiceRemainingAmount.toFixed(2)})`,
      );
    }

    const allocation = await tx.paymentAllocation.create({
      data: {
        schoolId: input.schoolId,
        paymentId: input.paymentId,
        invoiceId: input.invoiceId,
        amount: input.amount,
      },
    });

    const newInvoicePaidAmount = allocatedInvoiceAmount + input.amount;

    let invoiceStatus: "ISSUED" | "PARTIAL" | "PAID" = "PARTIAL";

    if (newInvoicePaidAmount >= Number(invoice.total)) {
      invoiceStatus = "PAID";
    } else if (newInvoicePaidAmount > 0) {
      invoiceStatus = "PARTIAL";
    } else {
      invoiceStatus = "ISSUED";
    }

    const updatedInvoice = await tx.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: invoiceStatus,
      },
    });

    return {
      allocation,
      invoice: updatedInvoice,
    };
  });

  return result;
};

export const deletePaymentAllocation = async (schoolId: string, id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const allocation = await tx.paymentAllocation.findFirst({
      where: {
        id,
        schoolId,
      },
    });

    if (!allocation) {
      throw new ApiError(404, "Payment allocation not found");
    }

    const deletedAllocation = await tx.paymentAllocation.delete({
      where: {
        id,
      },
    });

    const remainingAllocation = await tx.paymentAllocation.aggregate({
      where: {
        schoolId,
        invoiceId: allocation.invoiceId,
      },
      _sum: {
        amount: true,
      },
    });

    const paidAmount = Number(remainingAllocation._sum.amount ?? 0);

    const invoice = await tx.invoice.findFirst({
      where: {
        id: allocation.invoiceId,
        schoolId,
      },
    });

    if (invoice) {
      let status: "ISSUED" | "PARTIAL" | "PAID" = "ISSUED";

      if (paidAmount >= Number(invoice.total)) {
        status = "PAID";
      } else if (paidAmount > 0) {
        status = "PARTIAL";
      }

      await tx.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          status,
        },
      });
    }

    return deletedAllocation;
  });

  return result;
};
