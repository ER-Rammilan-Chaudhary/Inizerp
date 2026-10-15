import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createGuardianService,
  deleteGuardianService,
  getGuardianByIdService,
  getGuardiansService,
  updateGuardianService,
} from "./guardians.service";

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

export const getGuardians = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const guardians = await getGuardiansService(schoolId);

    res.status(200).json({
      success: true,
      message: "Guardians fetched successfully",
      data: guardians,
    });
  },
);

export const getGuardianById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const guardianId = getParam(req, "id");

    const guardian = await getGuardianByIdService(schoolId, guardianId);

    res.status(200).json({
      success: true,
      message: "Guardian fetched successfully",
      data: guardian,
    });
  },
);

export const createGuardian = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const guardian = await createGuardianService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Guardian created successfully",
      data: guardian,
    });
  },
);

export const updateGuardian = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const guardianId = getParam(req, "id");

    const guardian = await updateGuardianService(
      schoolId,
      guardianId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Guardian updated successfully",
      data: guardian,
    });
  },
);

export const deleteGuardian = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const guardianId = getParam(req, "id");

    await deleteGuardianService(schoolId, guardianId);

    res.status(200).json({
      success: true,
      message: "Guardian deleted successfully",
    });
  },
);
