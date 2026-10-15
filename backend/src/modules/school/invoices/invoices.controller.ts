import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

import {
  cancelInvoiceService,
  createInvoiceService,
  getInvoiceByIdService,
  getInvoicesService,
  updateInvoiceService,
} from "./invoices.service";

const getParam = (req: Request, name: string): string => {
  const value = req.params[name];

  if (!value || typeof value !== "string") {
    throw new ApiError(400, `${name} is required`);
  }

  return value;
};

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

export const getInvoices = asyncHandler(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);

  const invoices = await getInvoicesService(schoolId);

  res.status(200).json({
    success: true,
    message: "Invoices fetched successfully",
    data: invoices,
  });
});

export const getInvoiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const invoiceId = getParam(req, "id");

    const invoice = await getInvoiceByIdService(schoolId, invoiceId);

    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
    });
  },
);

export const createInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const invoice = await createInvoiceService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  },
);

export const updateInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const invoiceId = getParam(req, "id");

    const invoice = await updateInvoiceService(schoolId, invoiceId, req.body);

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  },
);

export const cancelInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const invoiceId = getParam(req, "id");

    const invoice = await cancelInvoiceService(schoolId, invoiceId);

    res.status(200).json({
      success: true,
      message: "Invoice cancelled successfully",
      data: invoice,
    });
  },
);
