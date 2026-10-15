import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import {
  createResult,
  deleteResult,
  getResultById,
  getResults,
  updateResult,
} from "./results.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new Error("School context is required");
  }

  return schoolId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new Error("Invalid route parameter");
  }

  return value;
};

export const getResultsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const results = await getResults(schoolId);

    res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: results,
    });
  },
);

export const getResultByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const resultId = getParam(req.params.id);

    const result = await getResultById(schoolId, resultId);

    res.status(200).json({
      success: true,
      message: "Result fetched successfully",
      data: result,
    });
  },
);

export const createResultController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const result = await createResult(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });
  },
);

export const updateResultController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const resultId = getParam(req.params.id);

    const result = await updateResult(schoolId, resultId, req.body);

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: result,
    });
  },
);

export const deleteResultController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const resultId = getParam(req.params.id);

    await deleteResult(schoolId, resultId);

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  },
);
