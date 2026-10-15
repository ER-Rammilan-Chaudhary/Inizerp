import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createHomeworkSubmissionService,
  deleteHomeworkSubmissionService,
  getHomeworkSubmissionByIdService,
  getHomeworkSubmissionsService,
  updateHomeworkSubmissionService,
} from "./homework-submission.service";
import {
  createHomeworkSubmissionSchema,
  homeworkSubmissionListSchema,
  updateHomeworkSubmissionSchema,
} from "./homework-submission.schema";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

const getParam = (req: Request, name: string): string => {
  const value = req.params[name];

  if (!value || typeof value !== "string") {
    throw new ApiError(400, `${name} is required`);
  }

  return value;
};

export const getHomeworkSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const query = homeworkSubmissionListSchema.parse(req.query);

    const result = await getHomeworkSubmissionsService(schoolId, query);

    res.status(200).json({
      success: true,
      message: "Homework submissions fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getHomeworkSubmissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const submissionId = getParam(req, "id");

    const submission = await getHomeworkSubmissionByIdService(
      schoolId,
      submissionId,
    );

    res.status(200).json({
      success: true,
      message: "Homework submission fetched successfully",
      data: submission,
    });
  },
);

export const createHomeworkSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const input = createHomeworkSubmissionSchema.parse(req.body);

    const submission = await createHomeworkSubmissionService(schoolId, input);

    res.status(201).json({
      success: true,
      message: "Homework submitted successfully",
      data: submission,
    });
  },
);

export const updateHomeworkSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const submissionId = getParam(req, "id");

    const input = updateHomeworkSubmissionSchema.parse(req.body);

    const submission = await updateHomeworkSubmissionService(
      schoolId,
      submissionId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Homework submission updated successfully",
      data: submission,
    });
  },
);

export const deleteHomeworkSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const submissionId = getParam(req, "id");

    await deleteHomeworkSubmissionService(schoolId, submissionId);

    res.status(200).json({
      success: true,
      message: "Homework submission deleted successfully",
    });
  },
);
