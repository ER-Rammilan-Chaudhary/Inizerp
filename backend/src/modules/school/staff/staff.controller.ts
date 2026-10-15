import { Request, Response } from "express";

import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";

import {
  createStaff,
  deleteStaff,
  getStaff,
  getStaffById,
  updateStaff,
} from "./staff.service";

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

export const getStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const staff = await getStaff(schoolId);

    res.status(200).json({
      success: true,
      message: "Staff fetched successfully",
      data: staff,
    });
  },
);

export const getStaffByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const staffId = getParam(req.params.id);

    const staff = await getStaffById(schoolId, staffId);

    res.status(200).json({
      success: true,
      message: "Staff fetched successfully",
      data: staff,
    });
  },
);

export const createStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const staff = await createStaff(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });
  },
);

export const updateStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const staffId = getParam(req.params.id);

    const staff = await updateStaff(schoolId, staffId, req.body);

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff,
    });
  },
);

export const deleteStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const staffId = getParam(req.params.id);

    const staff = await deleteStaff(schoolId, staffId);

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
      data: staff,
    });
  },
);
