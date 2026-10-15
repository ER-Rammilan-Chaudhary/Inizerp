import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  updateExam,
} from "./exams.service";

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

export const getExamsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const exams = await getExams(schoolId);

    res.status(200).json({
      success: true,
      message: "Exams fetched successfully",
      data: exams,
    });
  },
);

export const getExamByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const examId = getParam(req.params.id);

    const exam = await getExamById(schoolId, examId);

    res.status(200).json({
      success: true,
      message: "Exam fetched successfully",
      data: exam,
    });
  },
);

export const createExamController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const exam = await createExam(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  },
);

export const updateExamController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const examId = getParam(req.params.id);

    const exam = await updateExam(schoolId, examId, req.body);

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  },
);

export const deleteExamController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const examId = getParam(req.params.id);

    await deleteExam(schoolId, examId);

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  },
);
