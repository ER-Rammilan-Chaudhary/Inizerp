import { Request, Response } from "express";

import { asyncHandler } from "../../../utils/asyncHandler";

import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "./students.service";

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

const getAvatarPath = (req: Request): string | undefined => {
  if (!req.file) {
    return undefined;
  }

  return `/uploads/users/${req.file.filename}`;
};

export const getStudentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const students = await getStudents(schoolId, req.query);

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  },
);

export const getStudentByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const studentId = getParam(req.params.id);
    const student = await getStudentById(schoolId, studentId);

    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  },
);

export const createStudentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const student = await createStudent(schoolId, {
      ...req.body,
      avatar: getAvatarPath(req),
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  },
);

export const updateStudentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const studentId = getParam(req.params.id);

    const student = await updateStudent(schoolId, studentId, {
      ...req.body,
      avatar: getAvatarPath(req),
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  },
);

export const deleteStudentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const studentId = getParam(req.params.id);

    const result = await deleteStudent(schoolId, studentId);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  },
);
