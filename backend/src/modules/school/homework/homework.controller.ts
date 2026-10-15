import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createHomeworkService,
  deleteHomeworkService,
  getHomeworkByIdService,
  getHomeworksService,
  updateHomeworkService,
} from "./homework.service";
import { homeworkListSchema } from "./homework.schema";

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

export const getHomeworks = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const query = homeworkListSchema.parse(req.query);

    const result = await getHomeworksService(schoolId, query);

    res.status(200).json({
      success: true,
      message: "Homeworks fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getHomeworkById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const homeworkId = getParam(req, "id");

    const homework = await getHomeworkByIdService(schoolId, homeworkId);

    res.status(200).json({
      success: true,
      message: "Homework fetched successfully",
      data: homework,
    });
  },
);

export const createHomework = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const homework = await createHomeworkService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Homework created successfully",
      data: homework,
    });
  },
);

export const updateHomework = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const homeworkId = getParam(req, "id");

    const homework = await updateHomeworkService(
      schoolId,
      homeworkId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Homework updated successfully",
      data: homework,
    });
  },
);

export const deleteHomework = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const homeworkId = getParam(req, "id");

    await deleteHomeworkService(schoolId, homeworkId);

    res.status(200).json({
      success: true,
      message: "Homework deleted successfully",
    });
  },
);
