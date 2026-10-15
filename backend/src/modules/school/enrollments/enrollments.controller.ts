import { Request, Response } from "express";

import { asyncHandler } from "../../../utils/asyncHandler";

import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  getEnrollments,
  promoteStudents,
  updateEnrollment,
} from "./enrollments.service";

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

export const getEnrollmentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const { academicYearId, classId, sectionId, sectionName, status, search } = req.query;

    const enrollments = await getEnrollments(schoolId, {
      academicYearId: typeof academicYearId === "string" ? academicYearId : undefined,
      classId: typeof classId === "string" ? classId : undefined,
      sectionId: typeof sectionId === "string" ? sectionId : undefined,
      sectionName: typeof sectionName === "string" ? sectionName : undefined,
      status: typeof status === "string" ? (status as any) : undefined,
      search: typeof search === "string" ? search : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Enrollments fetched successfully",
      data: enrollments,
    });
  },
);

export const getEnrollmentByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const enrollmentId = getParam(req.params.id);

    const enrollment = await getEnrollmentById(schoolId, enrollmentId);

    res.status(200).json({
      success: true,
      message: "Enrollment fetched successfully",
      data: enrollment,
    });
  },
);

export const createEnrollmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const enrollment = await createEnrollment(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });
  },
);

export const updateEnrollmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const enrollmentId = getParam(req.params.id);

    const enrollment = await updateEnrollment(schoolId, enrollmentId, req.body);

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  },
);

export const deleteEnrollmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const enrollmentId = getParam(req.params.id);

    await deleteEnrollment(schoolId, enrollmentId);

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  },
);

export const promoteStudentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const result = await promoteStudents(schoolId, req.body);

    res.status(200).json({
      success: true,
      message: `${result.promotedCount} student(s) promoted successfully`,
      data: result,
    });
  },
);

