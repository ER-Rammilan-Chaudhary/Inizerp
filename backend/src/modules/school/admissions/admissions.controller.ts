import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

import {
  createAdmissionService,
  deleteAdmissionService,
  getAdmissionByIdService,
  getAdmissionsService,
  getNextApplicationNoService,
  updateAdmissionService,
} from "./admissions.service";

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

export const getAdmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const { academicYearId, appliedClassId, status, search } = req.query;

    const admissions = await getAdmissionsService(schoolId, {
      academicYearId:
        typeof academicYearId === "string" && academicYearId !== "ALL"
          ? academicYearId
          : undefined,
      appliedClassId:
        typeof appliedClassId === "string" && appliedClassId !== "ALL"
          ? appliedClassId
          : undefined,
      status:
        typeof status === "string" && status !== "ALL"
          ? (status as any)
          : undefined,
      search: typeof search === "string" ? search : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Admissions fetched successfully",
      data: admissions,
    });
  },
);

export const getNextApplicationNo = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const academicYearId =
      typeof req.query.academicYearId === "string" &&
      req.query.academicYearId !== "ALL"
        ? req.query.academicYearId
        : undefined;

    const applicationNo = await getNextApplicationNoService(
      schoolId,
      academicYearId,
    );

    res.status(200).json({
      success: true,
      message: "Next application number generated successfully",
      data: { applicationNo },
    });
  },
);

export const getAdmissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const admissionId = getParam(req, "id");

    const admission = await getAdmissionByIdService(schoolId, admissionId);

    res.status(200).json({
      success: true,
      message: "Admission fetched successfully",
      data: admission,
    });
  },
);

export const createAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const admission = await createAdmissionService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Admission created successfully",
      data: admission,
    });
  },
);

export const updateAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const admissionId = getParam(req, "id");

    const admission = await updateAdmissionService(
      schoolId,
      admissionId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      data: admission,
    });
  },
);

export const deleteAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const admissionId = getParam(req, "id");

    await deleteAdmissionService(schoolId, admissionId);

    res.status(200).json({
      success: true,
      message: "Admission deleted successfully",
    });
  },
);
