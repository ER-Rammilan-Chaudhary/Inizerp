import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

export interface CreateInvoiceInput {
  academicYearId?: string | null;
  studentId: string;
  invoiceNo: string;
  issueDate?: Date;
  dueDate: Date;
  subtotal: number;
  discount?: number;
  tax?: number;
}

export interface UpdateInvoiceInput {
  academicYearId?: string | null;
  studentId?: string;
  invoiceNo?: string;
  issueDate?: Date;
  dueDate?: Date;
  subtotal?: number;
  discount?: number;
  tax?: number;
}

const invoiceSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  studentId: true,
  invoiceNo: true,
  issueDate: true,
  dueDate: true,
  subtotal: true,
  discount: true,
  tax: true,
  total: true,
  status: true,
  cancelledAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InvoiceSelect;

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
    throw new ApiError(400, "Student does not belong to this school");
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

const calculateTotal = (subtotal: number, discount: number, tax: number) => {
  const total = subtotal - discount + tax;

  if (total < 0) {
    throw new ApiError(400, "Discount cannot make invoice total negative");
  }

  return total;
};

export const getInvoicesService = async (schoolId: string) => {
  return prisma.invoice.findMany({
    where: {
      schoolId,
    },
    select: invoiceSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getInvoiceByIdService = async (
  schoolId: string,
  invoiceId: string,
) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      schoolId,
    },
    select: invoiceSelect,
  });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return invoice;
};

export const createInvoiceService = async (
  schoolId: string,
  data: CreateInvoiceInput,
) => {
  await validateStudent(schoolId, data.studentId);

  await validateAcademicYear(schoolId, data.academicYearId);

  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      schoolId,
      invoiceNo: data.invoiceNo,
    },
    select: {
      id: true,
    },
  });

  if (existingInvoice) {
    throw new ApiError(409, "Invoice number already exists");
  }

  const issueDate = data.issueDate ?? new Date();

  if (issueDate > data.dueDate) {
    throw new ApiError(400, "Due date must be after issue date");
  }

  const discount = data.discount ?? 0;
  const tax = data.tax ?? 0;

  const total = calculateTotal(data.subtotal, discount, tax);

  return prisma.invoice.create({
    data: {
      schoolId,
      academicYearId: data.academicYearId ?? null,
      studentId: data.studentId,
      invoiceNo: data.invoiceNo,
      issueDate,
      dueDate: data.dueDate,
      subtotal: new Prisma.Decimal(data.subtotal),
      discount: new Prisma.Decimal(discount),
      tax: new Prisma.Decimal(tax),
      total: new Prisma.Decimal(total),
    },
    select: invoiceSelect,
  });
};

export const updateInvoiceService = async (
  schoolId: string,
  invoiceId: string,
  data: UpdateInvoiceInput,
) => {
  const existing = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
      studentId: true,
      academicYearId: true,
      invoiceNo: true,
      issueDate: true,
      dueDate: true,
      subtotal: true,
      discount: true,
      tax: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Invoice not found");
  }

  if (
    existing.status === "PAID" ||
    existing.status === "PARTIAL" ||
    existing.status === "CANCELLED"
  ) {
    throw new ApiError(
      409,
      "Paid, partially paid, or cancelled invoice cannot be edited",
    );
  }

  const finalStudentId = data.studentId ?? existing.studentId;

  const finalAcademicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existing.academicYearId;

  const finalIssueDate = data.issueDate ?? existing.issueDate;

  const finalDueDate = data.dueDate ?? existing.dueDate;

  const finalSubtotal = data.subtotal ?? Number(existing.subtotal);

  const finalDiscount = data.discount ?? Number(existing.discount);

  const finalTax = data.tax ?? Number(existing.tax);

  await validateStudent(schoolId, finalStudentId);

  await validateAcademicYear(schoolId, finalAcademicYearId);

  if (data.invoiceNo !== undefined) {
    const duplicateInvoice = await prisma.invoice.findFirst({
      where: {
        schoolId,
        invoiceNo: data.invoiceNo,
        id: {
          not: invoiceId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateInvoice) {
      throw new ApiError(409, "Invoice number already exists");
    }
  }

  if (finalIssueDate > finalDueDate) {
    throw new ApiError(400, "Due date must be after issue date");
  }

  const total = calculateTotal(finalSubtotal, finalDiscount, finalTax);

  return prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      ...(data.academicYearId !== undefined && {
        academicYearId: data.academicYearId,
      }),

      ...(data.studentId !== undefined && {
        studentId: data.studentId,
      }),

      ...(data.invoiceNo !== undefined && {
        invoiceNo: data.invoiceNo,
      }),

      ...(data.issueDate !== undefined && {
        issueDate: data.issueDate,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate,
      }),

      ...(data.subtotal !== undefined && {
        subtotal: new Prisma.Decimal(finalSubtotal),
      }),

      ...(data.discount !== undefined && {
        discount: new Prisma.Decimal(finalDiscount),
      }),

      ...(data.tax !== undefined && {
        tax: new Prisma.Decimal(finalTax),
      }),

      total: new Prisma.Decimal(total),
    },
    select: invoiceSelect,
  });
};

export const cancelInvoiceService = async (
  schoolId: string,
  invoiceId: string,
) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      schoolId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "CANCELLED") {
    throw new ApiError(409, "Invoice is already cancelled");
  }

  if (invoice.status === "PAID" || invoice.status === "PARTIAL") {
    throw new ApiError(
      409,
      "Paid or partially paid invoice cannot be cancelled",
    );
  }

  return prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
    select: invoiceSelect,
  });
};
