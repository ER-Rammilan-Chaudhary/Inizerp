import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

import {
  getPaymentAllocations,
  getPaymentAllocationById,
  createPaymentAllocation,
  deletePaymentAllocation,
} from "./payment-allocations.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(400, "School context is required");
  }

  return schoolId;
};

const getParam = (req: Request, key: string): string => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    throw new ApiError(400, `${key} is required`);
  }

  return value;
};

export const listPaymentAllocations = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const allocations = await getPaymentAllocations(schoolId);

    res.status(200).json({
      success: true,
      message: "Payment allocations fetched successfully",
      data: allocations,
    });
  },
);

export const getPaymentAllocation = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req, "id");

    const allocation = await getPaymentAllocationById(schoolId, id);

    res.status(200).json({
      success: true,
      message: "Payment allocation fetched successfully",
      data: allocation,
    });
  },
);

export const createPaymentAllocationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const result = await createPaymentAllocation({
      schoolId,
      paymentId: req.body.paymentId,
      invoiceId: req.body.invoiceId,
      amount: req.body.amount,
    });

    res.status(201).json({
      success: true,
      message: "Payment allocated successfully",
      data: result,
    });
  },
);

export const deletePaymentAllocationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req, "id");

    const allocation = await deletePaymentAllocation(schoolId, id);

    res.status(200).json({
      success: true,
      message: "Payment allocation removed successfully",
      data: allocation,
    });
  },
);
