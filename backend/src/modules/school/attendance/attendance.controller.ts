import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
} from "./attendance.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new Error("School context is required");
  }

  return schoolId;
};

const getUserId = (req: Request): string => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Authentication required");
  }

  return userId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new Error("Invalid route parameter");
  }

  return value;
};

export const getAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const attendance = await getAttendance(schoolId);

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
    });
  },
);

export const getAttendanceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const attendanceId = getParam(req.params.id);

    const attendance = await getAttendanceById(schoolId, attendanceId);

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
    });
  },
);

export const createAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const markedById = getUserId(req);

    const attendance = await createAttendance(schoolId, markedById, req.body);

    res.status(201).json({
      success: true,
      message: "Attendance created successfully",
      data: attendance,
    });
  },
);

export const updateAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const attendanceId = getParam(req.params.id);

    const attendance = await updateAttendance(schoolId, attendanceId, req.body);

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  },
);

export const deleteAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const attendanceId = getParam(req.params.id);

    await deleteAttendance(schoolId, attendanceId);

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  },
);
