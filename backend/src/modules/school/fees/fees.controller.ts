import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createFee,
  deleteFee,
  getFeeById,
  getFees,
  updateFee,
} from "./fees.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new ApiError(400, "Invalid route parameter");
  }

  return value;
};

export const getFeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const fees = await getFees(schoolId);

    res.status(200).json({
      success: true,
      message: "Fees fetched successfully",
      data: fees,
    });
  },
);

export const getFeeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const feeId = getParam(req.params.id);

    const fee = await getFeeById(schoolId, feeId);

    res.status(200).json({
      success: true,
      message: "Fee fetched successfully",
      data: fee,
    });
  },
);

export const createFeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const fee = await createFee(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: fee,
    });
  },
);

export const updateFeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const feeId = getParam(req.params.id);

    const fee = await updateFee(schoolId, feeId, req.body);

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: fee,
    });
  },
);

export const deleteFeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const feeId = getParam(req.params.id);

    await deleteFee(schoolId, feeId);

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  },
);
